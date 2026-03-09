import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONTS,
  BELT_COLORS,
  BELT_RANKS,
  BELT_MAX_STRIPES,
} from "../../constants";
import type { BeltRank } from "../../constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  belt_color: BeltRank;
  belt_stripe: number;
}

interface UpdateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    username: string;
    email: string;
    password?: string;
    belt_color: string;
    belt_stripe: number;
  }) => Promise<void>;
  initialData: {
    name: string;
    username: string;
    email: string;
    belt_color: string;
    belt_stripe: number;
  };
}

const initialFormState: UserFormData = {
  name: "",
  username: "",
  email: "",
  password: "",
  belt_color: "Blue Belt",
  belt_stripe: 0,
};

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [form, setForm] = useState<UserFormData>(initialFormState);
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (visible) {
      setForm({
        name: initialData.name,
        username: initialData.username,
        email: initialData.email,
        password: "",
        belt_color: (initialData.belt_color as BeltRank) ?? "Blue Belt",
        belt_stripe: initialData.belt_stripe ?? 0,
      });
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    if (form.password && form.password.length < 6) {
      Alert.alert(t("validation"), t("passwordMinChars"));
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        ...(form.password ? { password: form.password } : {}),
        belt_color: form.belt_color,
        belt_stripe: form.belt_stripe,
      });
      onClose();
    } catch (err) {
      Alert.alert(t("updateFailed"), (err as Error)?.message ?? t("couldNotUpdateUser"));
    } finally {
      setSaving(false);
    }
  };

  const maxStripes = BELT_MAX_STRIPES[form.belt_color];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.WHITE} />
          </Pressable>
          <Text style={styles.title}>{t("updateUser")}</Text>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formScrollContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator
            nestedScrollEnabled
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t("name")}</Text>
              <TextInput
                style={styles.fieldInput}
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder={t("name")}
                placeholderTextColor={COLORS.GRAY_TEXT}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t("username")}</Text>
              <TextInput
                style={styles.fieldInput}
                value={form.username}
                onChangeText={(v) => setForm((f) => ({ ...f, username: v }))}
                placeholder={t("username")}
                placeholderTextColor={COLORS.GRAY_TEXT}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t("email")}</Text>
              <TextInput
                style={styles.fieldInput}
                value={form.email}
                onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder={t("email")}
                placeholderTextColor={COLORS.GRAY_TEXT}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t("newPasswordMin6")}</Text>
              <TextInput
                style={styles.fieldInput}
                value={form.password}
                onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
                placeholder={t("password")}
                placeholderTextColor={COLORS.GRAY_TEXT}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t("belt")}</Text>
              <View style={styles.beltRankRow}>
                {BELT_RANKS.map((rank) => (
                  <Pressable
                    key={rank}
                    style={[
                      styles.beltRankChip,
                      form.belt_color === rank && styles.beltRankChipActive,
                      { borderColor: BELT_COLORS[rank] },
                    ]}
                    onPress={() =>
                      setForm((f) => ({
                        ...f,
                        belt_color: rank,
                        belt_stripe: Math.min(f.belt_stripe, BELT_MAX_STRIPES[rank]),
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.beltRankChipText,
                        form.belt_color === rank && styles.beltRankChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {rank.replace(" Belt", "")}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t("stripesRange").replace("{max}", String(maxStripes))}</Text>
              <View style={styles.stripeDotsRow}>
                {Array.from({ length: maxStripes + 1 }, (_, i) => (
                  <Pressable
                    key={i}
                    style={[
                      styles.stripeDot,
                      form.belt_stripe >= i ? styles.stripeDotActive : styles.stripeDotInactive,
                    ]}
                    onPress={() => setForm((f) => ({ ...f, belt_stripe: i }))}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Pressable
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={COLORS.WHITE} />
              ) : (
                <Text style={styles.saveButtonText}>{t("save")}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 20,
    color: COLORS.WHITE,
    marginBottom: 16,
    paddingRight: 32,
  },
  formScroll: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 340,
  },
  formScrollContent: {
    paddingBottom: 8,
    flexGrow: 0,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 12,
    color: COLORS.GRAY_TEXT,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 16,
    color: COLORS.WHITE,
    backgroundColor: COLORS.GRAY_DARKER,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  beltRankRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  beltRankChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  beltRankChipActive: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  beltRankChipText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 12,
    color: COLORS.GRAY_TEXT,
  },
  beltRankChipTextActive: {
    color: COLORS.WHITE,
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
  },
  stripeDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stripeDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  stripeDotActive: {
    backgroundColor: COLORS.BUTTON,
    borderColor: COLORS.WHITE,
  },
  stripeDotInactive: {
    backgroundColor: "transparent",
    borderColor: COLORS.GRAY_LIGHT,
  },
  saveButton: {
    backgroundColor: COLORS.BUTTON,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.WHITE,
  },
});

export default UpdateUserModal;
