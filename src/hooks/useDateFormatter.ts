import { useLanguageContext } from '../contexts';
import { formatDateForLanguage } from '../utils/dateUtils';

/**
 * Hook that provides language-aware date formatting functions
 */
export const useDateFormatter = () => {
  const { language } = useLanguageContext();

  const formatDate = (date: string | Date) => {
    return formatDateForLanguage(date, language);
  };

  return {
    formatDate,
    language,
  };
};
