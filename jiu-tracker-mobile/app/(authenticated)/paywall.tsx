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
import * as InAppPurchases from "expo-in-app-purchases";
import type { IAPQueryResponse, InAppPurchase } from "expo-in-app-purchases";
import { COLORS, FONTS, RADIUS } from "../../constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SubscriptionService from "@/services/subscription.service";

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { token, user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<"purchase" | "restore" | null>(null);

  const isPremium = user?.is_premium ?? false;

  const handleVerifyReceipt = async (
    platform: "apple" | "google",
    receipt: string
  ) => {
    if (!token) return;
    try {
      await SubscriptionService.verifyIap(token, platform, receipt);
      await refreshUser();
      router.back();
    } catch (e) {
      Alert.alert(
        t("error"),
        (e as Error).message ?? t("pleaseTryAgain")
      );
    } finally {
      setLoading(null);
    }
  };

  const getReceiptFromPurchase = (
    purchase: { transactionReceipt?: string; purchaseToken?: string },
    platform: "apple" | "google"
  ): string | null => {
    if (platform === "apple") {
      return purchase.transactionReceipt ?? null;
    }
    return purchase.purchaseToken ?? null;
  };

  const handlePurchase = () => {
    if (!token) return;
    setLoading("purchase");
    const platform: "apple" | "google" =
      Platform.OS === "ios" ? "apple" : "google";
    const productId = SubscriptionService.getPremiumProductId();

    const listener = async (result: IAPQueryResponse<InAppPurchase>) => {
      const { responseCode, results } = result;
      setLoading(null);
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results?.[0]) {
        const purchase = results[0];
        const receipt = getReceiptFromPurchase(purchase, platform);
        if (receipt && token) {
          try {
            await handleVerifyReceipt(platform, receipt);
            await InAppPurchases.finishTransactionAsync(purchase, false);
          } catch (e) {
            Alert.alert(t("error"), (e as Error).message ?? t("pleaseTryAgain"));
          }
          return;
        }
      }
      if (responseCode !== InAppPurchases.IAPResponseCode.USER_CANCELED) {
        Alert.alert(t("error"), t("pleaseTryAgain"));
      }
    };

    InAppPurchases.setPurchaseListener(listener);
    InAppPurchases.connectAsync()
      .then(() => InAppPurchases.purchaseItemAsync(productId))
      .catch((e) => {
        setLoading(null);
        Alert.alert(t("error"), (e as Error).message ?? t("pleaseTryAgain"));
      });
  };

  const handleRestore = async () => {
    if (!token) return;
    setLoading("restore");
    try {
      const platform: "apple" | "google" =
        Platform.OS === "ios" ? "apple" : "google";
      const productId = SubscriptionService.getPremiumProductId();
      await InAppPurchases.connectAsync();
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      await InAppPurchases.disconnectAsync();

      if (responseCode === InAppPurchases.IAPResponseCode.OK && results?.length) {
        const premiumPurchase =
          results.find((p: { productId: string }) => p.productId === productId) ?? results[0];
        const receipt = getReceiptFromPurchase(
          premiumPurchase as { transactionReceipt?: string; purchaseToken?: string },
          platform
        );
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
        disabled={loading !== null}
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
        disabled={loading !== null}
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
