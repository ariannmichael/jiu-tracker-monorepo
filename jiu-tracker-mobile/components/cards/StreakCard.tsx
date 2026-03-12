import React, { useState, useEffect, useRef } from "react";
import { COLORS, FONTS, RADIUS, GRADIENTS } from "@/constants";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "@/contexts/LanguageContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  Easing,
  useReducedMotion,
} from "react-native-reanimated";

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
  const reducedMotion = useReducedMotion();

  // Count-up animation for the streak number
  const numericValue = parseInt(value) || 0;
  const [displayValue, setDisplayValue] = useState(reducedMotion ? numericValue : 0);
  const prevValueRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(numericValue);
      return;
    }
    // Only animate when value actually changes (not on every render)
    if (prevValueRef.current === numericValue) return;
    prevValueRef.current = numericValue;

    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }

    const DURATION = 700;
    const FRAMES = 28;
    const stepMs = DURATION / FRAMES;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / FRAMES;
      // ease-out quart: feels like the number is settling in
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(eased * numericValue));
      if (frame >= FRAMES) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [numericValue, reducedMotion]);

  // Animated milestone bar fill
  const barProgress = useSharedValue(reducedMotion ? Math.min(100, progressPercent) : 0);

  useEffect(() => {
    const target = Math.min(100, progressPercent);
    if (reducedMotion) {
      barProgress.value = target;
      return;
    }
    barProgress.value = withTiming(target, {
      duration: 900,
      easing: Easing.out(Easing.poly(5)),
    });
  }, [progressPercent, reducedMotion]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${barProgress.value}%`,
  }));

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(450).delay(80)}
      style={[styles.streakCard, { width: cardWidth }]}
    >
      <View style={styles.ringWrapper}>
        <View style={styles.ringGradient}>
          <LinearGradient
            colors={[...GRADIENTS.STREAK]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View style={styles.ringInner} />
        <View style={styles.ringContent}>
          <Text style={styles.streakValue}>{displayValue}</Text>
          <Text style={styles.streakLabel}>{label}</Text>
        </View>
      </View>
      {nextMilestone != null && (
        <View style={styles.milestoneRow}>
          <Text style={styles.milestoneLabel}>
            {t("nextMilestone")} {nextMilestone}
          </Text>
          <View style={styles.milestoneBarBg}>
            <Animated.View style={[styles.milestoneBarFill, animatedBarStyle]}>
              <LinearGradient
                colors={[...GRADIENTS.STREAK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      )}
    </Animated.View>
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
    fontWeight: "700",
    fontSize: 42,
    color: COLORS.WHITE,
  },
  streakLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
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
    fontWeight: "300",
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
    overflow: "hidden",
  },
});

export default StreakCard;
