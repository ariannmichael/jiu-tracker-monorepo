import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "@/constants";
import { Technique, Category, Difficulty } from "@jiu-tracker/shared";
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG } from "../cards/TechniqueCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface TechniqueDetailModalProps {
  visible: boolean;
  technique: Technique | null;
  onClose: () => void;
}

const TechniqueDetailModal: React.FC<TechniqueDetailModalProps> = ({
  visible,
  technique,
  onClose,
}) => {
  const { t, language } = useLanguage();

  if (!technique) return null;

  const isPt = language === "pt";
  const namePt =
    (technique as { namePortuguese?: string }).namePortuguese ??
    (technique as { name_portuguese?: string }).name_portuguese ??
    "";
  const nameEn = technique.name ?? "";
  const descPt =
    (technique as { descriptionPortuguese?: string }).descriptionPortuguese ??
    (technique as { description_portuguese?: string }).description_portuguese ??
    "";
  const descEn = technique.description ?? "";

  const primaryName = isPt ? (namePt || nameEn) : (nameEn || namePt);
  const secondaryName = isPt ? nameEn : namePt;
  const description = isPt ? (descPt || descEn) : (descEn || descPt);

  const catConfig =
    CATEGORY_CONFIG[technique.category] ?? CATEGORY_CONFIG[Category.Submission];
  const diffConfig =
    DIFFICULTY_CONFIG[technique.difficulty] ?? DIFFICULTY_CONFIG[Difficulty.Beginner];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={catConfig.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <MaterialCommunityIcons
                name={catConfig.icon}
                size={56}
                color="rgba(255,255,255,0.9)"
              />
            </LinearGradient>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("cancel")}
            >
              <Ionicons name="close" size={22} color={COLORS.WHITE} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{primaryName}</Text>

            {secondaryName ? (
              <Text style={styles.secondaryName}>
                {secondaryName}
              </Text>
            ) : null}

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.metaBadge,
                  { backgroundColor: `${catConfig.gradient[0]}22` },
                ]}
              >
                <MaterialCommunityIcons
                  name={catConfig.icon}
                  size={14}
                  color={catConfig.gradient[0]}
                />
                <Text style={[styles.metaBadgeText, { color: catConfig.gradient[0] }]}>
                  {t(catConfig.labelKey)}
                </Text>
              </View>
              <View
                style={[
                  styles.metaBadge,
                  { backgroundColor: `${diffConfig.color}22` },
                ]}
              >
                <View
                  style={[styles.diffDot, { backgroundColor: diffConfig.color }]}
                />
                <Text style={[styles.metaBadgeText, { color: diffConfig.color }]}>
                  {t(diffConfig.labelKey)}
                </Text>
              </View>
            </View>

            {description ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t("description")}</Text>
                <Text style={styles.sectionBody}>{description}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: COLORS.CARD_ELEVATED,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.BORDER,
    maxHeight: "85%",
    overflow: "hidden",
  },
  heroContainer: {
    position: "relative",
  },
  hero: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flexGrow: 0,
    flexShrink: 1,
  },
  bodyContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 22,
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  secondaryName: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 15,
    color: COLORS.GRAY_TEXT,
    marginBottom: 16,
    fontStyle: "italic",
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.MD,
  },
  metaBadgeText: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  diffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 12,
    color: COLORS.GRAY_TEXT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionBody: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 15,
    color: COLORS.WHITE,
    lineHeight: 24,
  },
});

export default TechniqueDetailModal;
