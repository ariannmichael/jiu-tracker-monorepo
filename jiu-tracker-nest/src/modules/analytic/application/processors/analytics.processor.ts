import { Processor, WorkerHost } from '@nestjs/bullmq';
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
    try {
      await this.analyticService.recomputeForUser(userId);
      const analytic = await this.analyticService.getByUserId(userId);
      await this.insightService.generateInsights(userId, analytic);
      this.metrics.analyticsRecomputationTotal.inc({ status: 'success' });
    } catch (err) {
      this.metrics.analyticsRecomputationTotal.inc({ status: 'error' });
      throw err;
    } finally {
      this.metrics.analyticsRecomputationDuration.observe(
        { user_id: userId },
        (Date.now() - start) / 1000,
      );
    }
  }
}
