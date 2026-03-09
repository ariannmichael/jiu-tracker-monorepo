import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, RADIUS } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKeys } from "@/i18n";
import TechniquesService from "@/services/techniques.service";
import TechniqueCard from "@/components/cards/TechniqueCard";
import TechniqueDetailModal from "@/components/modals/TechniqueDetailModal";
import { Technique, Category } from "@jiu-tracker/shared";

const CATEGORY_FILTERS: { value: Category | "all"; labelKey: TranslationKeys }[] = [
  { value: "all", labelKey: "all" },
  { value: Category.Submission, labelKey: "submission" },
  { value: Category.Guard, labelKey: "guard" },
  { value: Category.Pass, labelKey: "pass" },
  { value: Category.Sweep, labelKey: "sweep" },
  { value: Category.Takedown, labelKey: "takedown" },
  { value: Category.Defend, labelKey: "defend" },
  { value: Category.SubmissionEscape, labelKey: "escape" },
];

export default function TechniquesScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { t, language } = useLanguage();

  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTechniques = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const data = await TechniquesService.getAllTechniques(token);
      setTechniques(data.techniques ?? []);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [token]);

  useEffect(() => {
    setLoading(true);
    fetchTechniques().finally(() => setLoading(false));
  }, [fetchTechniques]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTechniques();
    setRefreshing(false);
  }, [fetchTechniques]);

  const filtered = useMemo(() => {
    let result = techniques;
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.name_portuguese.toLowerCase().includes(q)
      );
    }
    return result;
  }, [techniques, activeCategory, search]);

  const openDetail = (technique: Technique) => {
    setSelectedTechnique(technique);
    setModalVisible(true);
  };

  const renderItem = ({ item, index }: { item: Technique; index: number }) => (
    <View style={index % 2 === 0 ? styles.cardLeft : styles.cardRight}>
      <TechniqueCard
        name={item.name}
        namePortuguese={item.name_portuguese}
        category={item.category}
        difficulty={item.difficulty}
        onPress={() => openDetail(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>{t("techniques")}</Text>
        <Text style={styles.count}>
          {filtered.length} {filtered.length !== 1 ? t("techniquesPlural") : t("technique")}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color={COLORS.GRAY_TEXT}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t("searchTechniques")}
          placeholderTextColor={COLORS.GRAY_TEXT}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={COLORS.GRAY_TEXT} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={CATEGORY_FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.value)}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersRow}
        extraData={language}
        renderItem={({ item: filter }) => {
          const isActive = activeCategory === filter.value;
          return (
            <Pressable
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveCategory(filter.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {t(filter.labelKey)}
              </Text>
            </Pressable>
          );
        }}
      />

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.ACCENT_PURPLE} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchTechniques}>
            <Text style={styles.retryText}>{t("retry")}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          extraData={language}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.ACCENT_PURPLE}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.GRAY_TEXT} />
              <Text style={styles.emptyText}>{t("noTechniquesFound")}</Text>
              <Text style={styles.emptySubtext}>
                {search.trim()
                  ? t("tryDifferentSearch")
                  : t("techniquesAppearHere")}
              </Text>
            </View>
          }
        />
      )}

      <TechniqueDetailModal
        visible={modalVisible}
        technique={selectedTechnique}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 24,
    color: COLORS.WHITE,
  },
  count: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.CARD,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginHorizontal: 24,
    marginTop: 8,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 15,
    color: COLORS.WHITE,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  filtersRow: {
    flexGrow: 0,
    marginTop: 12,
    marginBottom: 4,
    minHeight: 40,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.ROUND,
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  filterChipActive: {
    backgroundColor: COLORS.BUTTON,
    borderColor: COLORS.BUTTON,
  },
  filterChipText: {
    fontFamily: FONTS.SUNFLOWER_MEDIUM,
    fontSize: 13,
    color: COLORS.GRAY_TEXT,
  },
  filterChipTextActive: {
    color: COLORS.WHITE,
  },
  gridContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  cardLeft: {
    flex: 1,
    marginRight: 6,
  },
  cardRight: {
    flex: 1,
    marginLeft: 6,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.ACCENT_ORANGE,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.BUTTON,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: RADIUS.MD,
  },
  retryText: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 14,
    color: COLORS.WHITE,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: FONTS.SUNFLOWER_BOLD,
    fontSize: 18,
    color: COLORS.WHITE,
  },
  emptySubtext: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    textAlign: "center",
  },
});
