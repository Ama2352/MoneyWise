import { useState, useCallback, useEffect } from 'react';
import { languageService } from '../services';
import { getTranslations } from '../locales';
import { getNestedValue } from '../utils';
import type { Language, TranslationKeys } from '../types';

export interface UseTranslationsReturn {
  language: Language;
  translations: TranslationKeys;
  t: (key: string, fallback?: string) => string;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isLoading: boolean;
}

/**
 * Hook for managing language state and translations
 * Handles language persistence, translation loading, and language switching
 */
export const useTranslations = (): UseTranslationsReturn => {
  const [language, setLanguageState] = useState<Language>(() =>
    languageService.getStoredLanguage()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Get current translations
  const translations = getTranslations(language);

  // Translation function
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const value = getNestedValue(translations, key);
      if (typeof value === 'string') {
        return value;
      }
      return fallback || key;
    },
    [translations]
  );

  // Set language with persistence
  const setLanguage = useCallback((newLanguage: Language) => {
    if (!languageService.isValidLanguage(newLanguage)) {
      console.warn(`Invalid language code: ${newLanguage}`);
      return;
    }

    setIsLoading(true);

    // Simulate async loading (for future API translations)
    setTimeout(() => {
      setLanguageState(newLanguage);
      languageService.saveLanguage(newLanguage);

      // Update document language attribute
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
    t,
    setLanguage,
    toggleLanguage,
    isLoading,
  };
};
