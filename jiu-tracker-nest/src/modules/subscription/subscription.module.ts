import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SubscriptionController } from './presentation/subscription.controller';
import { SubscriptionService } from './application/subscription.service';

@Module({
  imports: [UserModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
