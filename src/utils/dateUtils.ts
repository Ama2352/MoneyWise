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

/**
 * Convert date string from backend (YYYY-MM-DD) to locale-specific input format
 */
export const formatDateForInput = (
  dateString: string,
  language: 'en' | 'vi'
): string => {
  if (!dateString) return '';

  try {
    // Backend returns format: "2025-07-07" or "2025-07-07 15:16:42"
    const datePart = dateString.split(' ')[0]; // Extract date part
    const [year, month, day] = datePart.split('-');

    if (language === 'vi') {
      // Vietnamese format: DD/MM/YYYY
      return `${day}/${month}/${year}`;
    } else {
      // English format: MM/DD/YYYY
      return `${month}/${day}/${year}`;
    }
  } catch (error) {
    console.error('Error formatting date for input:', dateString, error);
    return dateString;
  }
};

/**
 * Convert date string from backend (YYYY-MM-DD) to locale-specific display format
 */
export const formatDateForDisplay = (
  dateString: string,
  language: 'en' | 'vi'
): string => {
  if (!dateString) return '';

  try {
    // Backend returns format: "2025-07-07" or "2025-07-07 15:16:42"
    const datePart = dateString.split(' ')[0]; // Extract date part
    const [year, month, day] = datePart.split('-');

    if (language === 'vi') {
      // Vietnamese format: DD/MM/YYYY
      return `${day}/${month}/${year}`;
    } else {
      // English format: MM/DD/YYYY
      return `${month}/${day}/${year}`;
    }
  } catch (error) {
    console.error('Error formatting date for display:', dateString, error);
    return dateString;
  }
};

/**
 * Convert locale-specific date input to ISO format (YYYY-MM-DD) for backend
 */
export const parseInputDateToISO = (
  dateInput: string,
  language?: 'en' | 'vi'
): string => {
  if (!dateInput) return '';

  try {
    // If it's already in ISO format (from date input), return as is
    if (dateInput.includes('-') && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateInput;
    }

    let day: string, month: string, year: string;

    if (dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (language === 'vi') {
        // Vietnamese format: DD/MM/YYYY
        [day, month, year] = parts;
      } else {
        // English format: MM/DD/YYYY
        [month, day, year] = parts;
      }
    } else if (dateInput.includes('-')) {
      // Already in ISO format
      return dateInput.split(' ')[0]; // Remove time part if present
    } else {
      return dateInput;
    }

    // Ensure 2-digit formatting
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');

    return `${year}-${formattedMonth}-${formattedDay}`;
  } catch (error) {
    console.error('Error parsing input date:', dateInput, error);
    return dateInput;
  }
};

/**
 * Get date input placeholder based on language
 */
export const getDateInputPlaceholder = (language: 'en' | 'vi'): string => {
  return language === 'vi' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
};

/**
 * Convert date from one language format to another
 * This is useful when switching languages and need to reformat existing dates
 */
export const convertDateBetweenLanguages = (
  dateString: string,
  fromLanguage: 'en' | 'vi',
  toLanguage: 'en' | 'vi'
): string => {
  if (!dateString || fromLanguage === toLanguage) return dateString;

  try {
    // First parse to ISO format using original language
    const isoDate = parseInputDateToISO(dateString, fromLanguage);

    // Then format for target language
    if (isoDate && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return formatDateForInput(isoDate, toLanguage);
    }

    return dateString;
  } catch (error) {
    console.error('Error converting date between languages:', error);
    return dateString;
  }
};

/**
 * Safely format date for input, handling potential format mismatches
 */
export const safeFormatDateForInput = (
  dateString: string,
  language: 'en' | 'vi',
  sourceLanguage?: 'en' | 'vi'
): string => {
  if (!dateString) return '';

  try {
    // If source language is specified and different, convert first
    if (sourceLanguage && sourceLanguage !== language) {
      return convertDateBetweenLanguages(dateString, sourceLanguage, language);
    }

    // If already in correct format (contains /), return as is
    if (dateString.includes('/')) {
      return dateString;
    }

    // Otherwise, format from ISO
    return formatDateForInput(dateString, language);
  } catch (error) {
    console.error('Error safely formatting date:', error);
    return dateString;
  }
};
