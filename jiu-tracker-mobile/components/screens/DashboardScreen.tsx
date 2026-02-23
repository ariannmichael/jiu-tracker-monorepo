import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatCard from "../cards/StatCard";
import StreakCard from "../cards/StreakCard";
import PieChart from "../charts/PieChart";
import { useFonts } from 'expo-font';
import { ZenDots_400Regular } from "@expo-google-fonts/zen-dots";
import { Sunflower_300Light, Sunflower_500Medium, Sunflower_700Bold } from "@expo-google-fonts/sunflower";


export default function DashboardScreen() {
  const [fontsLoaded] = useFonts({
    ZenDots_400Regular,
    Sunflower_300Light,
    Sunflower_500Medium,
    Sunflower_700Bold,
  });
  const insets = useSafeAreaInsets();

  // Mock data - replace with actual data from API/context
  const userData = {
    name: "ARIANN MICHAEL FARIAS",
    trainingTime: "4 years",
    classesAttended: 0,
    classesHours: "0:00",
    daysTrained: 0,
    daysTraining: "0:00",
    mostTrainingHoursInOneDay: "0:00",
    dayStreak: 2855,
    milestones: 0,
    openMatSessions: 0,
    competitions: 0,
    newTechniquesLearned: 0,
  };

  const nextMilestone = 3000;
  const progressToMilestone = userData.dayStreak >= nextMilestone ? 100 : (userData.dayStreak / nextMilestone) * 100;

  const performanceData = [
    { label: "Gold", value: 5.9, color: COLORS.ACCENT_YELLOW },
    { label: "Silver", value: 29.4, color: COLORS.GRAY_TEXT },
    { label: "Bronze", value: 23.5, color: COLORS.ACCENT_ORANGE },
    { label: "None", value: 41.2, color: COLORS.GRAY_MEDIUM },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Day Streak — central hero */}
        <StreakCard
          value={userData.dayStreak.toString()}
          label="day streak"
          nextMilestone={nextMilestone}
          progressPercent={progressToMilestone}
        />

        {/* Summary stats: Sessions & Total Hours */}
        <View style={styles.summaryRow}>
          <StatCard title="Sessions" value={userData.classesAttended.toString()} accentColor="purple" />
          <StatCard title="Total Hours" value={userData.classesHours} accentColor="orange" />
        </View>

        {/* Other stats grid */}
        <View style={styles.statsGridContainer}>
          <StatCard title="Days trained" value={userData.daysTrained.toString()} accentColor="orange" />
          <StatCard title="Most hours in one day" value={userData.mostTrainingHoursInOneDay} accentColor="purple" />
          <StatCard title="Milestones" value={userData.milestones.toString()} />
          <StatCard title="Open mat" value={userData.openMatSessions.toString()} />
          <StatCard title="Competitions" value={userData.competitions.toString()} />
          <StatCard title="New techniques" value={userData.newTechniquesLearned.toString()} />
        </View>

        {/* Performance Breakdown */}
        <View style={styles.performanceSection}>
          <View style={styles.performanceCard}>
            <Text style={styles.sectionTitle}>Performance breakdown</Text>
            <PieChart data={performanceData} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
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
});
