/**
 * Date utility functions
 */

/**
 * Language-aware date formatting function
 */
export const formatDateForLanguage = (
  date: string | Date,
  language: 'en' | 'vi'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
