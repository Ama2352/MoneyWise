import { STORAGE_KEYS, DEFAULT_LANGUAGE } from '../constants';
import type { Language } from '../types';

/**
 * Language Service - Business logic for language management
 * Handles language persistence, detection, and utilities
 */
export const languageService = {
  /**
   * Get saved language from localStorage or detect from browser
   */
  getStoredLanguage: (): Language => {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    if (stored && (stored === 'en' || stored === 'vi')) {
      return stored;
    }

    // Try to detect from browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('vi')) {
      return 'vi';
    }

    return DEFAULT_LANGUAGE;
  },

  /**
   * Save language to localStorage
   */
  saveLanguage: (language: Language): void => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  /**
   * Validate if language code is supported
   */
  isValidLanguage: (code: string): code is Language => {
    return code === 'en' || code === 'vi';
  },

  /**
   * Get opposite language (for quick toggle)
   */
  getOppositeLanguage: (currentLanguage: Language): Language => {
    return currentLanguage === 'en' ? 'vi' : 'en';
  },

  /**
   * Format text with interpolation
   * Example: formatText("Hello {name}", { name: "John" }) => "Hello John"
   */
  formatText: (
    text: string,
    params?: Record<string, string | number>
  ): string => {
    if (!params) return text;

    return Object.entries(params).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`{${key}}`, 'g'), String(value));
    }, text);
  },

  /**
   * Get language direction (for future RTL support)
   */
  getLanguageDirection: (_language: Language): 'ltr' | 'rtl' => {
    // Both Vietnamese and English are LTR
    // This method is ready for future RTL language support
    return 'ltr';
  },
};
