import { Injectable } from '@nestjs/common';
import { InsightRepository } from '../infrastructure/insight.repository';
import { Analytic } from '../domain/analytic.entity';
import { Insight } from '../domain/insight.entity';

const STREAK_MILESTONES = [7, 14, 30, 60, 100];

@Injectable()
export class InsightService {
  constructor(private readonly insightRepo: InsightRepository) {}

  async generateInsights(userId: string, analytic: Analytic | null): Promise<void> {
    if (!analytic) return;

    const recentByType = await this.insightRepo.findRecentByType(
      userId,
      'streak_milestone',
      STREAK_MILESTONES.length,
    );
    const existingMilestones = new Set(
      recentByType
        .map((i) => i.metadata?.milestone as number | undefined)
        .filter((m): m is number => typeof m === 'number'),
    );

    for (const milestone of STREAK_MILESTONES) {
      if (
        (analytic.currentStreak >= milestone || analytic.maxStreak >= milestone) &&
        !existingMilestones.has(milestone)
      ) {
        const value = Math.max(analytic.currentStreak, analytic.maxStreak);
        await this.insightRepo.save({
          userId,
          type: 'streak_milestone',
          message: `You hit a ${milestone}-day streak! Keep it up.`,
          metadata: { milestone, value },
        });
        existingMilestones.add(milestone);
      }
    }

    if (analytic.maxMinutesInOneDay >= 120) {
      const recent = await this.insightRepo.findRecentByType(
        userId,
        'personal_record',
        1,
      );
      const hasRecord = recent.some(
        (i) => (i.metadata?.record as string) === 'max_minutes_in_one_day',
      );
      if (!hasRecord) {
        await this.insightRepo.save({
          userId,
          type: 'personal_record',
          message: `New record: ${Math.floor(analytic.maxMinutesInOneDay / 60)}h+ training in one day!`,
          metadata: { record: 'max_minutes_in_one_day', value: analytic.maxMinutesInOneDay },
        });
      }
    }
  }

  async getByUserId(userId: string, limit?: number): Promise<Insight[]> {
    return this.insightRepo.findByUserId(userId, limit ?? 50);
  }

  async markAsRead(id: string, userId: string): Promise<Insight | null> {
    return this.insightRepo.markAsRead(id, userId);
  }
}
