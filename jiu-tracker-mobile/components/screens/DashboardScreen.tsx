import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONTS, RADIUS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatCard from "../cards/StatCard";
import StreakCard from "../cards/StreakCard";
import PieChart from "../charts/PieChart";
import RatioBar from "../charts/RatioBar";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKeys } from "@/i18n";
import type { TopTechniqueRow } from "@jiu-tracker/shared";

const CATEGORY_CHART_COLORS: Record<string, string> = {
  Submission: COLORS.ACCENT_PINK,
  Sweep: COLORS.ACCENT_BLUE,
  Pass: COLORS.ACCENT_TEAL,
  Guard: COLORS.ACCENT_PURPLE,
  Takedown: COLORS.ACCENT_ORANGE,
  Defend: COLORS.ACCENT_GREEN,
  SubmissionEscape: COLORS.ACCENT_YELLOW,
};

const CATEGORY_LABEL_KEYS: Record<string, TranslationKeys> = {
  Submission: "submission",
  Sweep: "sweep",
  Pass: "pass",
  Guard: "guard",
  Takedown: "takedown",
  Defend: "defend",
  SubmissionEscape: "escape",
};

function formatMinutesAsHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function TechniqueList({
  items,
  total,
  emptyLabel,
}: {
  items: TopTechniqueRow[];
  total: number;
  emptyLabel: string;
}) {
  const { language } = useLanguage();
  const isPt = language === "pt";

  if (items.length === 0) {
    return (
      <Text style={styles.techniqueListEmpty}>{emptyLabel}</Text>
    );
  }

  const getDisplayName = (item: TopTechniqueRow) => {
    const pt = item.namePortuguese ?? (item as { name_portuguese?: string }).name_portuguese;
    const en = item.name;
    return isPt ? (pt ?? en) : (en ?? pt);
  };

  return (
    <View style={styles.techniqueList}>
      {items.slice(0, 5).map((item, i) => {
        const displayName = getDisplayName(item);
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <View key={item.techniqueId} style={styles.techniqueRow}>
            <View style={[styles.techniqueDot, { backgroundColor: [COLORS.ACCENT_TEAL, COLORS.ACCENT_PURPLE, COLORS.ACCENT_ORANGE, COLORS.ACCENT_PINK, COLORS.ACCENT_BLUE][i % 5] }]} />
            <Text style={styles.techniqueName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.techniquePct}>{pct}%</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { analytics, recomputeAndRefresh, loading, error } = useAnalytics();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const isPremium = user?.is_premium ?? false;

  const nextMilestone = 30;
  const currentStreak = analytics?.current_streak ?? 0;
  const progressToMilestone = currentStreak >= nextMilestone ? 100 : (currentStreak / nextMilestone) * 100;

  const performanceData = analytics?.category_breakdown && Object.keys(analytics.category_breakdown).length > 0
    ? Object.entries(analytics.category_breakdown).map(([key, value]) => ({
        label: t(CATEGORY_LABEL_KEYS[key] ?? "submission"),
        value,
        color: CATEGORY_CHART_COLORS[key] ?? COLORS.GRAY_MEDIUM,
      }))
    : [
        { label: t("submission"), value: 0, color: COLORS.ACCENT_PINK },
        { label: t("guard"), value: 0, color: COLORS.ACCENT_PURPLE },
        { label: t("sweep"), value: 0, color: COLORS.ACCENT_BLUE },
        { label: t("pass"), value: 0, color: COLORS.ACCENT_TEAL },
      ];

  const submissionsCount = analytics?.submissions_count ?? 0;
  const tappedByCount = analytics?.tapped_by_count ?? 0;
  const totalSubTap = submissionsCount + tappedByCount;
  const winRatioSegments = [
    { label: "Wins", value: submissionsCount, color: COLORS.ACCENT_TEAL },
    { label: "Losses", value: tappedByCount, color: COLORS.ACCENT_PURPLE },
  ];

  const giSessions = analytics?.gi_sessions ?? 0;
  const nogiSessions = analytics?.nogi_sessions ?? 0;
  const totalGiNogi = giSessions + nogiSessions;
  const giNogiSegments = [
    { label: "Gi", value: giSessions, color: COLORS.ACCENT_BLUE },
    { label: "NoGi", value: nogiSessions, color: COLORS.ACCENT_PURPLE },
  ];

  const submissionRatePct = totalSubTap > 0 ? Math.round((submissionsCount / totalSubTap) * 100) : 0;
  const topWinTechniques = (analytics?.top_win_techniques ?? []) as TopTechniqueRow[];
  const topLostTechniques = (analytics?.top_lost_techniques ?? []) as TopTechniqueRow[];

  const onRefresh = async () => {
    setRefreshing(true);
    await recomputeAndRefresh();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      recomputeAndRefresh();
    }, [recomputeAndRefresh]),
  );

  if (loading && !analytics) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.ACCENT_PURPLE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.ACCENT_PURPLE} />
        }
      >
        <StreakCard
          value={currentStreak.toString()}
          label={t("dayStreak")}
          nextMilestone={nextMilestone}
          progressPercent={progressToMilestone}
        />

        <View style={styles.summaryRow}>
          <StatCard
            title={t("sessions")}
            value={(analytics?.total_sessions ?? 0).toString()}
            accentColor="purple"
          />
          <StatCard
            title={t("totalHours")}
            value={formatMinutesAsHours(analytics?.total_minutes ?? 0)}
            accentColor="orange"
          />
        </View>

        <View style={styles.performanceSection}>
          {isPremium ? (
            <>
              <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
                <Text style={styles.sectionTitle}>{t("winRatio")}</Text>
                <RatioBar segments={winRatioSegments} showPercentInBar />
              </View>
              <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
                <Text style={styles.sectionTitle}>{t("giVsNogiRatio")}</Text>
                <RatioBar segments={giNogiSegments} showPercentInBar />
              </View>
              <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
                <Text style={styles.sectionTitle}>{t("submissionRate")}</Text>
                <View style={styles.submissionRateRow}>
                  <Text style={styles.submissionRateValue}>{submissionRatePct}%</Text>
                  <Text style={styles.submissionRateHint}>
                    {t("submissionsVsTapped")}
                  </Text>
                </View>
              </View>
              <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
                <Text style={styles.sectionTitle}>{t("mostWinTechniques")}</Text>
                <TechniqueList items={topWinTechniques} total={submissionsCount} emptyLabel={t("noDataYet")} />
              </View>
              <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
                <Text style={styles.sectionTitle}>{t("lostTechniques")}</Text>
                <TechniqueList items={topLostTechniques} total={tappedByCount} emptyLabel={t("noDataYet")} />
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.performanceCard, styles.premiumCard]}
              onPress={() => router.push("/(authenticated)/paywall")}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionTitle}>{t("unlockPerformanceAnalytics")}</Text>
              <Text style={styles.premiumCardHint}>{t("premiumBenefits")}</Text>
              <Text style={styles.premiumCta}>{t("upgradeToPremium")}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsGridContainer}>
          <StatCard
            title={t("daysTrained")}
            value={(analytics?.days_trained ?? 0).toString()}
            accentColor="orange"
          />
          <StatCard
            title={t("mostHoursInOneDay")}
            value={formatMinutesAsHours(analytics?.max_minutes_in_one_day ?? 0)}
            accentColor="purple"
          />
          <StatCard title={t("milestones")} value="0" />
          <StatCard
            title={t("openMat")}
            value={(analytics?.open_mat_sessions ?? 0).toString()}
          />
          <StatCard
            title={t("newTechniques")}
            value={(analytics?.unique_techniques_count ?? 0).toString()}
          />
        </View>

        <View style={styles.performanceSection}>
          {isPremium ? (
            <View style={styles.performanceCard}>
              <Text style={styles.sectionTitle}>{t("techniqueBreakdown")}</Text>
              <PieChart data={performanceData} />
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.performanceCard, styles.premiumCard]}
              onPress={() => router.push("/(authenticated)/paywall")}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionTitle}>{t("unlockTechniqueBreakdown")}</Text>
              <Text style={styles.premiumCardHint}>{t("premiumBenefits")}</Text>
              <Text style={styles.premiumCta}>{t("upgradeToPremium")}</Text>
            </TouchableOpacity>
          )}
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: 24,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    width: "100%",
  },
  performanceSection: {
    marginBottom: 20,
  },
  performanceCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: RADIUS.LG,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  performanceCardSpaced: {
    marginBottom: 16,
  },
  premiumCard: {
    alignItems: "center",
    paddingVertical: 24,
  },
  premiumCardHint: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  premiumCta: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: "500",
    fontSize: 16,
    color: COLORS.ACCENT_PURPLE,
  },
  sectionTitle: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 20,
  },
  submissionRateRow: {
    alignItems: "center",
    marginVertical: 8,
  },
  submissionRateValue: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 42,
    color: COLORS.ACCENT_TEAL,
  },
  submissionRateHint: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 13,
    color: COLORS.GRAY_TEXT,
    marginTop: 4,
  },
  techniqueList: { gap: 10 },
  techniqueListEmpty: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
  },
  techniqueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  techniqueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  techniqueName: {
    flex: 1,
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 14,
    color: COLORS.WHITE,
  },
  techniquePct: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    width: "100%",
  },
  statsGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
    width: "100%",
  },
  errorText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 12,
    color: COLORS.ACCENT_ORANGE,
    marginBottom: 20,
  },
});
