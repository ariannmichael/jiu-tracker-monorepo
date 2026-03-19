
import { Stack } from "expo-router";
import { StyleSheet, SafeAreaView } from "react-native";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import { COLORS } from "../../constants";
import HeaderComponent from "@/components/headers/Header";

export default function AuthenticatedLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: true, // We'll use custom header component instead
          header: () => <HeaderComponent />,
        }}
      />
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});
