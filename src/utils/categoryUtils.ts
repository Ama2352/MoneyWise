import {
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Utensils,
  Gamepad2,
  Shirt,
  Plane,
  Heart,
  GraduationCap,
  Briefcase,
  CreditCard,
  Gift,
  Music,
  Camera,
  Dumbbell,
  Smartphone,
  Book,
  Fuel,
  PiggyBank,
  TrendingUp,
  Wallet,
  Building2,
  Stethoscope,
  ShoppingBag,
  Wrench,
  Tag,
  DollarSign,
  Banknote,
  Receipt,
  Zap,
  Wifi,
  Phone,
  Monitor,
  Scissors,
  Bus,
  Bike,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CategoryIcon = LucideIcon;

// Mapping keywords to icons
const CATEGORY_KEYWORDS: Record<string, CategoryIcon> = {
  // Food & Dining
  'food': Utensils,
  'restaurant': Utensils,
  'dining': Utensils,
  'meal': Utensils,
  'lunch': Utensils,
  'dinner': Utensils,
  'breakfast': Utensils,
  'coffee': Coffee,
  'drink': Coffee,
  'beverage': Coffee,
  'tea': Coffee,
  'cafe': Coffee,

  // Shopping
  'shopping': ShoppingCart,
  'grocery': ShoppingCart,
  'groceries': ShoppingCart,
  'market': ShoppingCart,
  'supermarket': ShoppingCart,
  'store': ShoppingBag,
  'clothes': Shirt,
  'clothing': Shirt,
  'fashion': Shirt,
  'apparel': Shirt,

  // Transportation
  'transport': Car,
  'transportation': Car,
  'car': Car,
  'vehicle': Car,
  'auto': Car,
  'fuel': Fuel,
  'gas': Fuel,
  'gasoline': Fuel,
  'petrol': Fuel,
  'travel': Plane,
  'flight': Plane,
  'trip': Plane,
  'vacation': Plane,
  'holiday': Plane,
  'bus': Bus,
  'taxi': Car,
  'uber': Car,
  'bike': Bike,
  'bicycle': Bike,

  // Home & Utilities
  'home': Home,
  'house': Home,
  'rent': Home,
  'mortgage': Home,
  'utility': Zap,
  'utilities': Zap,
  'electricity': Zap,
  'electric': Zap,
  'power': Zap,
  'water': Home,
  'internet': Wifi,
  'wifi': Wifi,
  'phone': Phone,
  'mobile': Smartphone,
  'cell': Smartphone,
  'repair': Wrench,
  'maintenance': Wrench,
  'fix': Wrench,

  // Entertainment
  'entertainment': Gamepad2,
  'game': Gamepad2,
  'gaming': Gamepad2,
  'movie': Camera,
  'cinema': Camera,
  'music': Music,
  'concert': Music,
  'show': Camera,
  'sport': Dumbbell,
  'sports': Dumbbell,
  'gym': Dumbbell,
  'fitness': Dumbbell,
  'exercise': Dumbbell,
  'workout': Dumbbell,

  // Health & Medical
  'health': Heart,
  'medical': Stethoscope,
  'doctor': Stethoscope,
  'hospital': Stethoscope,
  'medicine': Stethoscope,
  'pharmacy': Stethoscope,
  'dental': Stethoscope,
  'healthcare': Heart,

  // Education & Work
  'education': GraduationCap,
  'school': GraduationCap,
  'university': GraduationCap,
  'college': GraduationCap,
  'course': Book,
  'book': Book,
  'study': Book,
  'work': Briefcase,
  'job': Briefcase,
  'office': Building2,
  'business': Briefcase,
  'career': Briefcase,

  // Financial
  'finance': DollarSign,
  'financial': DollarSign,
  'bank': Banknote,
  'banking': Banknote,
  'credit': CreditCard,
  'card': CreditCard,
  'loan': CreditCard,
  'debt': CreditCard,
  'investment': TrendingUp,
  'invest': TrendingUp,
  'savings': PiggyBank,
  'save': PiggyBank,
  'money': Wallet,
  'cash': Wallet,
  'payment': Receipt,
  'bill': Receipt,
  'invoice': Receipt,

  // Gifts & Personal
  'gift': Gift,
  'present': Gift,
  'birthday': Gift,
  'anniversary': Gift,
  'personal': Tag,
  'beauty': Scissors,
  'hair': Scissors,
  'salon': Scissors,
  'spa': Heart,

  // Technology
  'technology': Smartphone,
  'tech': Smartphone,
  'computer': Monitor,
  'laptop': Monitor,
  'software': Monitor,
  'app': Smartphone,
  'subscription': Smartphone,

  // Other
  'other': Tag,
  'misc': Tag,
  'miscellaneous': Tag,
  'general': Tag,
  'income': TrendingUp,
  'salary': TrendingUp,
  'wage': TrendingUp,
  'bonus': TrendingUp,
};

/**
 * Auto-assign icon based on category name
 */
export const getIconForCategory = (categoryName: string): CategoryIcon => {
  if (!categoryName) return Tag;

  const normalizedName = categoryName.toLowerCase().trim();
  
  // Check for exact matches first
  if (CATEGORY_KEYWORDS[normalizedName]) {
    return CATEGORY_KEYWORDS[normalizedName];
  }
  
  // Check for partial matches
  for (const [keyword, icon] of Object.entries(CATEGORY_KEYWORDS)) {
    if (normalizedName.includes(keyword) || keyword.includes(normalizedName)) {
      return icon;
    }
  }
  
  // Default icon
  return Tag;
};

/**
 * Get color for category based on common patterns
 */
export const getColorForCategory = (categoryName: string): string => {
  if (!categoryName) return '#10B981';

  const normalizedName = categoryName.toLowerCase().trim();
  
  // Color mapping based on category type
  const colorMap: Record<string, string> = {
    // Food - Orange/Red
    'food': '#F59E0B',
    'restaurant': '#F59E0B', 
    'coffee': '#92400E',
    'dining': '#F59E0B',
    
    // Shopping - Purple
    'shopping': '#8B5CF6',
    'clothes': '#8B5CF6',
    'grocery': '#8B5CF6',
    
    // Transportation - Blue
    'transport': '#3B82F6',
    'car': '#3B82F6',
    'fuel': '#3B82F6',
    'travel': '#06B6D4',
    
    // Home - Green
    'home': '#10B981',
    'utility': '#10B981',
    'rent': '#10B981',
    
    // Entertainment - Pink
    'entertainment': '#EC4899',
    'game': '#EC4899',
    'movie': '#EC4899',
    'music': '#EC4899',
    
    // Health - Red
    'health': '#EF4444',
    'medical': '#EF4444',
    'doctor': '#EF4444',
    
    // Education - Indigo
    'education': '#6366F1',
    'school': '#6366F1',
    'book': '#6366F1',
    
    // Financial - Yellow
    'finance': '#F59E0B',
    'bank': '#F59E0B',
    'investment': '#F59E0B',
    'income': '#10B981',
    'salary': '#10B981',
    
    // Work - Gray
    'work': '#6B7280',
    'job': '#6B7280',
    'office': '#6B7280',
  };
  
  // Check for matches
  for (const [keyword, color] of Object.entries(colorMap)) {
    if (normalizedName.includes(keyword) || keyword.includes(normalizedName)) {
      return color;
    }
  }
  
  // Default color
  return '#10B981';
};
