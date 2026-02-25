import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsService {
  readonly analyticsRecomputationTotal: Counter;
  readonly analyticsRecomputationDuration: Histogram;

  constructor() {
    this.analyticsRecomputationTotal = new Counter({
      name: 'analytics_recomputation_total',
      help: 'Total number of analytics recomputations',
      labelNames: ['status'],
    });
    this.analyticsRecomputationDuration = new Histogram({
      name: 'analytics_recomputation_duration_seconds',
      help: 'Duration of analytics recomputation in seconds',
      labelNames: ['user_id'],
    });
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
