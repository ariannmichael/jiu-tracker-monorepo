export class VerifyIapDto {
  platform!: 'apple' | 'google';
  /** iOS: base64 receipt data. Android: purchase token from the purchase object. */
  receipt!: string;
}
