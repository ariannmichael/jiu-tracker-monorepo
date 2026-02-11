import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import { COLORS } from "../../constants";
import HeaderComponent from "@/components/headers/Header";

export default function AuthenticatedLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: true, // We'll use custom header component instead
          header: () => <HeaderComponent />,
        }}
      />
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});
