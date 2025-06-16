import { languageService } from '../services';
import type { TranslationKeys } from '../types';

/**
 * Translation utilities for formatting and interpolation
 */

/**
 * Format translation text with parameters
 * Example: formatTranslation("Hello {name}!", { name: "John" }) => "Hello John!"
 */
export const formatTranslation = (
  text: string,
  params?: Record<string, string | number>
): string => {
  return languageService.formatText(text, params);
};

/**
 * Gets a nested value from an object using dot notation
 * @param obj - The object to search
 * @param path - The dot-notation path (e.g., 'validation.emailRequired')
 * @returns The value at the path, or undefined if not found
 */
export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Get nested translation value safely
 * Example: getNestedTranslation(translations, "auth.login") => "Login"
 */
export const getNestedTranslation = (
  translations: TranslationKeys,
  path: string
): string => {
  const keys = path.split('.');
  let value: any = translations;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return the path if translation not found
    }
  }

  return typeof value === 'string' ? value : path;
};

/**
 * Create a translation function with interpolation support
 * Example: const t = createTranslationFunction(translations);
 *          t("auth.loginSuccess", { name: "John" }) => "Welcome back, John!"
 */
export const createTranslationFunction = (translations: TranslationKeys) => {
  return (path: string, params?: Record<string, string | number>): string => {
    const text = getNestedTranslation(translations, path);
    return formatTranslation(text, params);
  };
};

/**
 * Pluralization helper (simple implementation)
 * Example: pluralize(5, "item", "items") => "items"
 */
export const pluralize = (
  count: number,
  singular: string,
  plural: string
): string => {
  return count === 1 ? singular : plural;
};

/**
 * Date formatting helper that respects locale
 */
export const formatDateForLocale = (
  date: string | Date,
  language: 'en' | 'vi',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
};

/**
 * Currency formatting helper that respects locale
 */
export const formatCurrencyForLocale = (
  amount: number,
  language: 'en' | 'vi',
  currency: string = 'USD'
): string => {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
