import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
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
  const { t } = useLanguage();

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter((t) => t.name.toLowerCase().includes(q));
  }, [options, search]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onSelectionChange(selected.filter((s) => s !== id));
    } else {
      onSelectionChange([...selected, id]);
    }
  };

  const selectedNames = useMemo(
    () =>
      selected
        .map((id) => options.find((o) => o.id === id)?.name)
        .filter(Boolean) as string[],
    [selected, options]
  );

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.box}
        onPress={() => setOpen((o) => !o)}
      >
        <View style={styles.boxInner}>
          {selectedNames.length > 0 ? (
            <View style={styles.chips}>
              {selectedNames.map((name) => (
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
        <Text style={styles.chevron}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
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
                    <Text style={styles.optionText}>{opt.name}</Text>
                    {isSelected && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
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
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 13,
    color: COLORS.WHITE,
  },
  placeholder: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
  },
  chevron: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 12,
    color: COLORS.WHITE,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    maxHeight: 220,
    overflow: "hidden",
  },
  searchInput: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 16,
    color: COLORS.WHITE,
    backgroundColor: COLORS.GRAY_MEDIUM,
    borderRadius: 8,
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  list: {
    maxHeight: 180,
    paddingHorizontal: 10,
    paddingBottom: 10,
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
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 15,
    color: COLORS.WHITE,
    flex: 1,
  },
  check: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 14,
    color: COLORS.WHITE,
    marginLeft: 8,
  },
  emptyText: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    padding: 16,
    textAlign: "center",
  },
});
