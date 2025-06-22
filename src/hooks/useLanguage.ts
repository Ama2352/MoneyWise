import { useState, useCallback, useEffect } from 'react';
import { languageService } from '../services';
import { getTranslations } from '../locales';
import type { Language, TranslationKeys } from '../types';

export interface UseTranslationsReturn {
  language: Language;
  translations: TranslationKeys;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isLoading: boolean;
}

/**
 * Hook for managing language state and translations
 * Provides direct access to nested translation objects with IntelliSense support
 */
export const useTranslations = (): UseTranslationsReturn => {
  const [language, setLanguageState] = useState<Language>(() =>
    languageService.getStoredLanguage()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Get current translations as typed nested object
  const translations = getTranslations(language);

  // Set language with persistence
  const setLanguage = useCallback((newLanguage: Language) => {
    if (!languageService.isValidLanguage(newLanguage)) {
      console.warn(`Invalid language code: ${newLanguage}`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setLanguageState(newLanguage);
      languageService.saveLanguage(newLanguage);
      document.documentElement.lang = newLanguage;
      setIsLoading(false);
    }, 100);
  }, []);

  // Toggle between available languages
  const toggleLanguage = useCallback(() => {
    const oppositeLanguage = languageService.getOppositeLanguage(language);
    setLanguage(oppositeLanguage);
  }, [language, setLanguage]);

  // Set initial document language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    translations,
    setLanguage,
    toggleLanguage,
    isLoading,
  };
};
