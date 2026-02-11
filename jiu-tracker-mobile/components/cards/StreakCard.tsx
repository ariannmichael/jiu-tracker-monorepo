import { COLORS, FONTS } from "@/constants";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = ((width * 1.2) - CARD_MARGIN) / 3; // 3 cards per row with margins

const StreakCard: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    return (
      <View style={[styles.streakCard, { width: (CARD_WIDTH * 2) + CARD_MARGIN }]}>
        <View style={styles.streakIconContainer}>
          <Text style={styles.streakIcon}>🔥</Text>
        </View>
        <Text style={styles.streakValue}>{value}</Text>
        <Text style={styles.streakLabel}>{label}</Text>
      </View>
    );
};

const styles = StyleSheet.create({
    streakCard: {
        backgroundColor: COLORS.GRAY_DARKER,
        padding: 12,
        marginRight: CARD_MARGIN,
        marginBottom: CARD_MARGIN,
        minHeight: 80,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.GRAY_LIGHT,
    },
    streakIconContainer: {
        marginBottom: 5,
    },
    streakIcon: {
        fontSize: 24,
    },
    streakValue: {
        fontFamily: FONTS.SUNFLOWER_BOLD,
        fontSize: 28,
        color: COLORS.WHITE,
    },
    streakLabel: {
        fontFamily: FONTS.SUNFLOWER_LIGHT,
        fontSize: 12,
        color: COLORS.WHITE,
    },
});

export default StreakCard;