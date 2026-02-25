import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AnalyticService } from '../application/analytic.service';
import { InsightService } from '../application/insight.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { User } from '../../user/domain/user.entity';

@Controller('api')
export class AnalyticController {
  constructor(
    private readonly analyticService: AnalyticService,
    private readonly insightService: InsightService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  async getAnalytics(@Request() req: { user: User }) {
    try {
      const userId = req.user.id;
      const analytics = await this.analyticService.getByUserId(userId);
      if (!analytics) {
        return { analytics: null };
      }
      return { analytics: this.toResponse(analytics) };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('analytics/recompute')
  async recompute(@Request() req: { user: User }) {
    try {
      const userId = req.user.id;
      await this.analyticService.recomputeForUser(userId);
      const analytics = await this.analyticService.getByUserId(userId);
      return { analytics: analytics ? this.toResponse(analytics) : null };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('insights')
  async getInsights(@Request() req: { user: User }) {
    try {
      const userId = req.user.id;
      const insights = await this.insightService.getByUserId(userId);
      return {
        insights: insights.map((i) => ({
          id: i.id,
          user_id: i.userId,
          type: i.type,
          message: i.message,
          metadata: i.metadata,
          is_read: i.isRead,
          created_at: i.createdAt,
        })),
      };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('insights/:id/read')
  async markInsightRead(
    @Request() req: { user: User },
    @Param('id') id: string,
  ) {
    try {
      const userId = req.user.id;
      const insight = await this.insightService.markAsRead(id, userId);
      if (!insight) {
        throw new HttpException(
          { error: 'Insight not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        insight: {
          id: insight.id,
          user_id: insight.userId,
          type: insight.type,
          message: insight.message,
          metadata: insight.metadata,
          is_read: insight.isRead,
          created_at: insight.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private toResponse(analytic: {
    id: string;
    userId: string;
    currentStreak: number;
    maxStreak: number;
    totalSessions: number;
    openMatSessions: number;
    totalMinutes: number;
    daysTrained: number;
    maxMinutesInOneDay: number;
    submissionsCount: number;
    tappedByCount: number;
    winRatio: number;
    uniqueTechniquesCount: number;
    topTechniques: { techniqueId: string; name: string; count: number }[];
    categoryBreakdown: Record<string, number>;
    lastComputedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: analytic.id,
      user_id: analytic.userId,
      current_streak: analytic.currentStreak,
      max_streak: analytic.maxStreak,
      total_sessions: analytic.totalSessions,
      open_mat_sessions: analytic.openMatSessions,
      total_minutes: analytic.totalMinutes,
      days_trained: analytic.daysTrained,
      max_minutes_in_one_day: analytic.maxMinutesInOneDay,
      submissions_count: analytic.submissionsCount,
      tapped_by_count: analytic.tappedByCount,
      win_ratio: analytic.winRatio,
      unique_techniques_count: analytic.uniqueTechniquesCount,
      top_techniques: analytic.topTechniques,
      category_breakdown: analytic.categoryBreakdown,
      last_computed_at: analytic.lastComputedAt,
      created_at: analytic.createdAt,
      updated_at: analytic.updatedAt,
    };
  }
}
