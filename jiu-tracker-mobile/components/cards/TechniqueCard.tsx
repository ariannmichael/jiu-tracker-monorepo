import React from "react";
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "@/constants";
import { Category, Difficulty } from "@jiu-tracker/shared";
import type { TranslationKeys } from "@/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

const CARD_GAP = 12;
const PADDING_H = 24;

interface TechniqueCardProps {
  name: string;
  namePortuguese?: string;
  category: Category;
  difficulty: Difficulty;
  onPress: () => void;
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; labelKey: TranslationKeys; icon: IconName; gradient: readonly [string, string] }
> = {
  [Category.Submission]: {
    label: "Submission",
    labelKey: "submission",
    icon: "arm-flex",
    gradient: [COLORS.ACCENT_PINK, COLORS.ACCENT_PURPLE],
  },
  [Category.Sweep]: {
    label: "Sweep",
    labelKey: "sweep",
    icon: "rotate-3d-variant",
    gradient: [COLORS.ACCENT_BLUE, COLORS.ACCENT_TEAL],
  },
  [Category.Pass]: {
    label: "Pass",
    labelKey: "pass",
    icon: "arrow-right-bold-circle",
    gradient: [COLORS.ACCENT_TEAL, COLORS.ACCENT_GREEN],
  },
  [Category.Guard]: {
    label: "Guard",
    labelKey: "guard",
    icon: "shield-half-full",
    gradient: [COLORS.ACCENT_PURPLE, COLORS.ACCENT_BLUE],
  },
  [Category.Takedown]: {
    label: "Takedown",
    labelKey: "takedown",
    icon: "arrow-down-bold-circle",
    gradient: [COLORS.ACCENT_ORANGE, COLORS.ACCENT_YELLOW],
  },
  [Category.Defend]: {
    label: "Defend",
    labelKey: "defend",
    icon: "shield-check",
    gradient: [COLORS.ACCENT_GREEN, COLORS.ACCENT_TEAL],
  },
  [Category.SubmissionEscape]: {
    label: "Escape",
    labelKey: "escape",
    icon: "exit-run",
    gradient: [COLORS.ACCENT_YELLOW, COLORS.ACCENT_ORANGE],
  },
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; labelKey: TranslationKeys; color: string }> = {
  [Difficulty.Beginner]: { label: "Beginner", labelKey: "beginner", color: COLORS.ACCENT_GREEN },
  [Difficulty.Intermediate]: { label: "Intermediate", labelKey: "intermediate", color: COLORS.ACCENT_ORANGE },
  [Difficulty.Advanced]: { label: "Advanced", labelKey: "advanced", color: COLORS.ACCENT_PINK },
};

const TechniqueCard: React.FC<TechniqueCardProps> = ({
  name,
  namePortuguese,
  category,
  difficulty,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const { t, language } = useLanguage();
  const displayName = language === "pt" && namePortuguese ? namePortuguese : name;
  const cardWidth = (width - PADDING_H * 2 - CARD_GAP) / 2;
  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG[Category.Submission];
  const diffConfig = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG[Difficulty.Beginner];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={config.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.imageGradient}
        >
          <MaterialCommunityIcons
            name={config.icon}
            size={36}
            color="rgba(255,255,255,0.9)"
          />
        </LinearGradient>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {displayName}
        </Text>

        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: `${config.gradient[0]}22` }]}>
            <Text style={[styles.badgeText, { color: config.gradient[0] }]}>
              {t(config.labelKey)}
            </Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: `${diffConfig.color}22` }]}>
            <View style={[styles.diffDot, { backgroundColor: diffConfig.color }]} />
            <Text style={[styles.badgeText, { color: diffConfig.color }]}>
              {t(diffConfig.labelKey)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
    marginBottom: CARD_GAP,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  imageContainer: {
    width: "100%",
    height: 100,
  },
  imageGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: 12,
    gap: 10,
  },
  name: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.WHITE,
    lineHeight: 20,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.SM,
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.SM,
    gap: 4,
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});

export { CATEGORY_CONFIG, DIFFICULTY_CONFIG };
export default TechniqueCard;
