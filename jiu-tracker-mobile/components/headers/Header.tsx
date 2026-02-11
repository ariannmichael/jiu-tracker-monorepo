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
    paddingHorizontal: 32,
    backgroundColor: COLORS.GRAY_DARK,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.GRAY_MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.GRAY_LIGHT,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },
  profileIconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_DARK,
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
    top: 8,
    left: 10,
    width: 50,
    height: 20,
    backgroundColor: "#FF0000",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  helmetVisor: {
    position: "absolute",
    top: 28,
    left: 15,
    width: 40,
    height: 8,
    backgroundColor: "#000000",
    borderRadius: 2,
  },
  collar: {
    position: "absolute",
    bottom: 10,
    left: 20,
    width: 30,
    height: 12,
    backgroundColor: "#FFD700",
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
    backgroundColor: "#0066FF",
    marginRight: 6,
  },
  trainingTime: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 13,
    color: COLORS.WHITE,
  },
});

export default HeaderComponent;

