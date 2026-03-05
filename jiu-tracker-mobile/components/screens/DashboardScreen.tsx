import React, { useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS, FONTS, RADIUS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatCard from "../cards/StatCard";
import StreakCard from "../cards/StreakCard";
import PieChart from "../charts/PieChart";
import RatioBar from "../charts/RatioBar";
import { useFonts } from 'expo-font';
import { ZenDots_400Regular } from "@expo-google-fonts/zen-dots";
import { Sunflower_300Light, Sunflower_500Medium, Sunflower_700Bold } from "@expo-google-fonts/sunflower";
import { useAnalytics } from "@/contexts/AnalyticsContext";
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

function formatMinutesAsHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function TechniqueList({
  items,
  total,
}: {
  items: TopTechniqueRow[];
  total: number;
}) {
  if (items.length === 0) {
    return (
      <Text style={styles.techniqueListEmpty}>No data yet</Text>
    );
  }
  return (
    <View style={styles.techniqueList}>
      {items.slice(0, 5).map((t, i) => {
        const pct = total > 0 ? Math.round((t.count / total) * 100) : 0;
        return (
          <View key={t.techniqueId + i} style={styles.techniqueRow}>
            <View style={[styles.techniqueDot, { backgroundColor: [COLORS.ACCENT_TEAL, COLORS.ACCENT_PURPLE, COLORS.ACCENT_ORANGE, COLORS.ACCENT_PINK, COLORS.ACCENT_BLUE][i % 5] }]} />
            <Text style={styles.techniqueName} numberOfLines={1}>{t.name}</Text>
            <Text style={styles.techniquePct}>{pct}%</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function DashboardScreen() {
  const [fontsLoaded] = useFonts({
    ZenDots_400Regular,
    Sunflower_300Light,
    Sunflower_500Medium,
    Sunflower_700Bold,
  });
  const insets = useSafeAreaInsets();
  const { analytics, refreshAnalytics, loading, error } = useAnalytics();

  const nextMilestone = 30;
  const currentStreak = analytics?.current_streak ?? 0;
  const progressToMilestone = currentStreak >= nextMilestone ? 100 : (currentStreak / nextMilestone) * 100;

  const performanceData = analytics?.category_breakdown && Object.keys(analytics.category_breakdown).length > 0
    ? Object.entries(analytics.category_breakdown).map(([label, value]) => ({
        label,
        value,
        color: CATEGORY_CHART_COLORS[label] ?? COLORS.GRAY_MEDIUM,
      }))
    : [
        { label: "Submission", value: 0, color: COLORS.ACCENT_PINK },
        { label: "Guard", value: 0, color: COLORS.ACCENT_PURPLE },
        { label: "Sweep", value: 0, color: COLORS.ACCENT_BLUE },
        { label: "Pass", value: 0, color: COLORS.ACCENT_TEAL },
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

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  if (!fontsLoaded) return null;

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
      >
        <StreakCard
          value={currentStreak.toString()}
          label="day streak"
          nextMilestone={nextMilestone}
          progressPercent={progressToMilestone}
        />

        <View style={styles.summaryRow}>
          <StatCard
            title="Sessions"
            value={(analytics?.total_sessions ?? 0).toString()}
            accentColor="purple"
          />
          <StatCard
            title="Total Hours"
            value={formatMinutesAsHours(analytics?.total_minutes ?? 0)}
            accentColor="orange"
          />
        </View>

        <View style={styles.performanceSection}>
          <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
            <Text style={styles.sectionTitle}>Win Ratio</Text>
            <RatioBar segments={winRatioSegments} showPercentInBar />
          </View>
          <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
            <Text style={styles.sectionTitle}>Gi vs NoGi Ratio</Text>
            <RatioBar segments={giNogiSegments} showPercentInBar />
          </View>
          <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
            <Text style={styles.sectionTitle}>Submission Rate</Text>
            <View style={styles.submissionRateRow}>
              <Text style={styles.submissionRateValue}>{submissionRatePct}%</Text>
              <Text style={styles.submissionRateHint}>
                Submissions vs tapped
              </Text>
            </View>
          </View>
          <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
            <Text style={styles.sectionTitle}>Most win techniques</Text>
            <TechniqueList items={topWinTechniques} total={submissionsCount} />
          </View>
          <View style={[styles.performanceCard, styles.performanceCardSpaced]}>
            <Text style={styles.sectionTitle}>Lost techniques</Text>
            <TechniqueList items={topLostTechniques} total={tappedByCount} />
          </View>
        </View>

        <View style={styles.statsGridContainer}>
          <StatCard
            title="Days trained"
            value={(analytics?.days_trained ?? 0).toString()}
            accentColor="orange"
          />
          <StatCard
            title="Most hours in one day"
            value={formatMinutesAsHours(analytics?.max_minutes_in_one_day ?? 0)}
            accentColor="purple"
          />
          <StatCard title="Milestones" value="0" />
          <StatCard
            title="Open mat"
            value={(analytics?.open_mat_sessions ?? 0).toString()}
          />
          <StatCard
            title="New techniques"
            value={(analytics?.unique_techniques_count ?? 0).toString()}
          />
        </View>

        <View style={styles.performanceSection}>
          <View style={styles.performanceCard}>
            <Text style={styles.sectionTitle}>Technique breakdown by category</Text>
            <PieChart data={performanceData} />
          </View>
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
  sectionTitle: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 20,
  },
  submissionRateRow: {
    alignItems: "center",
    marginVertical: 8,
  },
  submissionRateValue: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 42,
    color: COLORS.ACCENT_TEAL,
  },
  submissionRateHint: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 13,
    color: COLORS.GRAY_TEXT,
    marginTop: 4,
  },
  techniqueList: { gap: 10 },
  techniqueListEmpty: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
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
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.WHITE,
  },
  techniquePct: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
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
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 12,
    color: COLORS.ACCENT_ORANGE,
    marginBottom: 20,
  },
});
