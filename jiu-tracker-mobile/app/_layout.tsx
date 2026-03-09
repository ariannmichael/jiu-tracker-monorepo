import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { UserContextProvider } from "../contexts/UserContext";
import { AnalyticsContextProvider } from "../contexts/AnalyticsContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Platform } from "react-native";
import { ZenDots_400Regular } from "@expo-google-fonts/zen-dots";

SplashScreen.preventAutoHideAsync();

// Polyfill for browser object if needed
if (typeof global !== 'undefined' && typeof global.browser === 'undefined') {
  global.browser = Platform.OS === 'web' ? true : false;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ZenDots_400Regular,
    Exo2: require("../assets/fonts/Exo2-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <AuthProvider>
        <UserContextProvider>
          <AnalyticsContextProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </AnalyticsContextProvider>
        </UserContextProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
