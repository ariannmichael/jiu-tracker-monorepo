import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, RADIUS } from "../../constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SubscriptionService from "@/services/subscription.service";

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
  const { t } = useLanguage();
  const [loading, setLoading] = useState<"purchase" | "restore" | null>(null);

  const isPremium = user?.is_premium ?? false;
  const isWeb = Platform.OS === "web";

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
      await initConnection();

      if (Platform.OS === "ios") {
        try {
          await getSubscriptions([productId]);
        } catch {
          // Missing/invalid products still fail at purchase with E_ITEM_UNAVAILABLE
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
            await finishTransaction({ purchase, isConsumable: false });
          }
        } catch (e) {
          Alert.alert(t("error"), (e as Error).message ?? t("pleaseTryAgain"));
        } finally {
          await endConnection();
        }
        return;
      }

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
              await finishTransaction({ purchase, isConsumable: false });
            }
          } catch (e) {
            Alert.alert(t("error"), (e as Error).message ?? t("pleaseTryAgain"));
          }
        }
      });

      await requestPurchase({ request: { skus: [productId] }, type: "inapp" });
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
      <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title}>{t("upgradeToPremium")}</Text>
        <Text style={styles.subtitle}>{t("alreadyHavePremium")}</Text>
        {expiresLabel && (
          <Text style={styles.expiresLabel}>
            {t("premiumUntil")} {expiresLabel}
          </Text>
        )}
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
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.title}>{t("upgradeToPremium")}</Text>
      <Text style={styles.sectionLabel}>{t("premiumWhatYouGet")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit1")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit2")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit3")}</Text>
      <Text style={styles.benefitItem}>• {t("premiumBenefit4")}</Text>
      <Text style={styles.comingSoon}>{t("premiumComingSoonCompetitions")}</Text>


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
    </View>
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
  sectionLabel: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "500",
    fontSize: 16,
    color: COLORS.WHITE,
    marginTop: 8,
    marginBottom: 12,
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
    marginBottom: 32,
    lineHeight: 20,
  },
  webOnlyHint: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 14,
    color: COLORS.ACCENT_ORANGE,
    marginBottom: 20,
    lineHeight: 20,
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
