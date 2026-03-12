import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { COLORS, FONTS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKeys } from "@/i18n";

interface NavItem {
  name: string;
  labelKey: TranslationKeys;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { name: "home", labelKey: "home", route: "/(authenticated)/dashboard", icon: "home" },
  { name: "logs", labelKey: "logs", route: "/(authenticated)/logs", icon: "book" },
  { name: "techniques", labelKey: "techniquesNav", route: "/(authenticated)/techniques", icon: "ear" },
];

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [activeRoute, setActiveRoute] = useState<string>("/(authenticated)/dashboard");

  useEffect(() => {
    // Update active route based on segments
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      const currentPath = `/(authenticated)/${lastSegment}`;
      setActiveRoute(currentPath);
    } else {
      setActiveRoute("/(authenticated)/dashboard");
    }
  }, [segments]);

  const isActive = (route: string) => {
    const routeName = route.split("/").pop() || "";
    const activeName = activeRoute.split("/").pop() || "";
    return routeName === activeName || activeRoute === route;
  };

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    router.push(route as any);
  };

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
      {navItems.map((item) => {
        const active = isActive(item.route);
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavigation(item.route)}
            accessibilityRole="tab"
            accessibilityLabel={t(item.labelKey)}
            accessibilityState={{ selected: active }}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={active ? COLORS.WHITE : COLORS.GRAY_TEXT}
            />
            <Text
              style={[
                styles.navLabel,
                { color: active ? COLORS.WHITE : COLORS.GRAY_TEXT_SECONDARY },
              ]}
            >
              {t(item.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.CARD,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
  },
  navLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavigation;

