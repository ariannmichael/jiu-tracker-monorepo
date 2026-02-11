import { COLORS, FONTS } from "@/constants";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = ((width * 1.2) - CARD_MARGIN) / 3; // 3 cards per row with margins

interface StatCardProps {
    title: string;
    value: string;
    color?: string;
    isLarge?: boolean;
  }
  
const StatCard: React.FC<StatCardProps> = ({ title, value, color = COLORS.GRAY_DARKER, isLarge = false }) => {
    const cardStyle = isLarge ? (CARD_WIDTH * 2) + CARD_MARGIN : CARD_WIDTH;
    
    return (
      <View style={[styles.statCard, { width: cardStyle, backgroundColor: color }]}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
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
        backgroundColor: COLORS.GRAY_DARKER,
        padding: 12,
        marginRight: CARD_MARGIN,
        marginBottom: CARD_MARGIN,
        minHeight: 80,
        justifyContent: "space-between",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.GRAY_LIGHT,
      },
      statValue: {
        fontFamily: FONTS.SUNFLOWER_BOLD,
        fontSize: 32,
        color: COLORS.WHITE,
        marginBottom: 5,
      },
      statTitle: {
        fontFamily: FONTS.SUNFLOWER_BOLD,
        fontSize: 12,
        color: COLORS.WHITE,
        textTransform: "uppercase",
      }
});

export default StatCard;