import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  BeltRank,
  BELT_RANKS,
  BELT_RANK_VALUES,
  BELT_COLORS,
  BELT_MAX_STRIPES,
  COUNTRIES,
  MONTHS,
  MONTH_NAMES,
  DAYS,
  YEARS,
  FONTS,
  COLORS
} from '../../constants';
import SignupService from '@/services/signup.service';
import { createLogger, serializeError } from '@/services/logger';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const signupLogger = createLogger('signup-screen');

interface SignupData {
  country: string;
  rank: BeltRank;
  stripes: number;
  birthDate: { day: string; month: string; year: string };
  username: string;
}

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState<SignupData>({
    country: 'Brazil',
    rank: 'White Belt' as BeltRank,
    stripes: 0,
    birthDate: { day: '01', month: 'Jan', year: '2000' },
    username: ''
  });

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<'day' | 'month' | 'year'>('day');

  const { name, email, password } = useLocalSearchParams<{ name: string; email: string; password: string }>();
  const { login } = useAuth();
  const { t } = useLanguage();

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) return;
    try {
      await SignupService.signup({
        name: name ?? '',
        username: signupData.username,
        email,
        password,
        belt_color: signupData.rank,
        belt_stripe: signupData.stripes,
      });
      await login(email, password);
    } catch (error) {
      signupLogger.error(
        { err: serializeError(error) },
        'Failed to complete signup flow',
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackHome = () => {
    router.replace('/');
  }

  const updateSignupData = (field: keyof SignupData, value: any) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const updateBirthDate = (field: keyof SignupData['birthDate'], value: string) => {
    setSignupData(prev => ({
      ...prev,
      birthDate: { ...prev.birthDate, [field]: value }
    }));
  };

  const getBeltColor = (rank: BeltRank) => {
    return BELT_COLORS[rank];
  };

  const renderProgressDots = () => {
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index + 1 === currentStep ? styles.progressDotActive : styles.progressDotInactive
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t("whereWereYouBorn")}</Text>

      <TouchableOpacity
        style={styles.countrySelector}
        onPress={() => setShowCountryModal(true)}
      >
        <Text style={styles.countryText}>{signupData.country}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitButtonText}>{signupData.country.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );

  const changeBeltRank = (newRank: BeltRank) => {
    setSignupData(prev => ({ ...prev, rank: newRank, stripes: 0 }));
  };

  const maxStripes = BELT_MAX_STRIPES[signupData.rank];

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t("whatIsYourRank")}</Text>

      <View style={styles.beltContainer}>
        <View style={[styles.belt, { backgroundColor: getBeltColor(signupData.rank) }]}>
          {signupData.stripes > 0 && (
            <View
              style={[
                styles.stripesContainer,
                {
                  backgroundColor: signupData.rank === 'Black Belt' ? '#B22222' : '#000000',
                },
              ]}
            >
              {Array.from({ length: signupData.stripes }, (_, index) => (
                <View key={index} style={styles.stripe} />
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.rankControls}>
        <TouchableOpacity
          style={styles.rankButton}
          onPress={() => {
            const currentIndex = BELT_RANK_VALUES[signupData.rank];
            if (currentIndex > 1) {
              changeBeltRank(BELT_RANKS[currentIndex - 2]);
            }
          }}
        >
          <Text style={styles.rankButtonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.sliderContainer}>
          <View style={styles.slider}>
            <View style={[styles.sliderThumb, { left: (BELT_RANKS.indexOf(signupData.rank) / (BELT_RANKS.length - 1)) * 200 }]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.rankButton}
          onPress={() => {
            const currentIndex = BELT_RANKS.indexOf(signupData.rank);
            if (currentIndex < BELT_RANKS.length - 1) {
              changeBeltRank(BELT_RANKS[currentIndex + 1]);
            }
          }}
        >
          <Text style={styles.rankButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {maxStripes > 0 && (
        <View style={styles.stripeSelector}>
          <Text style={styles.stripeSelectorLabel}>{t("stripes")}</Text>
          <View style={styles.stripeDotsRow}>
            {Array.from({ length: maxStripes }, (_, index) => {
              const stripeNumber = index + 1;
              const isActive = signupData.stripes >= stripeNumber;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.stripeDot,
                    isActive ? styles.stripeDotActive : styles.stripeDotInactive,
                  ]}
                  onPress={() => {
                    const newStripes = signupData.stripes === stripeNumber ? stripeNumber - 1 : stripeNumber;
                    updateSignupData('stripes', newStripes);
                  }}
                />
              );
            })}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitButtonText}>
          {t("imA")} {signupData.rank.toUpperCase()}{signupData.stripes > 0 ? ` ${signupData.stripes} ${signupData.stripes > 1 ? t("stripesPlural") : t("stripe")}` : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t("whenWereYouBorn")}</Text>

      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => {
            setSelectedDateField('day');
            setShowDateModal(true);
          }}
        >
          <Text style={styles.dateText}>{signupData.birthDate.day}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => {
            setSelectedDateField('month');
            setShowDateModal(true);
          }}
        >
          <Text style={styles.dateText}>{signupData.birthDate.month}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => {
            setSelectedDateField('year');
            setShowDateModal(true);
          }}
        >
          <Text style={styles.dateText}>{signupData.birthDate.year}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitButtonText}>{t("im")} {new Date().getFullYear() - parseInt(signupData.birthDate.year)}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t("chooseUsername")}</Text>

      <View style={styles.usernameInputContainer}>
        <TextInput
          style={styles.usernameInput}
          value={signupData.username}
          onChangeText={(text) => updateSignupData('username', text)}
          placeholder={t("enterUsername")}
          placeholderTextColor={COLORS.GRAY_TEXT}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitButtonText}>{t("submit")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  const renderCountryModal = () => (
    <Modal
      visible={showCountryModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCountryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t("selectCountry")}</Text>
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  updateSignupData('country', item);
                  setShowCountryModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowCountryModal(false)}
          >
            <Text style={styles.modalCloseText}>{t("cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderDateModal = () => {
    const getDateData = (): string[] => {
      switch (selectedDateField) {
        case 'day': return DAYS;
        case 'month': return MONTH_NAMES;
        case 'year': return YEARS;
        default: return DAYS;
      }
    };

    return (
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("select")} {selectedDateField.charAt(0).toUpperCase() + selectedDateField.slice(1)}</Text>
            <FlatList
              data={getDateData()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    updateBirthDate(selectedDateField, item);
                    setShowDateModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDateModal(false)}
            >
              <Text style={styles.modalCloseText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {currentStep == 1 && (
          <View style={styles.backButtonHome}>
            <TouchableOpacity onPress={handleBackHome}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.title}>{t("appName")}</Text>
      </View>

      <View style={styles.navigationContainer}>
        {renderProgressDots()}
      </View>
      {currentStep > 1 && (
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      )}

      <View style={styles.contentContainer}>
        {renderCurrentStep()}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("footer")}</Text>
      </View>

      {renderCountryModal()}
      {renderDateModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },
  mainContent: {
    marginTop: 150,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 150,
  },
  title: {
    fontFamily: FONTS.ZEN_DOTS,
    fontSize: 36,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backArrow: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: COLORS.WHITE,
  },
  progressDotInactive: {
    backgroundColor: COLORS.GRAY_TEXT,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 24,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 40,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.GRAY_MEDIUM,
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '80%',
    marginBottom: 40,
  },
  countryText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 18,
    color: COLORS.WHITE,
  },
  dropdownArrow: {
    fontSize: 12,
    color: COLORS.WHITE,
  },
  submitButton: {
    backgroundColor: COLORS.BUTTON,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '80%',
    borderRadius: 8,
  },
  submitButtonText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
    letterSpacing: 1,
  },
  beltContainer: {
    marginBottom: 30,
  },
  belt: {
    width: 200,
    height: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  stripesContainer: {
    position: 'absolute',
    right: 10,
    top: 2,
    flexDirection: 'row',
    height: 16,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  stripe: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 1,
  },
  rankControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rankButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.BUTTON,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  rankButtonText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 20,
    color: COLORS.WHITE,
    borderRadius: 8,
  },
  sliderContainer: {
    marginHorizontal: 20,
  },
  slider: {
    width: 200,
    height: 4,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 2,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.BUTTON,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  stripeSelector: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stripeSelectorLabel: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    marginBottom: 10,
  },
  stripeDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stripeDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
  },
  stripeDotActive: {
    backgroundColor: COLORS.BUTTON,
    borderColor: COLORS.WHITE,
  },
  stripeDotInactive: {
    backgroundColor: 'transparent',
    borderColor: COLORS.GRAY_LIGHT,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_MEDIUM,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minWidth: 60,
  },
  dateText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.WHITE,
    marginRight: 5,
  },
  usernameText: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 32,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  footerText: {
    fontFamily: FONTS.ZEN_DOTS,
    fontSize: 14,
    color: COLORS.WHITE,
  },
  usernameInputContainer: {
    width: '80%',
    marginBottom: 40,
  },
  usernameInput: {
    fontFamily: FONTS.EXO2_BOLD,
    fontWeight: '700',
    fontSize: 32,
    color: COLORS.WHITE,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.WHITE,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.CARD,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalTitle: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 20,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  modalItemText: {
    fontFamily: FONTS.EXO2_LIGHT,
    fontWeight: '300',
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.BUTTON,
  },
  modalCloseText: {
    fontFamily: FONTS.EXO2_MEDIUM,
    fontWeight: '500',
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  backButtonHome: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: 50,
    paddingLeft: 32,
  },
});
