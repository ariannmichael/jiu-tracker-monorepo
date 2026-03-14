import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AnalyticService } from '../analytic.service';
import { InsightService } from '../insight.service';
import { MetricsService } from '../../../../metrics.service';
import type { AnalyticsJobPayload } from '../listeners/training-event.listener';

export const ANALYTICS_QUEUE_NAME = 'analytics';

@Processor(ANALYTICS_QUEUE_NAME, {
  concurrency: 5,
})
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name);

  constructor(
    private readonly analyticService: AnalyticService,
    private readonly insightService: InsightService,
    private readonly metrics: MetricsService,
  ) {
    super();
  }

  async process(job: Job<AnalyticsJobPayload>): Promise<void> {
    const { userId } = job.data;
    const start = Date.now();
    this.logger.debug({
      event: 'analytics.job.started',
      userId,
      jobId: job.id,
      eventType: job.data.eventType,
    });

    try {
      await this.analyticService.recomputeForUser(userId);
      const analytic = await this.analyticService.getByUserId(userId);
      await this.insightService.generateInsights(userId, analytic);
      this.metrics.analyticsRecomputationTotal.inc({ status: 'success' });

      this.logger.log({
        event: 'analytics.job.completed',
        userId,
        jobId: job.id,
        durationMs: Date.now() - start,
      });
    } catch (err) {
      this.metrics.analyticsRecomputationTotal.inc({ status: 'error' });
      this.logger.error({
        err,
        event: 'analytics.job.failed',
        userId,
        jobId: job.id,
      });
      throw err;
    } finally {
      this.metrics.analyticsRecomputationDuration.observe(
        { user_id: userId },
        (Date.now() - start) / 1000,
      );
    }
  }
}
