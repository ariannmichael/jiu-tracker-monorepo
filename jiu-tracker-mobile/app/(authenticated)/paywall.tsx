import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SubscriptionProduct } from "expo-iap";
import { COLORS, FONTS, RADIUS } from "../../constants";
import { SUBSCRIPTION_PRICES_BY_COUNTRY } from "@/constants/subscriptionPricesByCountry";
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "@/constants/legalUrls";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SubscriptionService from "@/services/subscription.service";
import { Purchase } from "expo-iap";
import {
  subscriptionDisplayTitle,
  subscriptionPeriodLabel,
} from "@/utils/subscriptionDisplay";

/** Mirrors expo-iap Purchase fields we use — avoid importing expo-iap at module load (breaks web). */
type IapPurchase = {
  id: string;
  transactionReceipt: string;
  purchaseTokenAndroid?: string;
};

function normalizePurchaseResult(
  result: IapPurchase | IapPurchase[] | void | null
): IapPurchase | null {
  if (result == null) return null;
  return Array.isArray(result) ? result[0] ?? null : result;
}

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { token, user, refreshUser } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState<"purchase" | "restore" | null>(null);
  const [storeSubscription, setStoreSubscription] =
    useState<SubscriptionProduct | null>(null);
  const [storeSubscriptionLoading, setStoreSubscriptionLoading] = useState(
    () => Platform.OS !== "web"
  );

  const isPremium = user?.is_premium ?? false;
  const isWeb = Platform.OS === "web";

  const openLegalUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert(t("error"), t("pleaseTryAgain"));
      return;
    }
    await Linking.openURL(url);
  };

  useEffect(() => {
    if (Platform.OS === "web") return;

    let cancelled = false;

    (async () => {
      try {
        const { initConnection, getSubscriptions, endConnection } =
          await import("expo-iap");
        await initConnection();
        const productId = SubscriptionService.getPremiumProductId();
        const subs = await getSubscriptions([productId]);
        if (!cancelled && subs?.length) {
          const match = subs.find((s) => s.id === productId) ?? subs[0];
          setStoreSubscription(match);
        }
        await endConnection();
      } catch {
        try {
          const { endConnection } = await import("expo-iap");
          await endConnection();
        } catch {
          /* ignore */
        }
      } finally {
        if (!cancelled) {
          setStoreSubscriptionLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleVerifyReceipt = async (
    platform: "apple" | "google",
    receipt: string
  ): Promise<boolean> => {
    if (!token) return false;
    try {
      await SubscriptionService.verifyIap(token, platform, receipt);
      await refreshUser();
      router.back();
      return true;
    } catch (e) {
      Alert.alert(
        t("error"),
        (e as Error).message ?? t("pleaseTryAgain")
      );
      return false;
    } finally {
      setLoading(null);
    }
  };

  const handlePurchase = async () => {
    if (!token) {
      Alert.alert(t("error"), t("pleaseTryAgain"));
      return;
    }
    if (Platform.OS === "web") {
      Alert.alert(t("error"), t("iapMobileOnly"));
      return;
    }

    const {
      endConnection,
      finishTransaction,
      getReceiptIos,
      getSubscriptions,
      initConnection,
      purchaseErrorListener,
      purchaseUpdatedListener,
      requestPurchase,
      sync,
    } = await import("expo-iap");

    setLoading("purchase");
    const productId = SubscriptionService.getPremiumProductId();

    let updateSub: { remove: () => void } | null = null;
    let errorSub: { remove: () => void } | null = null;

    const cleanup = () => {
      updateSub?.remove();
      errorSub?.remove();
    };

    const alertInvalidProductId = (detail?: string) => {
      Alert.alert(
        t("error"),
        `${t("iapProductUnavailable")}\n\n${t("iapProductIdUsedByApp")}\n${productId}${detail ? `\n\n${detail}` : ""}`,
      );
    };

    errorSub = purchaseErrorListener((error: { code?: string; message?: string }) => {
      cleanup();
      setLoading(null);
      if (error.code === "E_USER_CANCELLED") {
        return;
      }
      if (error.code === "E_ITEM_UNAVAILABLE") {
        alertInvalidProductId();
        return;
      }
      Alert.alert(t("error"), error.message ?? t("pleaseTryAgain"));
    });

    try {
      await endConnection();
      await initConnection();

      if (Platform.OS === "ios") {
        try {
          await getSubscriptions([productId]);
        } catch {
          /* missing products fail at purchase */
        }

        const result = await requestPurchase({
          request: { sku: productId },
          type: "subs",
        });
        cleanup();
        const purchase = normalizePurchaseResult(result);
        if (!purchase) {
          setLoading(null);
          await endConnection();
          return;
        }

        await sync();
        let receipt: string;
        try {
          receipt = await getReceiptIos();
        } catch (receiptErr) {
          setLoading(null);
          await endConnection();
          Alert.alert(
            t("error"),
            (receiptErr as Error).message ?? t("pleaseTryAgain")
          );
          return;
        }

        if (!receipt?.length) {
          setLoading(null);
          await endConnection();
          Alert.alert(t("error"), t("pleaseTryAgain"));
          return;
        }

        try {
          const verified = await handleVerifyReceipt("apple", receipt);
          if (verified) {
            await finishTransaction({ purchase: purchase as Purchase, isConsumable: false });
          }
        } catch (e) {
          Alert.alert(t("error"), (e as Error).message ?? t("pleaseTryAgain"));
        } finally {
          await endConnection();
        }
        return;
      }

      const subsList = await getSubscriptions([productId]);
      const androidSub =
        subsList.find((s) => s.id === productId) ?? subsList[0];

      if (
        !androidSub ||
        androidSub.platform !== "android" ||
        !androidSub.subscriptionOfferDetails?.length
      ) {
        cleanup();
        setLoading(null);
        await endConnection();
        alertInvalidProductId();
        return;
      }

      const subscriptionOffers = androidSub.subscriptionOfferDetails.map(
        (d) => ({
          sku: productId,
          offerToken: d.offerToken,
        })
      );

      const platform = "google";
      updateSub = purchaseUpdatedListener(async (purchase: IapPurchase) => {
        cleanup();
        setLoading(null);
        const receipt =
          "purchaseTokenAndroid" in purchase && purchase.purchaseTokenAndroid
            ? purchase.purchaseTokenAndroid
            : purchase.transactionReceipt;
        if (receipt && token) {
          try {
            const verified = await handleVerifyReceipt(platform, receipt);
            if (verified) {
              await finishTransaction({ purchase: purchase as Purchase, isConsumable: false });
            }
          } catch (e) {
            Alert.alert(t("error"), (e as Error).message ?? t("pleaseTryAgain"));
          }
        }
      });

      await requestPurchase({
        request: {
          skus: [productId],
          subscriptionOffers,
        },
        type: "subs",
      });
    } catch (e) {
      cleanup();
      setLoading(null);
      const msg = (e as Error).message ?? "";
      if (
        /invalid product id/i.test(msg) ||
        msg.includes("E_ITEM_UNAVAILABLE")
      ) {
        alertInvalidProductId(msg);
      } else {
        Alert.alert(t("error"), msg || t("pleaseTryAgain"));
      }
    }
  };

  const handleRestore = async () => {
    if (!token) {
      Alert.alert(t("error"), t("pleaseTryAgain"));
      return;
    }
    if (Platform.OS === "web") {
      Alert.alert(t("error"), t("iapMobileOnly"));
      return;
    }

    const {
      endConnection,
      getPurchaseHistory,
      getReceiptIos,
      initConnection,
      sync,
      validateReceiptIos,
    } = await import("expo-iap");

    setLoading("restore");
    const productId = SubscriptionService.getPremiumProductId();

    try {
      await initConnection();

      if (Platform.OS === "ios") {
        await sync();
        let receipt: string | undefined;
        try {
          receipt = await getReceiptIos();
        } catch {
          const validated = await validateReceiptIos(productId);
          receipt = validated.receiptData || undefined;
        }
        await endConnection();

        if (receipt?.length) {
          await handleVerifyReceipt("apple", receipt);
          return;
        }
        Alert.alert(t("error"), t("noPreviousPurchase"));
        return;
      }

      const platform = "google";
      const history = await getPurchaseHistory();
      await endConnection();

      if (history?.length) {
        const premiumPurchase =
          history.find((p: IapPurchase) => p.id === productId) ?? history[0];
        const receipt =
          "purchaseTokenAndroid" in premiumPurchase && premiumPurchase.purchaseTokenAndroid
            ? premiumPurchase.purchaseTokenAndroid
            : premiumPurchase.transactionReceipt;
        if (receipt) {
          await handleVerifyReceipt(platform, receipt);
          return;
        }
      }
      Alert.alert(t("error"), t("noPreviousPurchase"));
    } catch (e) {
      Alert.alert(t("error"), (e as Error).message ?? t("pleaseTryAgain"));
    } finally {
      setLoading(null);
    }
  };

  const handleCancelPremium = () => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/account/subscriptions"
        : "https://play.google.com/store/account/subscriptions";
    Linking.openURL(url).catch(() => {
      Alert.alert(t("error"), t("pleaseTryAgain"));
    });
  };

  const periodText = subscriptionPeriodLabel(storeSubscription, t);
  const subscriptionTitle =
    subscriptionDisplayTitle(storeSubscription) ?? t("subscriptionStoreTitleFallback");
  const priceText =
    storeSubscription?.displayPrice ?? t("subscriptionPeriodSeeStore");

  const legalLinks = (
    <View style={styles.legalBlock}>
      <Pressable
        onPress={() => openLegalUrl(PRIVACY_POLICY_URL)}
        accessibilityRole="link"
        accessibilityLabel={t("privacyPolicyLink")}
      >
        <Text style={styles.legalLink}>{t("privacyPolicyLink")}</Text>
      </Pressable>
      <Pressable
        onPress={() => openLegalUrl(TERMS_OF_USE_URL)}
        accessibilityRole="link"
        accessibilityLabel={t("termsOfUseLink")}
      >
        <Text style={styles.legalLink}>{t("termsOfUseLink")}</Text>
      </Pressable>
    </View>
  );

  const scrollBottomPadding = insets.bottom + 32;

  if (isPremium) {
    const expiresAtRaw = user && "subscription_expires_at" in user
      ? (user as { subscription_expires_at?: string | null }).subscription_expires_at
      : undefined;
    const expiresAt = expiresAtRaw
      ? new Date(expiresAtRaw)
      : null;
    const expiresLabel =
      expiresAt && !Number.isNaN(expiresAt.getTime())
        ? expiresAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : null;

    return (
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 24 }]}
        contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t("upgradeToPremium")}</Text>
        <Text style={styles.subtitle}>{t("alreadyHavePremium")}</Text>
        {expiresLabel && (
          <Text style={styles.expiresLabel}>
            {t("premiumUntil")} {expiresLabel}
          </Text>
        )}
        <Text style={styles.autoRenewNote}>{t("subscriptionAutoRenewNote")}</Text>
        {legalLinks}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("backToDashboard")}
        >
          <Text style={styles.buttonText}>{t("backToDashboard")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCancelPremium}
          accessibilityRole="button"
          accessibilityLabel={t("cancelPremium")}
        >
          <Text style={styles.buttonText}>{t("cancelPremium")}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 24 }]}
      contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{t("upgradeToPremium")}</Text>

      {!isWeb && (
        <View style={styles.disclosureCard}>
          <Text style={styles.disclosureTitle}>{subscriptionTitle}</Text>
          <View style={styles.disclosureRow}>
            <Text style={styles.disclosureLabel}>
              {t("subscriptionBillingPeriodLabel")}
            </Text>
            {storeSubscriptionLoading ? (
              <ActivityIndicator size="small" color={COLORS.GRAY_TEXT} />
            ) : (
              <Text style={styles.disclosureValue}>{periodText}</Text>
            )}
          </View>
          <View style={styles.disclosureRow}>
            <Text style={styles.disclosureLabel}>
              {t("subscriptionPriceLabel")}
            </Text>
            {storeSubscriptionLoading ? (
              <ActivityIndicator size="small" color={COLORS.GRAY_TEXT} />
            ) : (
              <Text style={styles.disclosureValue}>{priceText}</Text>
            )}
          </View>
        </View>
      )}

      {isWeb && (
        <Text style={styles.webSubscriptionHint}>
          {t("subscriptionDetailsOnMobile")}
        </Text>
      )}

      <View style={styles.countryPricesSection}>
        <Text style={styles.countryPricesTitle}>
          {t("subscriptionPricesByCountryTitle")}
        </Text>
        <Text style={styles.countryPricesDisclaimer}>
          {t("subscriptionPricesByCountryDisclaimer")}
        </Text>
        {SUBSCRIPTION_PRICES_BY_COUNTRY.map((row) => (
          <View
            key={`${row.countryEn}-${row.price}`}
            style={styles.countryPriceRow}
          >
            <Text style={styles.countryPriceCountry} numberOfLines={2}>
              {language === "pt" ? row.countryPt : row.countryEn}
            </Text>
            <Text style={styles.countryPriceAmount}>{row.price}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>{t("subscriptionDuringPeriodHeading")}</Text>
      <Text style={styles.sectionLabelMuted}>{t("premiumWhatYouGet")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit1")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit2")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit3")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit4")}</Text>
      <Text style={styles.comingSoon}>{t("premiumComingSoonCompetitions")}</Text>

      <Text style={styles.autoRenewNote}>{t("subscriptionAutoRenewNote")}</Text>

      {legalLinks}

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handlePurchase}
        disabled={loading !== null || isWeb}
      >
        {loading === "purchase" ? (
          <ActivityIndicator color={COLORS.WHITE} />
        ) : (
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            {t("upgradeToPremium")}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRestore}
        disabled={loading !== null || isWeb}
      >
        {loading === "restore" ? (
          <ActivityIndicator color={COLORS.WHITE} />
        ) : (
          <Text style={styles.buttonText}>{t("restorePurchases")}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
    fontSize: 24,
    color: COLORS.WHITE,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
    marginBottom: 24,
  },
  expiresLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 14,
    color: COLORS.GRAY_TEXT_SECONDARY,
    marginBottom: 24,
  },
  disclosureCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 16,
    marginBottom: 20,
  },
  disclosureTitle: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "600",
    fontSize: 17,
    color: COLORS.WHITE,
    marginBottom: 12,
  },
  disclosureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  disclosureLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 14,
    color: COLORS.GRAY_TEXT_SECONDARY,
    flexShrink: 0,
  },
  disclosureValue: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "500",
    fontSize: 15,
    color: COLORS.WHITE,
    flex: 1,
    textAlign: "right",
  },
  webSubscriptionHint: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    marginBottom: 16,
    lineHeight: 20,
  },
  countryPricesSection: {
    backgroundColor: COLORS.CARD,
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 16,
    marginBottom: 20,
  },
  countryPricesTitle: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.WHITE,
    marginBottom: 8,
  },
  countryPricesDisclaimer: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 12,
    color: COLORS.GRAY_TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 12,
  },
  countryPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  countryPriceCountry: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    flex: 1,
  },
  countryPriceAmount: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "500",
    fontSize: 14,
    color: COLORS.WHITE,
    flexShrink: 0,
  },
  sectionLabel: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "500",
    fontSize: 16,
    color: COLORS.WHITE,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionLabelMuted: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 15,
    color: COLORS.GRAY_TEXT,
    marginBottom: 8,
  },
  benefitItem: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 15,
    color: COLORS.GRAY_TEXT,
    marginBottom: 6,
    lineHeight: 22,
    paddingLeft: 4,
  },
  comingSoon: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 14,
    color: COLORS.GRAY_TEXT_SECONDARY,
    fontStyle: "italic",
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
  autoRenewNote: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 12,
    color: COLORS.GRAY_TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 16,
  },
  legalBlock: {
    marginBottom: 20,
    gap: 10,
  },
  legalLink: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "500",
    fontSize: 15,
    color: COLORS.ACCENT_BLUE,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: COLORS.CARD,
    borderRadius: RADIUS.LG,
    padding: 18,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  primaryButton: {
    backgroundColor: COLORS.ACCENT_PURPLE,
    borderColor: "transparent",
  },
  buttonText: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "500",
    fontSize: 16,
    color: COLORS.WHITE,
  },
  primaryButtonText: {
    color: COLORS.WHITE,
  },
});
