import React, { useState } from "react";
import { Text, View, StyleSheet, Image, Pressable, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import UploadImage from "@/components/UploadImage";

const HEADER_HEIGHT = 96;

const HeaderComponent: React.FC = () => {
  const { userData, updateAvatar } = useUser();
  const { logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const handleUpdateAvatar = () => {
    setDropdownVisible(false);
    setAvatarModalVisible(true);
  };

  const handleUpdateUser = () => {
    setDropdownVisible(false);
    setUserModalVisible(true);
  };

  const handleLogout = () => {
    setDropdownVisible(false);
    logout();
  };

  return (
    <View style={styles.profileHeader}>
      <Pressable
        style={styles.profilePicture}
        onPress={() => setDropdownVisible(true)}
      >
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
      </Pressable>
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{userData.name.toUpperCase()}</Text>
        <View style={styles.profileBadges}>
          {Array.from({ length: userData.badges }, (_, index) => (
            <View key={index} style={styles.badge} />
          ))}
        </View>
        <Text style={styles.trainingTime}>Training Time: {userData.trainingTime}</Text>
      </View>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.dropdownMenu}>
                <Pressable style={styles.dropdownItem} onPress={handleUpdateAvatar}>
                  <Ionicons name="person-circle-outline" size={22} color={COLORS.WHITE} />
                  <Text style={styles.dropdownItemText}>Update Avatar</Text>
                </Pressable>
                <Pressable style={styles.dropdownItem} onPress={handleUpdateUser}>
                  <Ionicons name="settings-outline" size={22} color={COLORS.WHITE} />
                  <Text style={styles.dropdownItemText}>Update User</Text>
                </Pressable>
                <Pressable style={styles.dropdownItem} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={22} color={COLORS.WHITE} />
                  <Text style={styles.dropdownItemText}>Logout</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={avatarModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalCloseButton} onPress={() => setAvatarModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.WHITE} />
            </Pressable>
            <Text style={styles.modalTitle}>Update Avatar</Text>
            <UploadImage
              currentImageUri={userData.profileImageUri}
              onUpload={async (uri) => {
                await updateAvatar(uri);
                setAvatarModalVisible(false);
              }}
              size={120}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={userModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalCloseButton} onPress={() => setUserModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.WHITE} />
            </Pressable>
            <Text style={styles.modalTitle}>Update User</Text>
            <Text style={styles.modalPlaceholder}>User details update coming soon.</Text>
          </View>
        </View>
      </Modal>
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
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: HEADER_HEIGHT,
    paddingLeft: 24,
    alignItems: "flex-start",
  },
  dropdownMenu: {
    backgroundColor: COLORS.CARD_ELEVATED,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    minWidth: 200,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownItemText: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 15,
    color: COLORS.WHITE,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.CARD_ELEVATED,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    width: "100%",
    maxWidth: 400,
    padding: 24,
  },
  modalCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  modalTitle: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 20,
    color: COLORS.WHITE,
    marginBottom: 16,
    paddingRight: 32,
  },
  modalPlaceholder: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
  },
});

export default HeaderComponent;

