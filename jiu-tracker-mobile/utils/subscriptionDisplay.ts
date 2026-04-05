import type { SubscriptionProduct } from "expo-iap";
import type { TranslationKeys } from "@/i18n";

/**
 * Human-readable billing period for App Store subscription disclosure.
 */
export function subscriptionPeriodLabel(
  product: SubscriptionProduct | null,
  t: (key: TranslationKeys) => string
): string {
  if (!product) {
    return t("subscriptionPeriodSeeStore");
  }

  if (product.platform === "ios") {
    const unit = product.subscription?.subscriptionPeriod;
    if (unit === "DAY") return t("subscriptionPeriodDay");
    if (unit === "WEEK") return t("subscriptionPeriodWeek");
    if (unit === "MONTH") return t("subscriptionPeriodMonth");
    if (unit === "YEAR") return t("subscriptionPeriodYear");
    return t("subscriptionPeriodSeeStore");
  }

  if (product.platform === "android") {
    const bp =
      product.subscriptionOfferDetails?.[0]?.pricingPhases?.pricingPhaseList?.[0]
        ?.billingPeriod ?? "";
    if (bp === "P1D") return t("subscriptionPeriodDay");
    if (bp === "P1W") return t("subscriptionPeriodWeek");
    if (bp === "P1M") return t("subscriptionPeriodMonth");
    if (bp === "P3M") return t("subscriptionPeriodThreeMonths");
    if (bp === "P1Y") return t("subscriptionPeriodYear");
    if (bp.startsWith("P") && bp.includes("M") && !bp.includes("Y")) {
      return t("subscriptionPeriodMonth");
    }
  }

  return t("subscriptionPeriodSeeStore");
}

export function subscriptionDisplayTitle(product: SubscriptionProduct | null): string | null {
  if (!product) return null;
  if (product.platform === "ios") {
    return product.displayName?.trim() || product.title?.trim() || null;
  }
  return product.name?.trim() || product.title?.trim() || null;
}
