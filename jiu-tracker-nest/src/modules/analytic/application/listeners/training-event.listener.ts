import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  TrainingCreatedEvent,
  TrainingUpdatedEvent,
  TrainingDeletedEvent,
} from '../../../training/domain/events';

export const ANALYTICS_QUEUE_NAME = 'analytics';

export interface AnalyticsJobPayload {
  userId: string;
  eventType: 'training.created' | 'training.updated' | 'training.deleted';
  idempotencyKey: string;
}

@Injectable()
export class TrainingEventListener {
  private readonly logger = new Logger(TrainingEventListener.name);

  constructor(
    @InjectQueue(ANALYTICS_QUEUE_NAME)
    private readonly analyticsQueue: Queue<AnalyticsJobPayload>,
  ) {}

  @OnEvent('training.created')
  async handleTrainingCreated(event: TrainingCreatedEvent): Promise<void> {
    await this.enqueueRecompute(event.userId, 'training.created', event.idempotencyKey);
  }

  @OnEvent('training.updated')
  async handleTrainingUpdated(event: TrainingUpdatedEvent): Promise<void> {
    await this.enqueueRecompute(event.userId, 'training.updated', event.idempotencyKey);
  }

  @OnEvent('training.deleted')
  async handleTrainingDeleted(event: TrainingDeletedEvent): Promise<void> {
    await this.enqueueRecompute(event.userId, 'training.deleted', event.idempotencyKey);
  }

  private async enqueueRecompute(
    userId: string,
    eventType: AnalyticsJobPayload['eventType'],
    idempotencyKey: string,
  ): Promise<void> {
    await this.analyticsQueue.add(
      'recompute',
      { userId, eventType, idempotencyKey },
      {
        jobId: idempotencyKey,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: { count: 1000 },
      },
    );

    this.logger.debug({
      event: 'analytics.recompute.enqueued',
      userId,
      eventType,
      jobId: idempotencyKey,
    });
  }
}
