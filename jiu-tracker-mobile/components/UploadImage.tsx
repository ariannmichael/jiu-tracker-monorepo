import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { createLogger, serializeError } from "@/services/logger";

const uploadImageLogger = createLogger("upload-image");

export interface UploadImageProps {
  /** Current image URI to display (e.g. existing avatar). */
  currentImageUri?: string | null;
  /** Called when the user taps "Upload image" with the current preview URI. */
  onUpload?: (uri: string) => void | Promise<void>;
  /** Size of the circular preview (default 120). */
  size?: number;
  /** Whether to allow taking a photo with the camera (default true). */
  allowCamera?: boolean;
}

export default function UploadImage({
  currentImageUri,
  onUpload,
  size = 120,
  allowCamera = true,
}: UploadImageProps) {
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useLanguage();

  const displayUri = selectedUri ?? currentImageUri ?? null;

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      uploadImageLogger.warn("Media library permission denied");
      Alert.alert(
        t("permissionRequired"),
        t("permissionPhotoAccess")
      );
      return false;
    }
    return true;
  };

  const pickFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedUri(result.assets[0].uri);
      }
    } catch (err) {
      uploadImageLogger.error(
        { err: serializeError(err) },
        "Image picker failed",
      );
      Alert.alert(t("error"), t("couldNotOpenImageLibrary"));
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      pickFromLibrary();
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      uploadImageLogger.warn("Camera permission denied");
      Alert.alert(
        t("permissionRequired"),
        t("cameraAccessNeeded")
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedUri(result.assets[0].uri);
      }
    } catch (err) {
      uploadImageLogger.error(
        { err: serializeError(err) },
        "Camera capture failed",
      );
      Alert.alert(t("error"), t("couldNotOpenCamera"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!displayUri || !onUpload) return;
    setIsUploading(true);
    try {
      await onUpload(displayUri);
      uploadImageLogger.info("Image upload completed");
    } catch (err) {
      uploadImageLogger.error(
        { err: serializeError(err) },
        "Image upload failed",
      );
      Alert.alert(t("uploadFailed"), (err as Error)?.message ?? t("couldNotUploadImage"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.previewWrap, { width: size + 16, height: size + 16 }]}>
        {isLoading ? (
          <View style={[styles.preview, styles.previewCircle, { width: size, height: size }]}>
            <ActivityIndicator size="large" color={COLORS.WHITE} />
          </View>
        ) : (
          <View style={[styles.preview, styles.previewCircle, { width: size, height: size }]}>
            {displayUri ? (
              <Image source={{ uri: displayUri }} style={[styles.previewImage, { width: size, height: size }]} />
            ) : (
              <Ionicons name="person-circle-outline" size={size * 0.6} color={COLORS.GRAY_TEXT} />
            )}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.button}
          onPress={pickFromLibrary}
          disabled={isLoading}
        >
          <Ionicons name="images-outline" size={20} color={COLORS.WHITE} />
          <Text style={styles.buttonText}>{t("choosePhoto")}</Text>
        </Pressable>
        {allowCamera && Platform.OS !== "web" && (
          <Pressable
            style={styles.button}
            onPress={takePhoto}
            disabled={isLoading}
          >
            <Ionicons name="camera-outline" size={20} color={COLORS.WHITE} />
            <Text style={styles.buttonText}>{t("takePhoto")}</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, styles.uploadButton]}
          onPress={handleUpload}
          disabled={!displayUri || isUploading || isLoading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <Ionicons name="cloud-upload-outline" size={20} color={COLORS.WHITE} />
          )}
          <Text style={styles.buttonText}>
            {isUploading ? t("uploading") : t("uploadImage")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  previewWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  preview: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  previewCircle: {
    borderRadius: 9999,
    overflow: "hidden",
  },
  previewImage: {
    borderRadius: 9999,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.BUTTON,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.WHITE,
  },
  uploadButton: {
    backgroundColor: COLORS.ACCENT_TEAL,
  },
});
