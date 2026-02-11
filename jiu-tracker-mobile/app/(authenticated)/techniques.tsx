import { COLORS, FONTS } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import TechniquesService from "@/services/techniques";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TechniquesScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  useEffect(() => {
    TechniquesService.getTechniquesList(token).then((response: any) => {
      console.log(response);
    });
  }, [token]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Techniques</Text>
          <Text style={styles.subtitle}>All techniques will appear here</Text>
        </View>
      </ScrollView>
    </View>
  )
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
});