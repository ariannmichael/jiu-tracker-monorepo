import { Text, View, TouchableOpacity, StyleSheet, TextInput, Platform } from "react-native";
import { useFonts } from "expo-font";
import { ZenDots_400Regular } from "@expo-google-fonts/zen-dots";
import { Sunflower_300Light, Sunflower_500Medium, Sunflower_700Bold } from "@expo-google-fonts/sunflower";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { COLORS } from "@/constants";


export default function StartScreen() {
  const { login: authLogin } = useAuth();
  const [fontsLoaded] = useFonts({
    ZenDots_400Regular,
    Sunflower_300Light,
    Sunflower_500Medium,
    Sunflower_700Bold,
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    if (!(email.length && password.length)) {
      setLogin(true);
      return;
    }

    setIsSubmitting(true);
    setLoginError("");
    try {
      await authLogin(email, password);
    } catch (error) {
      setLoginError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = () => {
    if (!(email.length && password.length && confirmPassword.length)) {
      setSignup(true);
      return;
    }

    router.replace({
      pathname: '/(signup)/signup',
      params: { name, email, password },
    });
  };


  const handleBack = () => {
    if (login || signup) {
      setLogin(false);
      setSignup(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        {(login || signup) && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        {/* Title */}
        <Text style={styles.title}>Jiu Tracker</Text>


        {(login || signup) &&
          <View style={styles.inputContainer}>
            {!login && (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor={COLORS.GRAY_TEXT}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.inputLine} />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.GRAY_TEXT}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.GRAY_TEXT}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            {!login &&
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.GRAY_TEXT}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.inputLine} />
              </View>
            }
          </View>
        }

        {/* Error message */}
        {loginError ? (
          <Text style={styles.errorText}>{loginError}</Text>
        ) : null}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {!signup &&
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? 'LOGGING IN...' : 'LOGIN'}</Text>
            </TouchableOpacity>
          }

          {!login &&
            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          }
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>402 Software</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'ZenDots_400Regular',
    fontSize: 36,
    color: COLORS.WHITE,
    marginBottom: 60,
    letterSpacing: 2,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.BUTTON,
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginBottom: 20,
    width: 255,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signupButton: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    width: 255,
  },
  buttonText: {
    fontFamily: 'Sunflower_300Light',
    fontSize: 32,
    color: COLORS.WHITE,
    textAlign: 'center',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  footerText: {
    fontFamily: 'ZenDots_400Regular',
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 40,
  },
  inputWrapper: {
    marginBottom: 30,
  },
  input: {
    fontSize: 16,
    color: COLORS.WHITE,
    paddingVertical: 15,
    paddingHorizontal: 0,
    fontFamily: 'Sunflower_300Light',
  },
  inputLine: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginTop: 5,
  },
  backArrow: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: 'Sunflower_500Medium',
  },
  backButton: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: 50,
  },
  errorText: {
    fontFamily: 'Sunflower_300Light',
    fontSize: 14,
    color: COLORS.ACCENT_PINK,
    textAlign: 'center',
    marginBottom: 20,
  },
});
