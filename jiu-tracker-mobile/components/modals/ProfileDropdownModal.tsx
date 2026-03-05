import React from "react";
import { Text, View, StyleSheet, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants";
import { useLanguage } from "@/contexts/LanguageContext";

const HEADER_HEIGHT = 96;

interface ProfileDropdownModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdateAvatar: () => void;
  onUpdateUser: () => void;
  onUpdateBelt: () => void;
  onLogout: () => void;
}

const ProfileDropdownModal: React.FC<ProfileDropdownModalProps> = ({
  visible,
  onClose,
  onUpdateAvatar,
  onUpdateUser,
  onUpdateBelt,
  onLogout,
}) => {
  const { t } = useLanguage();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.menuWrap}>
          <View style={styles.menu}>
            <Pressable style={styles.item} onPress={onUpdateAvatar}>
              <Ionicons name="person-circle-outline" size={22} color={COLORS.WHITE} />
              <Text style={styles.itemText}>{t("updateAvatar")}</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={onUpdateUser}>
              <Ionicons name="settings-outline" size={22} color={COLORS.WHITE} />
              <Text style={styles.itemText}>{t("updateUser")}</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={onUpdateBelt}>
              <Ionicons name="ribbon-outline" size={22} color={COLORS.WHITE} />
              <Text style={styles.itemText}>{t("updateBelt")}</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.WHITE} />
              <Text style={styles.itemText}>{t("logout")}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: HEADER_HEIGHT,
    paddingLeft: 24,
    alignItems: "flex-start",
  },
  menuWrap: {
    alignSelf: "flex-start",
  },
  menu: {
    backgroundColor: COLORS.CARD_ELEVATED,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    minWidth: 200,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  itemText: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 15,
    color: COLORS.WHITE,
  },
});

export default ProfileDropdownModal;
