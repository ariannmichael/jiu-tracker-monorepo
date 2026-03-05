import React from "react";
import { Text, View, StyleSheet, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants";
import { useLanguage } from "@/contexts/LanguageContext";
import UploadImage from "@/components/UploadImage";

interface UpdateAvatarModalProps {
  visible: boolean;
  onClose: () => void;
  currentImageUri?: string;
  onUpload: (uri: string) => Promise<void>;
}

const UpdateAvatarModal: React.FC<UpdateAvatarModalProps> = ({
  visible,
  onClose,
  currentImageUri,
  onUpload,
}) => {
  const { t } = useLanguage();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.WHITE} />
          </Pressable>
          <Text style={styles.title}>{t("updateAvatar")}</Text>
          <UploadImage
            currentImageUri={currentImageUri}
            onUpload={async (uri) => {
              await onUpload(uri);
              onClose();
            }}
            size={120}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    backgroundColor: COLORS.CARD_ELEVATED,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  title: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 20,
    color: COLORS.WHITE,
    marginBottom: 16,
    paddingRight: 32,
  },
});

export default UpdateAvatarModal;
