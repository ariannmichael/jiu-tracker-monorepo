import React, { useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS, FONTS, RADIUS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatCard from "../cards/StatCard";
import StreakCard from "../cards/StreakCard";
import PieChart from "../charts/PieChart";
import { useFonts } from 'expo-font';
import { ZenDots_400Regular } from "@expo-google-fonts/zen-dots";
import { Sunflower_300Light, Sunflower_500Medium, Sunflower_700Bold } from "@expo-google-fonts/sunflower";
import { useAnalytics } from "@/contexts/AnalyticsContext";

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
  sectionTitle: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 20,
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
