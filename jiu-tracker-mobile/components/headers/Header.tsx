import React, { useState, useMemo } from "react";
import { Text, View, StyleSheet, Image, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS, FONTS, BELT_COLORS } from "../../constants";
import type { BeltRank } from "../../constants";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/i18n";
import ProfileDropdownModal from "@/components/modals/ProfileDropdownModal";
import UpdateAvatarModal from "@/components/modals/UpdateAvatarModal";
import UpdateUserModal from "@/components/modals/UpdateUserModal";
import UpdateBeltModal from "@/components/modals/UpdateBeltModal";

const LANG_OPTIONS: { value: Language; flag: string; label: string }[] = [
  { value: "en", flag: "🇺🇸", label: "English" },
  { value: "pt", flag: "🇧🇷", label: "Português" },
];

const HeaderComponent: React.FC = () => {
  const { userData, updateAvatar, updateUserFull, updateBelt } = useUser();
  const { logout, user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [langDropdownVisible, setLangDropdownVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [beltModalVisible, setBeltModalVisible] = useState(false);

  const currentLang = LANG_OPTIONS.find((opt) => opt.value === language) ?? LANG_OPTIONS[0];

  const handleUpdateAvatar = () => {
    setDropdownVisible(false);
    setAvatarModalVisible(true);
  };

  const handleUpdateUser = () => {
    setDropdownVisible(false);
    setUserModalVisible(true);
  };

  const handleLogout = () => {
    setDropdownVisible(false);
    logout();
  };

  const handleViewSubscription = () => {
    setDropdownVisible(false);
    router.push("/(authenticated)/paywall");
  };

  const handleUpdateBelt = () => {
    setDropdownVisible(false);
    setBeltModalVisible(true);
  };

  const userModalInitialData = useMemo(
    () => ({
      name: userData.name,
      username: user?.username ?? "",
      email: user?.email ?? "",
      belt_color: userData.belt_color ?? "Blue Belt",
      belt_stripe: userData.belt_stripe ?? 0,
    }),
    [userData.name, userData.belt_color, userData.belt_stripe, user?.username, user?.email],
  );

  return (
    <View style={styles.profileHeader}>
      <Pressable
        style={styles.profilePicture}
        onPress={() => setDropdownVisible(true)}
      >
        {userData.profileImageUri ? (
          <Image source={{ uri: userData.profileImageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileIconContainer}>
            <View style={styles.pixelArtPlaceholder}>
              <View style={styles.helmetTop} />
              <View style={styles.helmetVisor} />
              <View style={styles.collar} />
            </View>
          </View>
        )}
      </Pressable>
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{userData.name.toUpperCase()}</Text>
        <View style={styles.beltStripWrap}>
          <View
            style={[
              styles.beltStrip,
              {
                backgroundColor:
                  BELT_COLORS[(userData.belt_color as BeltRank) ?? "Blue Belt"] ??
                  COLORS.GRAY_MEDIUM,
              },
            ]}
          >
            {userData.belt_stripe != null && userData.belt_stripe > 0 && (
              <View
                style={[
                  styles.beltStripesBackground,
                  (userData.belt_color as BeltRank) === "Black Belt"
                    ? { backgroundColor: "#B22222" }
                    : { backgroundColor: "#000000" },
                ]}
              >
                {Array.from({ length: userData.belt_stripe }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.beltStripe,
                      (userData.belt_color as BeltRank) === "White Belt"
                        ? { backgroundColor: COLORS.WHITE }
                        : { backgroundColor: "rgba(255,255,255, 1)" },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.langSwitcher}>
        <Pressable
          style={styles.langDropdownTrigger}
          onPress={() => setLangDropdownVisible(true)}
        >
          <Text style={styles.langFlag}>{currentLang.flag}</Text>
        </Pressable>
      </View>

      <Modal
        visible={langDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangDropdownVisible(false)}
      >
        <Pressable style={styles.langDropdownOverlay} onPress={() => setLangDropdownVisible(false)}>
          <Pressable onPress={() => {}} style={styles.langDropdownMenuWrap}>
            <View style={styles.langDropdownMenu}>
              {LANG_OPTIONS.map((opt, index) => (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.langDropdownItem,
                    language === opt.value && styles.langDropdownItemActive,
                    index === LANG_OPTIONS.length - 1 && styles.langDropdownItemLast,
                  ]}
                  onPress={() => {
                    setLanguage(opt.value);
                    setLangDropdownVisible(false);
                  }}
                >
                  <Text style={styles.langDropdownFlag}>{opt.flag}</Text>
                  <Text style={styles.langDropdownLabel}>{opt.label}</Text>
                  {language === opt.value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.BUTTON} />
                  )}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ProfileDropdownModal
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        onUpdateAvatar={handleUpdateAvatar}
        onUpdateUser={handleUpdateUser}
        onViewSubscription={handleViewSubscription}
        onUpdateBelt={handleUpdateBelt}
        onLogout={handleLogout}
      />

      <UpdateAvatarModal
        visible={avatarModalVisible}
        onClose={() => setAvatarModalVisible(false)}
        currentImageUri={userData.profileImageUri}
        onUpload={updateAvatar}
      />

      <UpdateUserModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        onSave={updateUserFull}
        initialData={userModalInitialData}
      />

      <UpdateBeltModal
        visible={beltModalVisible}
        onClose={() => setBeltModalVisible(false)}
        onSave={updateBelt}
        initialData={{
          belt_color: (userData.belt_color as BeltRank) ?? "Blue Belt",
          belt_stripe: userData.belt_stripe ?? 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: COLORS.CARD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  profilePicture: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.GRAY_MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
  },
  profileIconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  pixelArtPlaceholder: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  helmetTop: {
    position: "absolute",
    top: 6,
    left: 8,
    width: 40,
    height: 16,
    backgroundColor: COLORS.ACCENT_PINK,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  helmetVisor: {
    position: "absolute",
    top: 22,
    left: 12,
    width: 32,
    height: 6,
    backgroundColor: COLORS.GRAY_DARKER,
    borderRadius: 2,
  },
  collar: {
    position: "absolute",
    bottom: 8,
    left: 14,
    width: 24,
    height: 10,
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderRadius: 2,
  },
  profileInfo: {
    flex: 1,
    display: "flex",
  },
  userName: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  beltStripWrap: {
    marginBottom: 6,
  },
  beltStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 18,
    minWidth: 40,
    maxWidth: 80,
    borderRadius: 4,
    paddingHorizontal: 6,
    gap: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  beltStripesBackground: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 3,
  },
  beltStripe: {
    width: 4,
    height: 10,
    borderRadius: 1,
  },
  langSwitcher: {
    marginLeft: 8,
  },
  langDropdownTrigger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.GRAY_MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  langFlag: {
    fontSize: 18,
  },
  langDropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: 96,
    paddingRight: 24,
    paddingBottom: 24,
    alignItems: "flex-end",
  },
  langDropdownMenuWrap: {
    alignSelf: "flex-end",
  },
  langDropdownMenu: {
    backgroundColor: COLORS.CARD_ELEVATED,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    minWidth: 160,
    overflow: "hidden",
  },
  langDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  langDropdownItemActive: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  langDropdownItemLast: {
    borderBottomWidth: 0,
  },
  langDropdownFlag: {
    fontSize: 18,
  },
  langDropdownLabel: {
    flex: 1,
    fontFamily: FONTS.EXO2_BOLD,
    fontSize: 14,
    color: COLORS.WHITE,
  },
});

export default HeaderComponent;
