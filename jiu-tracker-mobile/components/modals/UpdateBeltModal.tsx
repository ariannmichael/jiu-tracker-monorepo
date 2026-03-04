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

interface BeltFormData {
  belt_color: BeltRank;
  belt_stripe: number;
}

interface UpdateBeltModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    belt_color: string;
    belt_stripe: number;
  }) => Promise<void>;
  initialData: {
    belt_color: string;
    belt_stripe: number;
  };
}

const initialFormState: BeltFormData = {
  belt_color: "Blue Belt",
  belt_stripe: 0,
};

const UpdateBeltModal: React.FC<UpdateBeltModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [form, setForm] = useState<BeltFormData>(initialFormState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm({
        belt_color: (initialData.belt_color as BeltRank) ?? "Blue Belt",
        belt_stripe: initialData.belt_stripe ?? 0,
      });
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        belt_color: form.belt_color,
        belt_stripe: form.belt_stripe,
      });
      onClose();
    } catch (err) {
      Alert.alert("Update failed", (err as Error)?.message ?? "Could not update user.");
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
          <Text style={styles.title}>Update Belt</Text>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formScrollContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator
            nestedScrollEnabled
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Belt</Text>
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
              <Text style={styles.fieldLabel}>Stripes (0–{maxStripes})</Text>
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
                <Text style={styles.saveButtonText}>Save</Text>
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
    fontFamily: FONTS.SUNFLOWER_BOLD,
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
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 12,
    color: COLORS.GRAY_TEXT,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
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
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 12,
    color: COLORS.GRAY_TEXT,
  },
  beltRankChipTextActive: {
    color: COLORS.WHITE,
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
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
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 16,
    color: COLORS.WHITE,
  },
});

export default UpdateBeltModal;
