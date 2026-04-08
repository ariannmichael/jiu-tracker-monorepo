import { IsIn, IsString } from 'class-validator';

export class VerifyIapDto {
  @IsIn(['apple', 'google'])
  platform!: 'apple' | 'google';

  /** iOS: base64 receipt data. Android: purchase token from the purchase object. */
  @IsString()
  receipt!: string;
}
