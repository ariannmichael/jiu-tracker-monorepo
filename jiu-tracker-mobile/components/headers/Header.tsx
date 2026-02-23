import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { COLORS, FONTS } from "../../constants";
import { useUser } from "@/contexts/UserContext";

const HeaderComponent: React.FC = () => {
  const { userData } = useUser();

  return (
    <View style={styles.profileHeader}>
      <View style={styles.profilePicture}>
        {userData.profileImageUri ? (
          <Image source={{ uri: userData.profileImageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileIconContainer}>
            {/* Pixel art style placeholder - can be replaced with actual image */}
            <View style={styles.pixelArtPlaceholder}>
              <View style={styles.helmetTop} />
              <View style={styles.helmetVisor} />
              <View style={styles.collar} />
            </View>
          </View>
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{userData.name.toUpperCase()}</Text>
        <View style={styles.profileBadges}>
          {Array.from({ length: userData.badges }, (_, index) => (
            <View key={index} style={styles.badge} />
          ))}
        </View>
        <Text style={styles.trainingTime}>Training Time: {userData.trainingTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: COLORS.CARD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  profilePicture: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.GRAY_MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
  },
  profileIconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  pixelArtPlaceholder: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  helmetTop: {
    position: "absolute",
    top: 6,
    left: 8,
    width: 40,
    height: 16,
    backgroundColor: COLORS.ACCENT_PINK,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  helmetVisor: {
    position: "absolute",
    top: 22,
    left: 12,
    width: 32,
    height: 6,
    backgroundColor: COLORS.GRAY_DARKER,
    borderRadius: 2,
  },
  collar: {
    position: "absolute",
    bottom: 8,
    left: 14,
    width: 24,
    height: 10,
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderRadius: 2,
  },
  profileInfo: {
    flex: 1,
    display: "flex",
  },
  userName: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  profileBadges: {
    flexDirection: "row",
    marginBottom: 6,
  },
  badge: {
    width: 14,
    height: 14,
    backgroundColor: COLORS.ACCENT_BLUE,
    marginRight: 6,
    borderRadius: 4,
  },
  trainingTime: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 13,
    color: COLORS.GRAY_TEXT,
  },
});

export default HeaderComponent;

