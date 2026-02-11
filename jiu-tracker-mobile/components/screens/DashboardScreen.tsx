import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../constants";
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

  const performanceData = [
    { label: "Gold", value: 5.9, color: "#FFD700" },
    { label: "Silver", value: 29.4, color: "#C0C0C0" },
    { label: "Bronze", value: 23.5, color: "#CD7F32" },
    { label: "None", value: 41.2, color: COLORS.GRAY_MEDIUM },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Grid */}
        <View style={styles.statsGridContainer}>
          {/* Row 1 */}
          <StatCard title="CLASSES ATTENDED" value={userData.classesAttended.toString()} />
          <StatCard title="CLASSES HOURS" value={userData.classesHours} />

          {/* Row 2 */}
          <StatCard title="DAYS TRAINED" value={userData.daysTrained.toString()} color={COLORS.YELLOW} isLarge/>
          <StatCard title="MOST TRAINING HOURS IN ON DAY" value={userData.mostTrainingHoursInOneDay} color={COLORS.PURPLE} isLarge />

          {/* Row 3 */}
          <StreakCard value={userData.dayStreak.toString()} label="day streak!" />
          <StatCard title="MILESTONES" value={userData.milestones.toString()} />

          {/* Row 4 */}
          <StatCard title="OPEN MAT SESSIONS" value={userData.openMatSessions.toString()} />
          <StatCard title="COMPETITIONS" value={userData.competitions.toString()} />
          <StatCard title="NEW TECHNIQUES" value={userData.newTechniquesLearned.toString()} />
        </View>

        {/* Performance Breakdown */}
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance Breakdown</Text>
          <PieChart data={performanceData} />
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
  },
  performanceSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 20,
  },
  statsGridContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 30,
  },
});
