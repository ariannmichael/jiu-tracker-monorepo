import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { HttpStatus, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { SubscriptionService } from '../application/subscription.service';
import { VerifyIapDto } from '../application/dto/verify-iap.dto';

@Controller('api')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscription/verify-iap')
  async verifyIap(
    @Request() req: { user: { id: string } },
    @Body() dto: VerifyIapDto,
  ) {
    if (!dto.platform || !dto.receipt) {
      throw new HttpException(
        { error: 'platform and receipt are required' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.subscriptionService.verifyIap(
      req.user.id,
      dto.platform,
      dto.receipt,
    );
  }
}
