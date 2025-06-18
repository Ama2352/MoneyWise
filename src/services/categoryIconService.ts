/**
 * Category Icon Service
 *
 * Smart icon mapping system for categories based on name patterns.
 * Provides intelligent icon selection for financial categories.
 */

import {
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Gamepad2,
  Plane,
  GraduationCap,
  Heart,
  Coffee,
  Shirt,
  Zap,
  Phone,
  Wifi,
  Building2,
  Wrench,
  Gift,
  Music,
  Dumbbell,
  Banknote,
  PiggyBank,
  Folder,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

/**
 * Category patterns for icon matching
 */
export interface CategoryPattern {
  keywords: string[];
  icon: LucideIcon;
  description: string;
}

/**
 * Comprehensive category icon mappings
 */
export const CATEGORY_ICON_PATTERNS: CategoryPattern[] = [
  // Food & Dining
  {
    keywords: ['food', 'dining', 'restaurant', 'grocery', 'eat', 'meal'],
    icon: Utensils,
    description: 'Food & Dining',
  },

  // Transportation
  {
    keywords: [
      'transport',
      'car',
      'vehicle',
      'gas',
      'fuel',
      'parking',
      'taxi',
      'uber',
    ],
    icon: Car,
    description: 'Transportation',
  },

  // Coffee & Beverages (more specific than food)
  {
    keywords: ['coffee', 'drink', 'beverage', 'cafe'],
    icon: Coffee,
    description: 'Coffee & Beverages',
  },

  // Electricity & Power
  {
    keywords: ['electricity', 'power'],
    icon: Zap,
    description: 'Electricity & Power',
  },

  // Internet & Wifi
  {
    keywords: ['internet', 'wifi', 'broadband'],
    icon: Wifi,
    description: 'Internet & Connectivity',
  },

  // Housing & Utilities
  {
    keywords: ['rent', 'mortgage', 'housing', 'home', 'utilities', 'water'],
    icon: Home,
    description: 'Housing & Utilities',
  },

  // Clothing & Fashion
  {
    keywords: ['clothes', 'clothing', 'fashion'],
    icon: Shirt,
    description: 'Clothing & Fashion',
  },

  // Shopping (general)
  {
    keywords: ['shopping', 'retail'],
    icon: ShoppingBag,
    description: 'Shopping',
  },

  // Music
  {
    keywords: ['music'],
    icon: Music,
    description: 'Music',
  },

  // Entertainment (general)
  {
    keywords: ['entertainment', 'game', 'movie', 'fun', 'hobby'],
    icon: Gamepad2,
    description: 'Entertainment',
  },

  // Travel
  {
    keywords: ['travel', 'vacation', 'trip', 'hotel', 'flight'],
    icon: Plane,
    description: 'Travel',
  },

  // Education
  {
    keywords: ['education', 'school', 'course', 'learning', 'book'],
    icon: GraduationCap,
    description: 'Education',
  },

  // Fitness & Gym
  {
    keywords: ['fitness', 'gym'],
    icon: Dumbbell,
    description: 'Fitness & Gym',
  },

  // Health & Medical (general)
  {
    keywords: ['health', 'medical', 'doctor', 'hospital', 'medicine'],
    icon: Heart,
    description: 'Health & Medical',
  },

  // Phone & Mobile
  {
    keywords: ['phone'],
    icon: Phone,
    description: 'Phone & Mobile',
  },

  // Bills & Services (general)
  {
    keywords: ['bill', 'service', 'subscription'],
    icon: Building2,
    description: 'Bills & Services',
  },

  // Maintenance & Repairs
  {
    keywords: ['maintenance', 'repair', 'fix'],
    icon: Wrench,
    description: 'Maintenance & Repairs',
  },

  // Gifts & Donations
  {
    keywords: ['gift', 'donation', 'charity'],
    icon: Gift,
    description: 'Gifts & Donations',
  },

  // Investment & Trading
  {
    keywords: ['investment', 'profit'],
    icon: TrendingUp,
    description: 'Investment & Trading',
  },

  // Salary & Income (general)
  {
    keywords: ['salary', 'income', 'wage', 'earning'],
    icon: Banknote,
    description: 'Salary & Income',
  },

  // Savings & Emergency Fund
  {
    keywords: ['saving', 'emergency', 'fund'],
    icon: PiggyBank,
    description: 'Savings & Emergency Fund',
  },
];

/**
 * Get the most appropriate icon for a category name
 *
 * @param categoryName - The name of the category
 * @returns The matching Lucide icon component
 */
export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const normalizedName = categoryName.toLowerCase().trim();

  // Find the first pattern that matches any keyword
  const matchingPattern = CATEGORY_ICON_PATTERNS.find(pattern =>
    pattern.keywords.some(keyword => normalizedName.includes(keyword))
  );

  return matchingPattern?.icon || Folder;
};

/**
 * Get all available category suggestions with their icons and translation keys
 *
 * @returns Array of category suggestions with translation keys
 */
export const getCategorySuggestions = (): Array<{
  translationKey: string;
  icon: LucideIcon;
}> => {
  return [
    { translationKey: 'categories.suggestions.foodDining', icon: Utensils },
    { translationKey: 'categories.suggestions.transportation', icon: Car },
    { translationKey: 'categories.suggestions.shopping', icon: ShoppingBag },
    { translationKey: 'categories.suggestions.entertainment', icon: Gamepad2 },
    { translationKey: 'categories.suggestions.healthFitness', icon: Heart },
    { translationKey: 'categories.suggestions.salary', icon: Banknote },
    { translationKey: 'categories.suggestions.coffee', icon: Coffee },
    { translationKey: 'categories.suggestions.travel', icon: Plane },
    { translationKey: 'categories.suggestions.education', icon: GraduationCap },
    { translationKey: 'categories.suggestions.housing', icon: Home },
    { translationKey: 'categories.suggestions.utilities', icon: Zap },
    { translationKey: 'categories.suggestions.gifts', icon: Gift },
    { translationKey: 'categories.suggestions.investment', icon: TrendingUp },
    { translationKey: 'categories.suggestions.savings', icon: PiggyBank },
    { translationKey: 'categories.suggestions.bills', icon: Building2 },
    { translationKey: 'categories.suggestions.maintenance', icon: Wrench },
  ];
};

/**
 * Search for category patterns by keyword
 *
 * @param searchTerm - The term to search for
 * @returns Array of matching patterns
 */
export const searchCategoryPatterns = (
  searchTerm: string
): CategoryPattern[] => {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return CATEGORY_ICON_PATTERNS.filter(
    pattern =>
      pattern.keywords.some(keyword => keyword.includes(normalizedSearch)) ||
      pattern.description.toLowerCase().includes(normalizedSearch)
  );
};

/**
 * Get icon component with default props
 *
 * @param categoryName - The category name
 * @param size - Icon size (default: 24)
 * @param className - Additional CSS classes
 * @returns Icon component configuration
 */
export const getCategoryIconConfig = (
  categoryName: string,
  size: number = 24,
  className?: string
) => {
  const IconComponent = getCategoryIcon(categoryName);

  return {
    component: IconComponent,
    props: {
      size,
      className,
    },
  };
};
