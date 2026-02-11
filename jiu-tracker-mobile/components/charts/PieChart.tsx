import { COLORS, FONTS } from "@/constants";
import { StyleSheet, Text, View } from "react-native";

const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    const segments = data.map((item) => {
      const percentage = (item.value / total) * 100;
      return { ...item, percentage };
    });
  
    // Create a simple visual pie chart using overlapping circles
    const goldSegment = segments.find(s => s.label === 'Gold');
    const silverSegment = segments.find(s => s.label === 'Silver');
    const bronzeSegment = segments.find(s => s.label === 'Bronze');
    const noneSegment = segments.find(s => s.label === 'None');
  
    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChartLabels}>
          <View style={styles.pieChartLabelColumn}>
            <View style={styles.pieChartLabelItem}>
              <View style={[styles.pieChartColorDot, { backgroundColor: '#FFD700' }]} />
              <Text style={styles.pieChartLabelText}>Gold</Text>
              <Text style={styles.pieChartPercentage}>{goldSegment?.percentage.toFixed(1) || '0'}%</Text>
            </View>
            <View style={styles.pieChartLabelItem}>
              <View style={[styles.pieChartColorDot, { backgroundColor: '#C0C0C0' }]} />
              <Text style={styles.pieChartLabelText}>Silver</Text>
              <Text style={styles.pieChartPercentage}>{silverSegment?.percentage.toFixed(1) || '0'}%</Text>
            </View>
          </View>
          
          <View style={styles.pieChartCircle}>
            {/* Circular pie chart using layered approach */}
            <View style={styles.pieChartVisual}>
              {/* Base circle - None (gray, largest segment ~41%) */}
              <View style={[styles.pieBaseCircle, { backgroundColor: noneSegment?.color || COLORS.GRAY_MEDIUM }]} />
              {/* Overlay circles for other segments */}
              <View style={[styles.pieOverlayCircle, styles.pieOverlay1, { backgroundColor: silverSegment?.color || '#C0C0C0' }]} />
              <View style={[styles.pieOverlayCircle, styles.pieOverlay2, { backgroundColor: bronzeSegment?.color || '#CD7F32' }]} />
              <View style={[styles.pieOverlayCircle, styles.pieOverlay3, { backgroundColor: goldSegment?.color || '#FFD700' }]} />
            </View>
          </View>
          
          <View style={styles.pieChartLabelColumn}>
            <View style={styles.pieChartLabelItem}>
              <View style={[styles.pieChartColorDot, { backgroundColor: COLORS.GRAY_MEDIUM }]} />
              <Text style={styles.pieChartLabelText}>None</Text>
              <Text style={styles.pieChartPercentage}>{noneSegment?.percentage.toFixed(1) || '0'}%</Text>
            </View>
            <View style={styles.pieChartLabelItem}>
              <View style={[styles.pieChartColorDot, { backgroundColor: '#CD7F32' }]} />
              <Text style={styles.pieChartLabelText}>Bronze</Text>
              <Text style={styles.pieChartPercentage}>{bronzeSegment?.percentage.toFixed(1) || '0'}%</Text>
            </View>
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
        alignItems: "center",
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
        width: 120,
        height: 120,
        marginHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    pieChartVisual: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: "relative",
        overflow: "hidden",
    },
    pieBaseCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: "absolute",
    },
    pieOverlayCircle: {
        position: "absolute",
        borderRadius: 50,
    },
    pieOverlay1: {
        width: 70,
        height: 70,
        top: 15,
        left: 15,
        opacity: 0.8,
    },
    pieOverlay2: {
        width: 70,
        height: 70,
        top: 15,
        left: 15,
        opacity: 0.8,
    },
    pieOverlay3: {
        width: 70,
        height: 70,
        top: 15,
        left: 15,
        opacity: 0.8,
    },
});

export default PieChart;