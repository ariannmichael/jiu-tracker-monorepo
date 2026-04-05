import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { TechniqueListItem, Technique, TrainingSession } from "@jiu-tracker/shared";
import { COLORS, FONTS } from "@/constants";
import TechniquesSelect from "@/components/selects/TechniquesSelect";
import { useLanguage } from "@/contexts/LanguageContext";

type TrainingWithOptions = TrainingSession & {
  submit_using_options?: Technique[];
  tapped_by_options?: Technique[];
};

export type AddLogModalProps = {
  visible: boolean;
  onClose: () => void;
  editingTraining: TrainingWithOptions | null;
  date: Date;
  setDate: (d: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (v: boolean) => void;
  classTime: Date | null;
  setClassTime: (d: Date | null) => void;
  showTimePicker: boolean;
  setShowTimePicker: (v: boolean) => void;
  rollingOpenMat: boolean;
  setRollingOpenMat: (v: boolean) => void;
  isGi: boolean;
  setIsGi: (v: boolean) => void;
  notes: string;
  setNotes: (s: string) => void;
  techniques: TechniqueListItem[];
  submitUsingOptions: TechniqueListItem[];
  setSubmitUsingOptions: React.Dispatch<React.SetStateAction<TechniqueListItem[]>>;
  tappedByOptions: TechniqueListItem[];
  setTappedByOptions: React.Dispatch<React.SetStateAction<TechniqueListItem[]>>;
  onDateChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  onTimeChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  onSubmit: () => void;
};

export default function AddLogModal({
  visible,
  onClose,
  editingTraining,
  date,
  setDate,
  showDatePicker,
  setShowDatePicker,
  classTime,
  setClassTime,
  showTimePicker,
  setShowTimePicker,
  rollingOpenMat,
  setRollingOpenMat,
  isGi,
  setIsGi,
  notes,
  setNotes,
  techniques,
  submitUsingOptions,
  setSubmitUsingOptions,
  tappedByOptions,
  setTappedByOptions,
  onDateChange,
  onTimeChange,
  onSubmit,
}: AddLogModalProps) {
  const { t, language } = useLanguage();
  const { height: windowHeight } = useWindowDimensions();
  const scrollMaxHeight = windowHeight * 0.88;

  const dateLocale = language === "pt" ? "pt-BR" : "en-US";

  const formatDate = (d: Date) => {
    return d.toLocaleDateString(dateLocale, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString(dateLocale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: language !== "pt",
    });
  };

  const formatTimeForInput = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t("cancel")}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <ScrollView
            style={[styles.modalScroll, { maxHeight: scrollMaxHeight }]}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled
          >
          <Text style={styles.modalTitle}>{editingTraining ? t("editLog") : t("newLog")}</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("date")}</Text>
            {Platform.OS === "web" ? (
              <View style={styles.datePickerContainer}>
                <input
                  type="date"
                  value={date.toISOString().split("T")[0]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newDate = new Date(e.target.value + "T00:00:00");
                    if (!isNaN(newDate.getTime())) {
                      setDate(newDate);
                    }
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: FONTS.EXO2_LIGHT,
                    fontWeight: "300",
                    fontSize: 16,
                    color: COLORS.WHITE,
                    width: "100%",
                    colorScheme: "dark",
                  }}
                />
              </View>
            ) : Platform.OS === "ios" ? (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="compact"
                  onChange={onDateChange}
                  themeVariant="dark"
                  accentColor={COLORS.BUTTON}
                />
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.fieldInput}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("duration")}</Text>
            {Platform.OS === "web" ? (
              <View style={styles.datePickerContainer}>
                <input
                  type="time"
                  value={classTime ? formatTimeForInput(classTime) : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const [hours, minutes] = (e.target.value || "00:00").split(":").map(Number);
                    const d = new Date();
                    d.setHours(hours, minutes, 0, 0);
                    setClassTime(d);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: FONTS.EXO2_LIGHT,
                    fontWeight: "300",
                    fontSize: 16,
                    color: COLORS.WHITE,
                    width: "100%",
                    colorScheme: "dark",
                  }}
                />
              </View>
            ) : Platform.OS === "ios" ? (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={classTime ?? new Date()}
                  mode="time"
                  display="compact"
                  onChange={onTimeChange}
                  themeVariant="dark"
                  accentColor={COLORS.BUTTON}
                />
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.fieldInput}
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dateText, !classTime && { color: COLORS.GRAY_TEXT }]}>
                    {classTime ? formatTime(classTime) : t("selectTime")}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={classTime ?? new Date()}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("openMatLabel")}</Text>
            <View style={styles.boxSelectRow}>
              <TouchableOpacity
                style={[styles.boxSelectOption, rollingOpenMat && styles.boxSelectOptionSelected]}
                onPress={() => setRollingOpenMat(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.boxSelectOptionText}>{t("yes")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxSelectOption, !rollingOpenMat && styles.boxSelectOptionSelected]}
                onPress={() => setRollingOpenMat(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.boxSelectOptionText}>{t("no")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("giNogi")}</Text>
            <View style={styles.boxSelectRow}>
              <TouchableOpacity
                style={[styles.boxSelectOption, isGi && styles.boxSelectOptionSelected]}
                onPress={() => setIsGi(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.boxSelectOptionText}>{t("gi")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxSelectOption, !isGi && styles.boxSelectOptionSelected]}
                onPress={() => setIsGi(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.boxSelectOptionText}>{t("nogi")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("submitUsing")}</Text>
            <TechniquesSelect
              options={techniques}
              selected={submitUsingOptions.map((option) => option.id)}
              onSelectionChange={(selected) =>
                setSubmitUsingOptions(selected.map((id) => techniques.find((tech) => tech.id === id)!))
              }
              placeholder={t("selectTechniques")}
              chipVariant="submit"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("wasTappedBy")}</Text>
            <TechniquesSelect
              options={techniques}
              selected={tappedByOptions.map((option) => option.id)}
              onSelectionChange={(selected) =>
                setTappedByOptions(selected.map((id) => techniques.find((tech) => tech.id === id)!))
              }
              placeholder={t("selectTechniques")}
              chipVariant="tapped"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("notes")}</Text>
            <TextInput
              style={styles.fieldInput}
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={COLORS.GRAY_TEXT}
              placeholder={t("enterNotesHere")}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>{t("submit")}</Text>
          </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 480,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalScroll: {
    width: "100%",
  },
  modalScrollContent: {
    paddingBottom: 8,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
    fontSize: 20,
    color: COLORS.WHITE,
  },
  modalTitle: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
    fontSize: 28,
    color: COLORS.WHITE,
    textAlign: "center",
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
    fontSize: 13,
    color: COLORS.WHITE,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 16,
    color: COLORS.WHITE,
  },
  datePickerContainer: {
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  dateText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 16,
    color: COLORS.WHITE,
  },
  boxSelectRow: {
    flexDirection: "row",
    gap: 12,
  },
  boxSelectOption: {
    flex: 1,
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  boxSelectOptionSelected: {
    backgroundColor: COLORS.BUTTON,
    borderColor: COLORS.BUTTON,
  },
  boxSelectOptionText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 16,
    color: COLORS.WHITE,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: COLORS.BUTTON,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.WHITE,
    letterSpacing: 2,
  },
});
