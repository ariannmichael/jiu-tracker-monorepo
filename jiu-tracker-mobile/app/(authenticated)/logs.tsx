import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { TechniqueListItem } from "@jiu-tracker/shared";
import { COLORS, FONTS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import TechniquesService from "@/services/techniques.service";
import TechniquesSelect from "@/components/selects/TechniquesSelect";
import TrainingService from "@/services/training.service";
import { CreateTrainingRequest } from "@jiu-tracker/shared";

export default function LogsScreen() {
  const insets = useSafeAreaInsets();
  const { user, token } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [classTime, setClassTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [rollingOpenMat, setRollingOpenMat] = useState(false);
  const [notes, setNotes] = useState("");

  const [techniques, setTechniques] = useState<TechniqueListItem[]>([]);
  const [submitUsingOptions, setSubmitUsingOptions] = useState<TechniqueListItem[]>([]);
  const [submittedByOptions, setSubmittedByOptions] = useState<TechniqueListItem[]>([]);

  useEffect(() => {
    TechniquesService.getTechniquesList(token).then((response) => {
      setTechniques(response.techniques);
    });
  }, [token]);

  const handleAddLog = () => {
    setShowAddModal(true);
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setClassTime(selectedDate);
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTimeForInput = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    const data: CreateTrainingRequest = {
      user_id: user?.id ?? '',
      date: date.toISOString(),
      is_open_mat: rollingOpenMat,
      submit_using_options_ids: submitUsingOptions.map((option) => option.id),
      submitted_by_options_ids: submittedByOptions.map((option) => option.id),
      duration: classTime ? classTime.getHours() * 60 + classTime.getMinutes() : 0,
      notes: notes,
    };

    console.log(data); 
    TrainingService.createTraining(data, token ?? '').then((response) => {
      console.log(response);
    }).catch((error) => {
      console.error(error);
    });
  };

  const renderAddLogModal = () => (
    <Modal
      visible={showAddModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAddModal(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>NEW LOG</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DATE</Text>
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
                    fontFamily: FONTS.SUNFLOWER_LIGHT,
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
                  onChange={handleDateChange}
                  themeVariant="dark"
                  accentColor={COLORS.WHITE}
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
                    onChange={handleDateChange}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DURATION</Text>
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
                    fontFamily: FONTS.SUNFLOWER_LIGHT,
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
                  onChange={handleTimeChange}
                  themeVariant="dark"
                  accentColor={COLORS.WHITE}
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
                    {classTime ? formatTime(classTime) : "Select time"}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={classTime ?? new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>OPEN MAT</Text>
            <View style={styles.boxSelectRow}>
              <TouchableOpacity
                style={[styles.boxSelectOption, rollingOpenMat && styles.boxSelectOptionSelected]}
                onPress={() => setRollingOpenMat(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.boxSelectOptionText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxSelectOption, !rollingOpenMat && styles.boxSelectOptionSelected]}
                onPress={() => setRollingOpenMat(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.boxSelectOptionText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>SUBMIT USING</Text>
            <TechniquesSelect
              options={techniques}
              selected={submitUsingOptions.map((option) => option.id)}
              onSelectionChange={(selected) => setSubmitUsingOptions(selected.map((id) => techniques.find((t) => t.id === id)!))}
              placeholder="Select techniques"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>WAS SUBMITTED BY</Text>
            <TechniquesSelect
              options={techniques}
              selected={submittedByOptions.map((option) => option.id)}
              onSelectionChange={(selected) => setSubmittedByOptions(selected.map((id) => techniques.find((t) => t.id === id)!))}
              placeholder="Select techniques"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NOTES</Text>
            <TextInput
              style={styles.fieldInput}
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={COLORS.GRAY_TEXT}
              placeholder="Enter your notes here"
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Training Logs</Text>
          <Text style={styles.subtitle}>Your training sessions will appear here</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddLog}>
          <Text style={styles.addButtonText}>+ ADD LOG</Text>
        </TouchableOpacity>
      </ScrollView>
      {renderAddLogModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center"
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 24,
    color: COLORS.WHITE,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
  },
  addButton: {
    backgroundColor: COLORS.BUTTON,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 45,
    borderRadius: 8,
    width: '100%',
  },
  addButtonText: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.GRAY_DARKER,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '100%',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 20,
    color: COLORS.WHITE,
  },
  modalTitle: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 28,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 13,
    color: COLORS.WHITE,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 16,
    color: COLORS.WHITE,
  },
  datePickerContainer: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  dateText: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 16,
    color: COLORS.WHITE,
  },
  boxSelectRow: {
    flexDirection: "row",
    gap: 12,
  },
  boxSelectOption: {
    flex: 1,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  boxSelectOptionSelected: {
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderColor: COLORS.WHITE,
  },
  boxSelectOptionText: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 16,
    color: COLORS.WHITE,
  },
  submitButton: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 16,
    color: COLORS.WHITE,
    letterSpacing: 2,
  },
});

