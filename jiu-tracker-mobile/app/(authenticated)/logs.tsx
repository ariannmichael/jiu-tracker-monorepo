import React, { useState } from "react";
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
import { COLORS, FONTS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LogsScreen() {
  const insets = useSafeAreaInsets();

  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState("");
  const [classTime, setClassTime] = useState("");
  const [rollingOpenMat, setRollingOpenMat] = useState("");
  const [positions, setPositions] = useState("");
  const [moves, setMoves] = useState("");

  const handleAddLog = () => {
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    // TODO: handle form submission
    setShowAddModal(false);
    setDate("");
    setClassTime("");
    setRollingOpenMat("");
    setPositions("");
    setMoves("");
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
          <Text style={styles.modalTitle}>NEW LOG</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DATE</Text>
            <TextInput
              style={styles.fieldInput}
              value={date}
              onChangeText={setDate}
              placeholderTextColor={COLORS.GRAY_TEXT}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CLASS TIME</Text>
            <TextInput
              style={styles.fieldInput}
              value={classTime}
              onChangeText={setClassTime}
              placeholderTextColor={COLORS.GRAY_TEXT}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ROLLING/OPEN MAT</Text>
            <TextInput
              style={styles.fieldInput}
              value={rollingOpenMat}
              onChangeText={setRollingOpenMat}
              placeholderTextColor={COLORS.GRAY_TEXT}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>POSITIONS</Text>
            <TextInput
              style={styles.fieldInput}
              value={positions}
              onChangeText={setPositions}
              placeholderTextColor={COLORS.GRAY_TEXT}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>MOVES</Text>
            <TextInput
              style={styles.fieldInput}
              value={moves}
              onChangeText={setMoves}
              placeholderTextColor={COLORS.GRAY_TEXT}
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
    maxHeight: '80%',
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

