import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/application/user.service';

const APPLE_PRODUCTION_URL = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async verifyIap(
    userId: string,
    platform: 'apple' | 'google',
    receipt: string,
  ): Promise<{ success: true }> {
    this.logger.debug({
      event: 'subscription.verify.requested',
      userId,
      platform,
      receiptLength: receipt.length,
    });

    if (platform === 'apple') {
      const valid = await this.verifyAppleReceipt(receipt);
      if (!valid) {
        this.logger.warn({
          event: 'subscription.verify.rejected',
          userId,
          platform,
        });
        throw new HttpException(
          { error: 'Invalid or expired receipt' },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (platform === 'google') {
      const valid = await this.verifyGooglePurchase(userId, receipt);
      if (!valid) {
        this.logger.warn({
          event: 'subscription.verify.rejected',
          userId,
          platform,
        });
        throw new HttpException(
          { error: 'Invalid or expired purchase' },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        { error: 'Unsupported platform' },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.setPremium(userId, true);
    this.logger.log({
      event: 'subscription.verify.completed',
      userId,
      platform,
    });
    return { success: true };
  }

  private async verifyAppleReceipt(receiptData: string): Promise<boolean> {
    const sharedSecret = this.configService.get<string>('APPLE_SHARED_SECRET');
    if (!sharedSecret) {
      throw new HttpException(
        { error: 'Apple IAP not configured' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const body = JSON.stringify({
      'receipt-data': receiptData,
      password: sharedSecret,
      'exclude-old-transactions': true,
    });

    let res = await fetch(APPLE_PRODUCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    let data = (await res.json()) as { status: number };

    if (data.status === 21007) {
      this.logger.debug({
        event: 'subscription.apple.retrySandbox',
      });
      res = await fetch(APPLE_SANDBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      data = (await res.json()) as { status: number };
    }

    return data.status === 0;
  }

  private async verifyGooglePurchase(
    _userId: string,
    purchaseToken: string,
  ): Promise<boolean> {
    const packageName = this.configService.get<string>(
      'GOOGLE_PLAY_PACKAGE_NAME',
    );
    const serviceAccountJson = this.configService.get<string>(
      'GOOGLE_SERVICE_ACCOUNT_JSON',
    );

    if (!packageName || !serviceAccountJson) {
      throw new HttpException(
        { error: 'Google IAP not configured' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let credentials: { client_email?: string; private_key?: string };
    try {
      credentials = JSON.parse(serviceAccountJson) as {
        client_email?: string;
        private_key?: string;
      };
    } catch {
      throw new HttpException(
        { error: 'Invalid Google service account JSON' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const subscriptionId =
      this.configService.get<string>('GOOGLE_PLAY_SUBSCRIPTION_ID') ??
      'premium_analytics';
    const accessToken = await this.getGoogleAccessToken(credentials);
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${subscriptionId}/tokens/${encodeURIComponent(purchaseToken)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      this.logger.warn({
        event: 'subscription.google.verify.failed',
        userId: _userId,
        status: res.status,
      });
      return false;
    }
    const data = (await res.json()) as { expiryTimeMillis?: string };
    const expiryMs = data.expiryTimeMillis
      ? parseInt(data.expiryTimeMillis, 10)
      : 0;
    return expiryMs > Date.now();
  }

  private async getGoogleAccessToken(credentials: {
    client_email?: string;
    private_key?: string;
  }): Promise<string> {
    const jwt = await this.createGoogleJwt(credentials);
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });
    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      throw new HttpException(
        { error: 'Google auth failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return tokenData.access_token;
  }

  private async createGoogleJwt(credentials: {
    client_email?: string;
    private_key?: string;
  }): Promise<string> {
    const { createSign } = await import('crypto');
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      'base64url',
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const privateKey = credentials.private_key;
    if (!privateKey) {
      throw new HttpException(
        { error: 'Google service account missing private_key' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const sign = createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(privateKey, 'base64url');
    return `${signatureInput}.${signature}`;
  }

  async cancelPremium(userId: string): Promise<void> {
    await this.userService.setPremium(userId, false);
    this.logger.log({
      event: 'subscription.cancel.completed',
      userId,
    });
  }
}
