// Export all translations
export { en } from './en';
export { vi } from './vi';

import { en } from './en';
import { vi } from './vi';
import type { Language, TranslationKeys } from '../types';

// Translation map
export const translations: Record<Language, TranslationKeys> = {
  en,
  vi,
};

// Get translation for specific language
export const getTranslations = (language: Language): TranslationKeys => {
  return translations[language] || translations.en;
};
