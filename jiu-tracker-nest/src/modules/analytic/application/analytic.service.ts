import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '@jiu-tracker/shared';
import { AnalyticRepository } from '../infrastructure/analytic.repository';
import { Analytic, TopTechniqueRow } from '../domain/analytic.entity';
import { TrainingService } from '../../training/application/training.service';
import { TrainingSession } from '../../training/domain/training-session.entity';
import { TechniqueService } from '../../technique/application/technique.service';

@Injectable()
export class AnalyticService {
  private readonly logger = new Logger(AnalyticService.name);

  constructor(
    private readonly analyticRepo: AnalyticRepository,
    private readonly trainingService: TrainingService,
    private readonly techniqueService: TechniqueService,
  ) {}

  async recomputeForUser(userId: string): Promise<void> {
    this.logger.debug({
      event: 'analytics.recompute.requested',
      userId,
    });

    const [result, existing] = await Promise.all([
      this.trainingService.getTrainingsByUserId(userId, 100_000, 0),
      this.analyticRepo.findByUserId(userId),
    ]);
    const row = await this.computeAnalytics(
      userId,
      result.trainings,
      existing?.id ?? null,
    );
    await this.analyticRepo.upsert(row);

    this.logger.log({
      event: 'analytics.recompute.completed',
      userId,
      totalSessions: result.total,
      reusedAnalyticId: existing?.id ?? null,
    });
  }

  async getByUserId(userId: string): Promise<Analytic | null> {
    return this.analyticRepo.findByUserId(userId);
  }

  private async computeAnalytics(
    userId: string,
    sessions: TrainingSession[],
    existingId: string | null,
  ): Promise<Partial<Analytic>> {
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

    const uniqueTechniqueIds = new Set<string>();
    for (const s of sessions) {
      for (const t of s.submit_using_options ?? []) uniqueTechniqueIds.add(t.id);
      for (const t of s.tapped_by_options ?? []) uniqueTechniqueIds.add(t.id);
    }
    const techniqueNames = new Map<
      string,
      { name: string; namePortuguese: string }
    >();
    if (uniqueTechniqueIds.size > 0) {
      const rows = await this.techniqueService.getTechniqueNamesByIds(
        Array.from(uniqueTechniqueIds),
      );
      for (const row of rows) {
        techniqueNames.set(row.id, {
          name: row.name ?? '',
          namePortuguese: row.namePortuguese ?? row.name ?? '',
        });
      }
    }

    let submissionsCount = 0;
    let tappedByCount = 0;
    const techniqueCounts = new Map<
      string,
      { name: string; namePortuguese: string; count: number }
    >();
    const winTechniqueCounts = new Map<
      string,
      { name: string; namePortuguese: string; count: number }
    >();
    const lostTechniqueCounts = new Map<
      string,
      { name: string; namePortuguese: string; count: number }
    >();
    const categoryCounts = new Map<string, number>();
    let giSessions = 0;
    let nogiSessions = 0;

    const getNames = (techniqueId: string) =>
      techniqueNames.get(techniqueId) ?? {
        name: '',
        namePortuguese: '',
      };

    for (const s of sessions) {
      if (s.is_gi) giSessions += 1;
      else nogiSessions += 1;
      const sub = s.submit_using_options?.length ?? 0;
      const tap = s.tapped_by_options?.length ?? 0;
      submissionsCount += sub;
      tappedByCount += tap;
      for (const t of s.submit_using_options ?? []) {
        const key = t.id;
        const { name, namePortuguese } = getNames(key);
        const cur = techniqueCounts.get(key) ?? {
          name,
          namePortuguese,
          count: 0,
        };
        techniqueCounts.set(key, { ...cur, count: cur.count + 1 });
        const winCur = winTechniqueCounts.get(key) ?? {
          name,
          namePortuguese,
          count: 0,
        };
        winTechniqueCounts.set(key, { ...winCur, count: winCur.count + 1 });
        const catKey = String(Category[Number(t.category)] ?? t.category);
        categoryCounts.set(catKey, (categoryCounts.get(catKey) ?? 0) + 1);
      }
      for (const t of s.tapped_by_options ?? []) {
        const key = t.id;
        const { name, namePortuguese } = getNames(key);
        const cur = techniqueCounts.get(key) ?? {
          name,
          namePortuguese,
          count: 0,
        };
        techniqueCounts.set(key, { ...cur, count: cur.count + 1 });
        const lostCur = lostTechniqueCounts.get(key) ?? {
          name,
          namePortuguese,
          count: 0,
        };
        lostTechniqueCounts.set(key, { ...lostCur, count: lostCur.count + 1 });
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
      .map(([techniqueId, { name, namePortuguese, count }]) => ({
        techniqueId,
        name,
        namePortuguese,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topWinTechniques: TopTechniqueRow[] = Array.from(
      winTechniqueCounts.entries(),
    )
      .map(([techniqueId, { name, namePortuguese, count }]) => ({
        techniqueId,
        name,
        namePortuguese,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topLostTechniques: TopTechniqueRow[] = Array.from(
      lostTechniqueCounts.entries(),
    )
      .map(([techniqueId, { name, namePortuguese, count }]) => ({
        techniqueId,
        name,
        namePortuguese,
        count,
      }))
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
      topWinTechniques,
      topLostTechniques,
      giSessions,
      nogiSessions,
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

  private toWeekKey(date: Date): string {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sunday, 1=Monday
    const diff = day === 0 ? -6 : 1 - day; // shift to Monday
    d.setDate(d.getDate() + diff);
    return this.toDateKey(d);
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
    const uniqueWeeks = [
      ...new Set(sortedDates.map((d) => this.toWeekKey(this.parseDateKey(d)))),
    ].sort();
    let maxStreak = 1;
    let run = 1;
    for (let i = 1; i < uniqueWeeks.length; i++) {
      const prev = this.parseDateKey(uniqueWeeks[i - 1]);
      const curr = this.parseDateKey(uniqueWeeks[i]);
      const diff = Math.round(
        (curr.getTime() - prev.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      if (diff === 1) {
        run += 1;
        maxStreak = Math.max(maxStreak, run);
      } else {
        run = 1;
      }
    }
    const todayWeek = this.toWeekKey(this.parseDateKey(today));
    const mostRecentWeek = uniqueWeeks[uniqueWeeks.length - 1];
    const mostRecentWeekDate = this.parseDateKey(mostRecentWeek);
    const todayWeekDate = this.parseDateKey(todayWeek);
    const weeksSinceMostRecent = Math.round(
      (todayWeekDate.getTime() - mostRecentWeekDate.getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    );
    let currentStreak = 0;
    if (weeksSinceMostRecent <= 1) {
      currentStreak = 1;
      let idx = uniqueWeeks.length - 2;
      let expect = this.addDays(mostRecentWeekDate, -7);
      while (idx >= 0) {
        const d = this.parseDateKey(uniqueWeeks[idx]);
        if (d.getTime() === expect.getTime()) {
          currentStreak += 1;
          expect = this.addDays(expect, -7);
          idx -= 1;
        } else {
          break;
        }
      }
    }
    return { currentStreak, maxStreak };
  }
}
