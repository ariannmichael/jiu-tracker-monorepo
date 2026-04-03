import Api from "./api";

/** Must match the auto-renewable subscription Product ID in App Store Connect & Play Console. */
const PREMIUM_PRODUCT_ID =
  process.env.EXPO_PUBLIC_PREMIUM_PRODUCT_ID ?? "premium_analytics";

export type IapPlatform = "apple" | "google";

export default class SubscriptionService {
  static getPremiumProductId(): string {
    return PREMIUM_PRODUCT_ID;
  }

  static async verifyIap(
    token: string,
    platform: IapPlatform,
    receipt: string
  ): Promise<{ success: true }> {
    const response = await Api.request('/subscription/verify-iap', {
      method: "POST",
      headers: {
        ...Api.authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, receipt }),
    }, {
      operation: 'subscription.verifyIap',
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error ?? "Verification failed");
    }
    return response.json();
  }
}
