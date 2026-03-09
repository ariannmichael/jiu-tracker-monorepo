import { COLORS, FONTS, RADIUS, GRADIENTS } from "@/constants";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "@/contexts/LanguageContext";

const CARD_MARGIN = 10;
const PADDING_H = 24;

interface StreakCardProps {
  value: string;
  label: string;
  nextMilestone?: number;
  progressPercent?: number; // 0–100 toward next milestone
}

const StreakCard: React.FC<StreakCardProps> = ({ value, label, nextMilestone, progressPercent = 0 }) => {
  const { width } = useWindowDimensions();
  const { t } = useLanguage();
  const cardWidth = width - PADDING_H * 2;
  return (
    <View style={[styles.streakCard, { width: cardWidth }]}>
      <View style={styles.ringWrapper}>
        <View style={styles.ringGradient}>
          <LinearGradient colors={[...GRADIENTS.STREAK]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </View>
        <View style={styles.ringInner} />
        <View style={styles.ringContent}>
          <Text style={styles.streakValue}>{value}</Text>
          <Text style={styles.streakLabel}>{label}</Text>
        </View>
      </View>
      {nextMilestone != null && (
        <View style={styles.milestoneRow}>
          <Text style={styles.milestoneLabel}>{t("nextMilestone")} {nextMilestone}</Text>
          <View style={styles.milestoneBarBg}>
            <LinearGradient
              colors={[...GRADIENTS.STREAK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.milestoneBarFill, { width: `${Math.min(100, progressPercent)}%` }]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const RING_SIZE = 160;
const RING_STROKE = 10;

const styles = StyleSheet.create({
  streakCard: {
    backgroundColor: COLORS.CARD,
    padding: 24,
    marginBottom: CARD_MARGIN,
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: "center",
    overflow: "hidden",
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  ringGradient: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    overflow: "hidden",
  },
  ringInner: {
    position: "absolute",
    width: RING_SIZE - RING_STROKE * 2,
    height: RING_SIZE - RING_STROKE * 2,
    borderRadius: (RING_SIZE - RING_STROKE * 2) / 2,
    backgroundColor: COLORS.CARD,
    top: RING_STROKE,
    left: RING_STROKE,
  },
  ringContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  streakValue: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 42,
    color: COLORS.WHITE,
  },
  streakLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 13,
    color: COLORS.GRAY_TEXT,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  milestoneRow: {
    width: "100%",
  },
  milestoneLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 12,
    color: COLORS.GRAY_TEXT,
    marginBottom: 6,
  },
  milestoneBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.GRAY_LIGHT,
    overflow: "hidden",
  },
  milestoneBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});

export default StreakCard;