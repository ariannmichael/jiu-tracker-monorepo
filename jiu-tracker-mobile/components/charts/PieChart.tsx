import { COLORS, FONTS } from "@/constants";
import { StyleSheet, Text, View } from "react-native";

interface PieChartSegment {
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

  return (
    <View style={styles.pieChartContainer}>
      <View style={styles.pieChartLabels}>
        <View style={styles.pieChartLabelColumn}>
          {segments.map((seg, index) => (
            <View key={seg.label + index} style={styles.pieChartLabelItem}>
              <View style={[styles.pieChartColorDot, { backgroundColor: seg.color }]} />
              <Text style={styles.pieChartLabelText} numberOfLines={1}>{seg.label}</Text>
              <Text style={styles.pieChartPercentage}>{seg.percentage.toFixed(1)}%</Text>
            </View>
          ))}
        </View>
        <View style={styles.pieChartCircle}>
          <View style={[styles.pieChartVisual, segments[0] && { backgroundColor: segments[0].color }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pieChartContainer: {
    alignItems: "center",
  },
  pieChartLabels: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  pieChartLabelColumn: {
    flex: 1,
  },
  pieChartLabelItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pieChartColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pieChartLabelText: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.WHITE,
    flex: 1,
  },
  pieChartPercentage: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 14,
    color: COLORS.WHITE,
  },
  pieChartCircle: {
    width: 80,
    height: 80,
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  pieChartVisual: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
});

export default PieChart;
