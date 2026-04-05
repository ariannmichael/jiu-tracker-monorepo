import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { TechniqueListItem } from "@jiu-tracker/shared";
import { COLORS, FONTS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import TechniquesService from "@/services/techniques.service";
import TrainingService from "@/services/training.service";
import AddLogModal from "@/components/modals/AddLogModal";
import { CreateTrainingRequest, Technique, TrainingSession } from "@jiu-tracker/shared";
import LogCard from "@/components/cards/LogCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { createLogger, serializeError } from "@/services/logger";
import type { UpdateTrainingRequest } from "@/services/training.service";

const logsLogger = createLogger("logs-screen");

/** Training session as returned by API with submit/tapped options */
type TrainingWithOptions = TrainingSession & {
  submit_using_options?: Technique[];
  tapped_by_options?: Technique[];
};

export default function LogsScreen() {
  const insets = useSafeAreaInsets();
  const { user, token } = useAuth();
  const { t, language } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState<TrainingWithOptions | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [classTime, setClassTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [rollingOpenMat, setRollingOpenMat] = useState(false);
  const [isGi, setIsGi] = useState(true);
  const [notes, setNotes] = useState("");

  const [techniques, setTechniques] = useState<TechniqueListItem[]>([]);
  const [submitUsingOptions, setSubmitUsingOptions] = useState<TechniqueListItem[]>([]);
  const [tappedByOptions, setTappedByOptions] = useState<TechniqueListItem[]>([]);

  const PAGE_SIZE = 10;
  const [trainings, setTrainings] = useState<TrainingWithOptions[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    TechniquesService.getTechniquesList(token).then((response) => {
      setTechniques(response.techniques);
    });
  }, [token]);

  const fetchTrainings = useCallback(
    (options?: { refresh?: boolean }) => {
      if (!token || !user?.id) return;
      const isRefresh = options?.refresh ?? false;
      const currentOffset = isRefresh ? 0 : offset;

      if (isRefresh) {
        setRefreshing(true);
      } else if (currentOffset === 0) {
        setLoadingLogs(true);
      } else {
        setLoadingMore(true);
      }

      TrainingService.getTrainings(token, PAGE_SIZE, currentOffset, user.id)
        .then(({ trainings: next, total }) => {
          setTotalLogs(total);
          if (isRefresh || currentOffset === 0) {
            setTrainings(next as unknown as TrainingWithOptions[]);
            setOffset(next.length);
          } else {
            setTrainings((prev) => [...prev, ...(next as unknown as TrainingWithOptions[])]);
            setOffset((o) => o + next.length);
          }
        })
        .catch(() => {
          if (isRefresh || currentOffset === 0) setTrainings([]);
        })
        .finally(() => {
          setLoadingLogs(false);
          setLoadingMore(false);
          setRefreshing(false);
        });
    },
    [token, user?.id],
  );

  const loadMore = useCallback(() => {
    if (loadingMore || loadingLogs || trainings.length >= totalLogs || !token || !user?.id) return;
    setLoadingMore(true);
    const nextOffset = offset;
    TrainingService.getTrainings(token, PAGE_SIZE, nextOffset, user.id)
      .then(({ trainings: next, total }) => {
        setTotalLogs(total);
        setTrainings((prev) => [...prev, ...(next as unknown as TrainingWithOptions[])]);
        setOffset(nextOffset + next.length);
      })
      .finally(() => setLoadingMore(false));
  }, [token, user?.id, offset, loadingMore, loadingLogs, trainings.length, totalLogs]);

  useEffect(() => {
    if (!token || !user?.id) return;
    setOffset(0);
    fetchTrainings({ refresh: true });
  }, [token, user?.id, fetchTrainings]);

  const handleAddLog = () => {
    setEditingTraining(null);
    setDate(new Date());
    setClassTime(null);
    setRollingOpenMat(false);
    setIsGi(true);
    setNotes("");
    setSubmitUsingOptions([]);
    setTappedByOptions([]);
    setShowAddModal(true);
  };

  const openEditModal = (t: TrainingWithOptions) => {
    setEditingTraining(t);
    setDate(new Date(t.date));
    const durationMinutes = t.duration ?? 0;
    const d = new Date();
    d.setHours(Math.floor(durationMinutes / 60), durationMinutes % 60, 0, 0);
    setClassTime(d);
    setRollingOpenMat(t.is_open_mat ?? t.rolling_open_mat ?? false);
    setIsGi(t.is_gi ?? true);
    setNotes(t.notes ?? "");
    setSubmitUsingOptions((t.submit_using_options ?? []) as TechniqueListItem[]);
    setTappedByOptions((t.tapped_by_options ?? []) as TechniqueListItem[]);
    setShowAddModal(true);
  };

  const closeLogModal = () => {
    setShowAddModal(false);
    setEditingTraining(null);
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

  const handleSubmit = () => {
    const durationMinutes = classTime ? classTime.getHours() * 60 + classTime.getMinutes() : 0;
    const submitIds = submitUsingOptions.map((option) => option.id);
    const tappedIds = tappedByOptions.map((option) => option.id);

    if (editingTraining) {
      const data: UpdateTrainingRequest = {
        date: date.toISOString(),
        is_open_mat: rollingOpenMat,
        is_gi: isGi,
        submit_using_options_ids: submitIds,
        tapped_by_options_ids: tappedIds,
        duration: durationMinutes,
        notes: notes,
      };
      TrainingService.updateTraining(editingTraining.id, data, token ?? "")
        .then(() => {
          closeLogModal();
          setSubmitUsingOptions([]);
          setTappedByOptions([]);
          setNotes("");
          setClassTime(null);
          fetchTrainings({ refresh: true });
        })
        .catch((error) => {
          logsLogger.error(
            { err: serializeError(error), trainingId: editingTraining.id },
            "Failed to update training log",
          );
          Alert.alert(t("couldNotUpdateLog"), error instanceof Error ? error.message : t("pleaseTryAgain"));
        });
    } else {
      const data: CreateTrainingRequest = {
        user_id: user?.id ?? '',
        date: date.toISOString(),
        is_open_mat: rollingOpenMat,
        is_gi: isGi,
        submit_using_options_ids: submitIds,
        tapped_by_options_ids: tappedIds,
        duration: durationMinutes,
        notes: notes,
      };
      TrainingService.createTraining(data, token ?? "")
        .then(() => {
          closeLogModal();
          setSubmitUsingOptions([]);
          setTappedByOptions([]);
          setNotes("");
          setClassTime(null);
          fetchTrainings({ refresh: true });
        })
        .catch((error) => {
          logsLogger.error(
            { err: serializeError(error), userId: user?.id },
            "Failed to create training log",
          );
          Alert.alert(t("couldNotSaveLog"), error instanceof Error ? error.message : t("pleaseTryAgain"));
        });
    }
  };

  const renderLogItem = useCallback(
    ({ item: training }: { item: TrainingWithOptions }) => (
      <LogCard
        date={training.date}
        durationMinutes={training.duration}
        submitted={(training.submit_using_options ?? []).map((tech: Technique) => ({
          id: tech.id,
          name: tech.name,
          namePortuguese: tech.namePortuguese,
        }))}
        tapped={(training.tapped_by_options ?? []).map((tech: Technique) => ({
          id: tech.id,
          name: tech.name,
          namePortuguese: tech.namePortuguese,
        }))}
        onPress={() => openEditModal(training)}
      />
    ),
    [language],
  );

  const listHeader = (
    <View style={[styles.scrollContent, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t("trainingLogs")}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddLog}>
          <Text style={styles.addButtonText}>{t("addLog")}</Text>
        </TouchableOpacity>
      </View>
      {loadingLogs ? (
        <Text style={styles.subtitle}>{t("loadingLogs")}</Text>
      ) : trainings.length === 0 && !loadingMore ? (
        <Text style={styles.subtitle}>{t("sessionsAppearHere")}</Text>
      ) : null}
    </View>
  );

  const listFooter =
    loadingMore ? (
      <View style={styles.footerLoader}>
        <Text style={styles.subtitle}>{t("loadingMore")}</Text>
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <FlatList
        data={trainings}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        extraData={language}
        onEndReached={() => {
          if (trainings.length < totalLogs && !loadingMore && !loadingLogs) loadMore();
        }}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchTrainings({ refresh: true })}
          />
        }
      />
      <AddLogModal
        visible={showAddModal}
        onClose={closeLogModal}
        editingTraining={editingTraining}
        date={date}
        setDate={setDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        classTime={classTime}
        setClassTime={setClassTime}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        rollingOpenMat={rollingOpenMat}
        setRollingOpenMat={setRollingOpenMat}
        isGi={isGi}
        setIsGi={setIsGi}
        notes={notes}
        setNotes={setNotes}
        techniques={techniques}
        submitUsingOptions={submitUsingOptions}
        setSubmitUsingOptions={setSubmitUsingOptions}
        tappedByOptions={tappedByOptions}
        setTappedByOptions={setTappedByOptions}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    paddingTop: 24
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 12,
  },
  logList: {
    marginBottom: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    paddingBottom: 100,
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 24,
    color: COLORS.WHITE,
  },
  subtitle: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: COLORS.BUTTON,
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addButtonText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
