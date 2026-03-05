import en from "./en";
import pt from "./pt";
import type { TranslationKeys } from "./en";

export type Language = "en" | "pt";

export type Translations = Record<TranslationKeys, string>;

export const translations: Record<Language, Translations> = { en, pt };

export type { TranslationKeys };
