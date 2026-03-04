import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '@jiu-tracker/shared';
import { AnalyticRepository } from '../infrastructure/analytic.repository';
import { Analytic, TopTechniqueRow } from '../domain/analytic.entity';
import { TrainingService } from '../../training/application/training.service';
import { TrainingSession } from '../../training/domain/training-session.entity';

@Injectable()
export class AnalyticService {
  constructor(
    private readonly analyticRepo: AnalyticRepository,
    private readonly trainingService: TrainingService,
  ) {}

  async recomputeForUser(userId: string): Promise<void> {
    const [result, existing] = await Promise.all([
      this.trainingService.getTrainingsByUserId(userId, 100_000, 0),
      this.analyticRepo.findByUserId(userId),
    ]);
    const row = this.computeAnalytics(
      userId,
      result.trainings,
      existing?.id ?? null,
    );
    await this.analyticRepo.upsert(row);
  }

  async getByUserId(userId: string): Promise<Analytic | null> {
    return this.analyticRepo.findByUserId(userId);
  }

  private computeAnalytics(
    userId: string,
    sessions: TrainingSession[],
    existingId: string | null,
  ): Partial<Analytic> {
    const now = new Date();
    const today = this.toDateKey(now);

    const totalSessions = sessions.length;
    const openMatSessions = sessions.filter((s) => s.is_open_mat).length;
    const totalMinutes = sessions.reduce(
      (sum, s) => sum + Number(s.duration),
      0,
    );

    const dateToMinutes = new Map<string, number>();
    for (const s of sessions) {
      const key = this.toDateKey(s.date);
      const current = dateToMinutes.get(key) ?? 0;
      dateToMinutes.set(key, current + Number(s.duration));
    }
    const sortedDates = Array.from(dateToMinutes.keys()).sort();
    const daysTrained = sortedDates.length;
    const maxMinutesInOneDay =
      daysTrained === 0 ? 0 : Math.max(...Array.from(dateToMinutes.values()));

    const { currentStreak, maxStreak } = this.computeStreaks(
      sortedDates,
      today,
    );

    let submissionsCount = 0;
    let tappedByCount = 0;
    const techniqueCounts = new Map<string, { name: string; count: number }>();
    const categoryCounts = new Map<string, number>();

    for (const s of sessions) {
      const sub = s.submit_using_options?.length ?? 0;
      const tap = s.tapped_by_options?.length ?? 0;
      submissionsCount += sub;
      tappedByCount += tap;
      for (const t of s.submit_using_options ?? []) {
        const key = t.id;
        const cur = techniqueCounts.get(key) ?? {
          name: t.namePortuguese || t.name,
          count: 0,
        };
        techniqueCounts.set(key, { ...cur, count: cur.count + 1 });
        const catKey = String(Category[Number(t.category)] ?? t.category);
        categoryCounts.set(catKey, (categoryCounts.get(catKey) ?? 0) + 1);
      }
      for (const t of s.tapped_by_options ?? []) {
        const key = t.id;
        const cur = techniqueCounts.get(key) ?? {
          name: t.namePortuguese || t.name,
          count: 0,
        };
        techniqueCounts.set(key, { ...cur, count: cur.count + 1 });
        const catKey = String(Category[Number(t.category)] ?? t.category);
        categoryCounts.set(catKey, (categoryCounts.get(catKey) ?? 0) + 1);
      }
    }

    const totalSubTap = submissionsCount + tappedByCount;
    const winRatio =
      totalSubTap === 0
        ? 0
        : Math.round((submissionsCount / totalSubTap) * 10000) / 10000;

    const topTechniques: TopTechniqueRow[] = Array.from(
      techniqueCounts.entries(),
    )
      .map(([techniqueId, { name, count }]) => ({ techniqueId, name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const categoryBreakdown: Record<string, number> = {};
    for (const [k, v] of categoryCounts) {
      categoryBreakdown[k] = v;
    }

    const lastComputedAt = new Date();
    const id = existingId ?? uuidv4();

    return {
      id,
      userId,
      currentStreak,
      maxStreak,
      totalSessions,
      openMatSessions,
      totalMinutes,
      daysTrained,
      maxMinutesInOneDay,
      submissionsCount,
      tappedByCount,
      winRatio,
      uniqueTechniquesCount: techniqueCounts.size,
      topTechniques,
      categoryBreakdown,
      lastComputedAt,
    };
  }

  private toDateKey(date: string | Date): string {
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
  }

  private parseDateKey(key: string): Date {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  private addDays(d: Date, days: number): Date {
    const out = new Date(d);
    out.setDate(out.getDate() + days);
    return out;
  }

  private computeStreaks(
    sortedDates: string[],
    today: string,
  ): { currentStreak: number; maxStreak: number } {
    if (sortedDates.length === 0) {
      return { currentStreak: 0, maxStreak: 0 };
    }
    const uniqueDates = [...new Set(sortedDates)].sort();
    let maxStreak = 1;
    let run = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = this.parseDateKey(uniqueDates[i - 1]);
      const curr = this.parseDateKey(uniqueDates[i]);
      const diff = Math.round(
        (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (diff === 1) {
        run += 1;
        maxStreak = Math.max(maxStreak, run);
      } else {
        run = 1;
      }
    }
    let currentStreak = 0;
    const mostRecent = uniqueDates[uniqueDates.length - 1];
    const mostRecentDate = this.parseDateKey(mostRecent);
    const todayDate = this.parseDateKey(today);
    const daysSinceMostRecent = Math.round(
      (todayDate.getTime() - mostRecentDate.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (daysSinceMostRecent <= 1) {
      currentStreak = 1;
      let idx = uniqueDates.length - 2;
      let expect = this.addDays(mostRecentDate, -1);
      while (idx >= 0) {
        const d = this.parseDateKey(uniqueDates[idx]);
        if (d.getTime() === expect.getTime()) {
          currentStreak += 1;
          expect = this.addDays(expect, -1);
          idx -= 1;
        } else {
          break;
        }
      }
    }
    return { currentStreak, maxStreak };
  }
}
