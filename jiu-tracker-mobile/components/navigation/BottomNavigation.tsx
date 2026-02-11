import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { COLORS, FONTS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NavItem {
  name: string;
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { name: "home", label: "Home", route: "/(authenticated)/dashboard", icon: "home" },
  { name: "logs", label: "Logs", route: "/(authenticated)/logs", icon: "book" },
  { name: "competitions", label: "Competitions", route: "/(authenticated)/competitions", icon: "trophy" },
];

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
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
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={active ? COLORS.WHITE : COLORS.GRAY_TEXT}
            />
            <Text
              style={[
                styles.navLabel,
                { color: active ? COLORS.WHITE : COLORS.GRAY_TEXT },
              ]}
            >
              {item.label}
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
    backgroundColor: COLORS.GRAY_DARK,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
  },
  navLabel: {
    fontFamily: FONTS.SUNFLOWER_LIGHT,
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavigation;

