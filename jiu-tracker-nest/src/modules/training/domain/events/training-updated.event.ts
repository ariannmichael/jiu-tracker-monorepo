export class TrainingUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly trainingId: string,
    public readonly idempotencyKey: string,
  ) {}
}
