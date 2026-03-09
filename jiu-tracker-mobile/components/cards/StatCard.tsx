import { COLORS, FONTS, RADIUS } from "@/constants";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CARD_MARGIN = 10;
const PADDING_H = 24;

interface StatCardProps {
  title: string;
  value: string;
  accentColor?: 'purple' | 'orange' | 'teal' | 'none';
  isLarge?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, accentColor = 'none', isLarge = false }) => {
  const { width } = useWindowDimensions();
  const contentWidth = width - PADDING_H * 2;
  // Two cards per row: 2 * cardWidth + 2 * CARD_MARGIN (between and after first) <= contentWidth
  const cardWidth = isLarge ? contentWidth : (contentWidth - CARD_MARGIN * 2) / 2;
  const gradientColors = accentColor === 'purple' ? [COLORS.ACCENT_PURPLE, COLORS.ACCENT_BLUE] as const
    : accentColor === 'orange' ? [COLORS.ACCENT_ORANGE, COLORS.ACCENT_YELLOW] as const
    : accentColor === 'teal' ? [COLORS.ACCENT_TEAL, COLORS.ACCENT_BLUE] as const
    : null;

  return (
    <View style={[styles.statCard, { width: cardWidth }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {gradientColors && (
        <View style={styles.accentBar}>
          <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: COLORS.CARD,
    padding: 16,
    marginRight: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
    minHeight: 88,
    justifyContent: "space-between",
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
  },
  statValue: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 28,
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  statTitle: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 11,
    color: COLORS.GRAY_TEXT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  accentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: RADIUS.SM,
    overflow: "hidden",
  },
});

export default StatCard;