import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONTS, RADIUS } from "@/constants";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LogCardTechnique {
  id: string;
  name: string;
  namePortuguese?: string;
}

export interface LogCardProps {
  date: string; // ISO date string or YYYY/MM/DD
  durationMinutes: number;
  submitted: LogCardTechnique[];
  tapped: LogCardTechnique[];
  onPress?: () => void;
}

function groupByDisplayName(
  items: LogCardTechnique[],
  isPt: boolean,
): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const display = isPt && item.namePortuguese ? item.namePortuguese : item.name;
    map.set(display, (map.get(display) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${day}`;
  } catch {
    return isoDate;
  }
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  if (h > 0) {
    const m = minutes % 60;
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }
  return `${minutes}m`;
}

const LogCard: React.FC<LogCardProps> = ({
  date,
  durationMinutes,
  submitted,
  tapped,
  onPress,
}) => {
  const { t, language } = useLanguage();
  const isPt = language === "pt";
  const submittedGrouped = groupByDisplayName(submitted, isPt);
  const tappedGrouped = groupByDisplayName(tapped, isPt);
  const totalOutcomes = submitted.length + tapped.length;
  const submissionRate =
    totalOutcomes > 0 ? Math.round((submitted.length / totalOutcomes) * 100) : 0;
  const mostEfficient =
    submittedGrouped.length > 0
      ? submittedGrouped.reduce((a, b) => (a.count >= b.count ? a : b)).name
      : null;
  const riskArea =
    tappedGrouped.length > 0
      ? `${tappedGrouped.reduce((a, b) => (a.count >= b.count ? a : b)).name} ${t("defense")}`
      : null;

  const cardContent = (
    <>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(date)}</Text>
        <View style={styles.totalTimeBlock}>
          <Text style={styles.totalTimeValue}>{formatDuration(durationMinutes)}</Text>
          <Text style={styles.totalTimeLabel}>{t("totalTime")}</Text>
        </View>
      </View>

      <View style={styles.techniquesRow}>
        <View style={styles.techniquesColumn}>
          <Text style={styles.columnTitle}>{t("submitted")}</Text>
          <View style={styles.tagsRow}>
            {submittedGrouped.length === 0 ? (
              <Text style={styles.emptyTag}>—</Text>
            ) : (
              submittedGrouped.map(({ name, count }) => (
                <View key={name} style={styles.tagWithCount}>
                  <View style={[styles.tag, styles.tagSubmitted]}>
                    <Text style={styles.tagText}>{name}</Text>
                  </View>
                  <View style={styles.countCapsule}>
                    <Text style={styles.countText}>x{count}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
        <View style={styles.techniquesColumn}>
          <Text style={styles.columnTitle}>{t("tapped")}</Text>
          <View style={styles.tagsRow}>
            {tappedGrouped.length === 0 ? (
              <Text style={styles.emptyTag}>—</Text>
            ) : (
              tappedGrouped.map(({ name, count }) => (
                <View key={name} style={styles.tagWithCount}>
                  <View style={[styles.tag, styles.tagTapped]}>
                    <Text style={styles.tagText}>{name}</Text>
                  </View>
                  <View style={styles.countCapsule}>
                    <Text style={styles.countText}>x{count}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>{t("submissionRate")}</Text>
          <Text style={styles.metricValue}>{submissionRate}%</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>{t("mostEfficient")}</Text>
          <Text style={[styles.metricValue, styles.metricValueAccent]}>
            {mostEfficient ?? "—"}
          </Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>{t("riskArea")}</Text>
          <Text style={styles.metricValue}>{riskArea ?? "—"}</Text>
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        {cardContent}
      </TouchableOpacity>
    );
  }
  return <View style={styles.card}>{cardContent}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: RADIUS.LG,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  date: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
  },
  totalTimeBlock: {
    alignItems: "flex-end",
  },
  totalTimeValue: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 22,
    color: COLORS.WHITE,
  },
  totalTimeLabel: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 12,
    color: COLORS.GRAY_TEXT,
    marginTop: 2,
  },
  techniquesRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  techniquesColumn: {
    flex: 1,
  },
  columnTitle: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 14,
    color: COLORS.WHITE,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagWithCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.SM,
  },
  tagSubmitted: {
    backgroundColor: "rgba(59, 130, 246, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  tagTapped: {
    backgroundColor: "rgba(239, 68, 68, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  tagText: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 13,
    color: COLORS.WHITE,
  },
  countCapsule: {
    backgroundColor: COLORS.GRAY_MEDIUM,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.SM,
  },
  countText: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 12,
    color: COLORS.WHITE,
  },
  emptyTag: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  metricBlock: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 11,
    color: COLORS.GRAY_TEXT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 15,
    color: COLORS.WHITE,
    textAlign: "center",
  },
  metricValueAccent: {
    color: COLORS.ACCENT_BLUE,
  },
});

export default LogCard;
