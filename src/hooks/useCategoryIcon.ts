/**
 * Category Icon Hook
 *
 * Custom hook for working with category icons and suggestions.
 * Provides easy access to icon functionality throughout the app.
 */

import { useMemo } from 'react';
import {
  getCategoryIcon,
  getCategorySuggestions,
  searchCategoryPatterns,
  getCategoryIconConfig,
  type CategoryPattern,
} from '../services/categoryIconService';
import type { LucideIcon } from 'lucide-react';

/**
 * Hook for category icon management
 */
export const useCategoryIcon = () => {
  // Memoize category suggestions to avoid recreation on every render
  const suggestions = useMemo(() => getCategorySuggestions(), []);

  /**
   * Get icon component for a category name
   */
  const getIcon = (categoryName: string): LucideIcon => {
    return getCategoryIcon(categoryName);
  };

  /**
   * Get icon configuration with props
   */
  const getIconConfig = (
    categoryName: string,
    size?: number,
    className?: string
  ) => {
    return getCategoryIconConfig(categoryName, size, className);
  };

  /**
   * Search for category patterns
   */
  const searchPatterns = (searchTerm: string): CategoryPattern[] => {
    return searchCategoryPatterns(searchTerm);
  };

  /**
   * Check if a category name matches any known patterns
   */
  const hasKnownIcon = (categoryName: string): boolean => {
    const patterns = searchCategoryPatterns(categoryName);
    return patterns.length > 0;
  };
  /**
   * Get category suggestions as an array of translated names only
   */
  const getSuggestionNames = (): string[] => {
    return suggestions.map(s => s.translationKey);
  };

  /**
   * Get a random category suggestion
   */
  const getRandomSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  };

  return {
    // Core functions
    getIcon,
    getIconConfig,
    searchPatterns,
    hasKnownIcon,

    // Suggestions
    suggestions,
    getSuggestionNames,
    getRandomSuggestion,

    // Utilities
    totalSuggestions: suggestions.length,
  };
};
