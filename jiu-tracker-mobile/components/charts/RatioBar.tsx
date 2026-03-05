import { COLORS, FONTS } from "@/constants";
import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";

export interface RatioSegment {
  label: string;
  value: number;
  color: string;
}

interface RatioBarProps {
  segments: RatioSegment[];
  showPercentInBar?: boolean;
}

/** Horizontal bar showing proportional segments (e.g. Win/Loss, Gi/NoGi). */
const RatioBar: React.FC<RatioBarProps> = ({
  segments,
  showPercentInBar = false,
}) => {
  const { t } = useLanguage();
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const withPct =
    total > 0
      ? segments.map((s) => ({
          ...s,
          percentage: (s.value / total) * 100,
        }))
      : segments.map((s) => ({ ...s, percentage: 0 }));

  if (total === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.bar, styles.barEmpty]} />
        <Text style={styles.emptyLabel}>{t("noDataYet")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {withPct.map((seg, i) => (
          <View
            key={seg.label + i}
            style={[
              styles.segment,
              {
                flex: total > 0 ? seg.value : 1,
                backgroundColor: seg.color,
                borderTopLeftRadius: i === 0 ? 8 : 0,
                borderBottomLeftRadius: i === 0 ? 8 : 0,
                borderTopRightRadius: i === withPct.length - 1 ? 8 : 0,
                borderBottomRightRadius: i === withPct.length - 1 ? 8 : 0,
              },
            ]}
          >
            {showPercentInBar && seg.percentage >= 15 && (
              <Text style={styles.segmentLabel}>
                {seg.percentage.toFixed(0)}%
              </Text>
            )}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        {withPct.map((seg, i) => (
          <View key={seg.label + i} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: seg.color }]}
            />
            <Text style={styles.legendText}>
              {seg.percentage.toFixed(0)}% {seg.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  bar: {
    flexDirection: "row",
    height: 24,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  segment: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 4,
  },
  segmentLabel: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 12,
    color: COLORS.WHITE,
  },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 13,
    color: COLORS.GRAY_TEXT,
  },
  barEmpty: {
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  emptyLabel: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 13,
    color: COLORS.GRAY_TEXT,
  },
});

export default RatioBar;
