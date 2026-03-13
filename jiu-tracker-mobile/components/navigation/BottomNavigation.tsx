import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { COLORS, FONTS } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKeys } from "@/i18n";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  useReducedMotion,
} from "react-native-reanimated";

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

// ─── Per-tab item with icon scale micro-interaction ──────────────────────────

interface NavItemProps {
  item: NavItem;
  active: boolean;
  onPress: () => void;
}

const NavItemComponent: React.FC<NavItemProps> = ({ item, active, onPress }) => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const iconScale = useSharedValue(1);
  const prevActiveRef = useRef(active);

  useEffect(() => {
    const wasActive = prevActiveRef.current;
    prevActiveRef.current = active;

    if (active && !wasActive && !reducedMotion) {
      // Becoming active: quick scale up then settle
      iconScale.value = withSequence(
        withTiming(1.25, { duration: 120, easing: Easing.out(Easing.poly(4)) }),
        withTiming(1.0, { duration: 200, easing: Easing.out(Easing.poly(4)) }),
      );
    }
  }, [active, reducedMotion, iconScale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={t(item.labelKey)}
      accessibilityState={{ selected: active }}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={item.icon}
          size={22}
          color={active ? COLORS.WHITE : COLORS.GRAY_TEXT}
        />
      </Animated.View>
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
};

// ─── Main navigation bar with sliding indicator ───────────────────────────────

const INDICATOR_WIDTH = 74;
const INDICATOR_HEIGHT = 2;

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  const [activeRoute, setActiveRoute] = useState<string>("/(authenticated)/dashboard");

  useEffect(() => {
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      setActiveRoute(`/(authenticated)/${lastSegment}`);
    } else {
      setActiveRoute("/(authenticated)/dashboard");
    }
  }, [segments]);

  const isActive = (route: string) => {
    const routeName = route.split("/").pop() || "";
    const activeName = activeRoute.split("/").pop() || "";
    return routeName === activeName || activeRoute === route;
  };

  const activeIndex = navItems.findIndex((item) => isActive(item.route));
  const tabWidth = screenWidth / navItems.length;

  // Center the indicator under the active tab
  const indicatorX = useSharedValue(
    activeIndex * tabWidth + tabWidth / 2 - INDICATOR_WIDTH / 2
  );

  useEffect(() => {
    const targetX = activeIndex * tabWidth + tabWidth / 2 - INDICATOR_WIDTH / 2;
    if (reducedMotion) {
      indicatorX.value = targetX;
    } else {
      indicatorX.value = withTiming(targetX, {
        duration: 250,
        easing: Easing.out(Easing.poly(4)),
      });
    }
  }, [activeIndex, tabWidth, reducedMotion]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value - 3 }],
  }));

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    router.push(route as any);
  };

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
      {/* Sliding top-edge indicator */}
      <Animated.View style={[styles.indicator, indicatorStyle]} />

      {navItems.map((item) => {
        const active = isActive(item.route);
        return (
          <NavItemComponent
            key={item.name}
            item={item}
            active={active}
            onPress={() => handleNavigation(item.route)}
          />
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
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    backgroundColor: COLORS.BUTTON,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
  },
  navLabel: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: "300",
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavigation;
