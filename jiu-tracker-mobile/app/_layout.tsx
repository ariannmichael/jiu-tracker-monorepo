import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { UserContextProvider } from "../contexts/UserContext";
import { AnalyticsContextProvider } from "../contexts/AnalyticsContext";
import { Platform } from "react-native";

// Polyfill for browser object if needed
if (typeof global !== 'undefined' && typeof global.browser === 'undefined') {
  global.browser = Platform.OS === 'web' ? true : false;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserContextProvider>
        <AnalyticsContextProvider>
          <Stack
            screenOptions={{
              headerShown: false, // Hide header by default
            }}
          />
        </AnalyticsContextProvider>
      </UserContextProvider>
    </AuthProvider>
  );
}
