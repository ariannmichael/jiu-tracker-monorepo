import { COLORS, FONTS, RADIUS } from "@/constants";
import { StyleSheet, Text, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

const CARD_MARGIN = 10;
const PADDING_H = 24;

// Gradient colors keyed outside component to avoid per-render allocation
const GRADIENT_MAP = {
  purple: [COLORS.ACCENT_PURPLE, COLORS.ACCENT_BLUE] as const,
  orange: [COLORS.ACCENT_ORANGE, COLORS.ACCENT_YELLOW] as const,
  teal: [COLORS.ACCENT_TEAL, COLORS.ACCENT_BLUE] as const,
} as const;

interface StatCardProps {
  title: string;
  value: string;
  accentColor?: "purple" | "orange" | "teal" | "none";
  isLarge?: boolean;
  /** Pass 0-based index for stagger delay on entrance */
  index?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  accentColor = "none",
  isLarge = false,
  index = 0,
}) => {
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const contentWidth = width - PADDING_H * 2;
  const cardWidth = isLarge ? contentWidth : (contentWidth - CARD_MARGIN * 2) / 2;
  const gradientColors = accentColor !== "none" ? GRADIENT_MAP[accentColor] : null;

  const entering = reducedMotion
    ? undefined
    : FadeInDown.duration(350).delay(100 + index * 60);

  return (
    <Animated.View entering={entering} style={[styles.statCard, { width: cardWidth }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {gradientColors && (
        <Animated.View style={styles.accentBar}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: "700",
    fontSize: 28,
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  statTitle: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
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
