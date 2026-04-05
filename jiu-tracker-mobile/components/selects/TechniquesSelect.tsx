import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { TechniqueListItem } from "@jiu-tracker/shared";
import { COLORS, FONTS } from "@/constants";
import { useLanguage } from "@/contexts/LanguageContext";

type TechniquesSelectProps = {
  options: TechniqueListItem[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  /** "submit" = blue chips (submit using), "tapped" = red chips (was tapped by) */
  chipVariant?: "default" | "submit" | "tapped";
};

export default function TechniquesSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select techniques",
  chipVariant = "default",
}: TechniquesSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { t, language } = useLanguage();

  const getDisplayName = (item: TechniqueListItem) =>
    language === "pt" && item.namePortuguese ? item.namePortuguese : item.name;

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.namePortuguese && item.namePortuguese.toLowerCase().includes(q))
    );
  }, [options, search]);

  const closePicker = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onSelectionChange(selected.filter((s) => s !== id));
    } else {
      onSelectionChange([...selected, id]);
    }
  };

  const selectedDisplayNames = useMemo(
    () =>
      selected
        .map((id) => {
          const opt = options.find((o) => o.id === id);
          return opt ? getDisplayName(opt) : undefined;
        })
        .filter(Boolean) as string[],
    [selected, options, language]
  );

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.box} onPress={() => setOpen(true)}>
        <View style={styles.boxInner}>
          {selectedDisplayNames.length > 0 ? (
            <View style={styles.chips}>
              {selectedDisplayNames.map((name) => (
                <View
                  key={name}
                  style={[
                    styles.chip,
                    chipVariant === "submit" && styles.chipSubmit,
                    chipVariant === "tapped" && styles.chipTapped,
                  ]}
                >
                  <Text style={styles.chipText} numberOfLines={1}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={closePicker} accessibilityRole="button" />
          <View style={styles.modalPanel}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {placeholder}
              </Text>
              <TouchableOpacity
                onPress={closePicker}
                style={styles.modalCloseHit}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel={t("cancel")}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder={t("searchTechniques")}
              placeholderTextColor={COLORS.GRAY_TEXT}
              value={search}
              onChangeText={setSearch}
            />
            <ScrollView
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {filteredOptions?.length === 0 ? (
                <Text style={styles.emptyText}>{t("noTechniquesFound")}</Text>
              ) : (
                filteredOptions?.map((opt) => {
                  const isSelected = selected.includes(opt.id);
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.option, isSelected && styles.optionSelected]}
                      onPress={() => toggle(opt.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionText}>{getDisplayName(opt)}</Text>
                      {isSelected && <Text style={styles.check}>✓</Text>}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  boxInner: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.GRAY_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: "100%",
  },
  chipSubmit: {
    backgroundColor: "rgba(59, 130, 246, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  chipTapped: {
    backgroundColor: "rgba(239, 68, 68, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  chipText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 13,
    color: COLORS.WHITE,
  },
  placeholder: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
  },
  chevron: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 12,
    color: COLORS.WHITE,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalPanel: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "75%",
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 12,
  },
  modalTitle: {
    flex: 1,
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
    fontSize: 17,
    color: COLORS.WHITE,
  },
  modalCloseHit: {
    padding: 4,
  },
  modalClose: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: "700",
    fontSize: 20,
    color: COLORS.WHITE,
  },
  searchInput: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 16,
    color: COLORS.WHITE,
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  list: {
    flexGrow: 0,
    maxHeight: 320,
    paddingHorizontal: 10,
    paddingBottom: 14,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  optionSelected: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  optionText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 15,
    color: COLORS.WHITE,
    flex: 1,
  },
  check: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.WHITE,
    marginLeft: 8,
  },
  emptyText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    padding: 16,
    textAlign: "center",
  },
});
