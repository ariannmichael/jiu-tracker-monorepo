import Api from "./api";

const PREMIUM_PRODUCT_ID = "premium_analytics";

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
    const response = await fetch(`${Api.BASE_URL}/subscription/verify-iap`, {
      method: "POST",
      headers: {
        ...Api.authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, receipt }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error ?? "Verification failed");
    }
    return response.json();
  }
}
