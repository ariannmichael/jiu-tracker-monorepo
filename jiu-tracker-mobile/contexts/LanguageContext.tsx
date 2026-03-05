import React, { createContext, useContext, useState, useCallback } from "react";
import { Platform } from "react-native";
import { translations, type Language, type TranslationKeys } from "@/i18n";

const LANGUAGE_STORAGE_KEY = "app_language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function loadStoredLanguage(): Language {
  if (Platform.OS === "web") {
    try {
      return (localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language) ?? "en";
    } catch {
      return "en";
    }
  }
  return "en";
}

function persistLanguage(lang: Language) {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadStoredLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    persistLanguage(lang);
  }, []);

  const t = useCallback(
    (key: TranslationKeys): string => {
      return translations[language][key] ?? translations.en[key] ?? key;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
