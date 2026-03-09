import { COLORS, FONTS } from "@/constants";
import { StyleSheet, Text, View } from "react-native";

export interface PieChartSegment {
  label: string;
  value: number;
  color: string;
}

const PieChart: React.FC<{ data: PieChartSegment[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const segments = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));

  if (segments.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {segments.map((seg, index) => (
          <View
            key={`${seg.label}-${index}`}
            style={[
              styles.segment,
              {
                flex: total > 0 ? seg.value : 1,
                backgroundColor: seg.color,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {segments.map((seg, index) => (
          <View key={`${seg.label}-${index}`} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>{seg.label}</Text>
            <Text style={styles.legendPct}>{seg.percentage.toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  bar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  segment: {
    minWidth: 2,
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 14,
    color: COLORS.WHITE,
    flex: 1,
  },
  legendPct: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.WHITE,
  },
});

export default PieChart;
