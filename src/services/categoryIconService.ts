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
  Smartphone,
  Trophy,
  Palette,
  Camera,
  Settings,
  PawPrint,
  Briefcase,
  Sparkles,
  Users,
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
 * Comprehensive category icon mappings with Vietnamese support
 */
export const CATEGORY_ICON_PATTERNS: CategoryPattern[] = [
  // Food & Dining
  {
    keywords: [
      'food',
      'dining',
      'restaurant',
      'grocery',
      'eat',
      'meal',
      'ăn',
      'uống',
      'thức ăn',
      'nhà hàng',
      'tạp hóa',
      'bữa ăn',
      'món ăn',
    ],
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
      'di chuyển',
      'xe',
      'phương tiện',
      'xăng',
      'nhiên liệu',
      'đỗ xe',
      'giao thông',
    ],
    icon: Car,
    description: 'Transportation',
  },

  // Coffee & Beverages (more specific than food)
  {
    keywords: [
      'coffee',
      'drink',
      'beverage',
      'cafe',
      'cà phê',
      'đồ uống',
      'nước uống',
      'quán cà phê',
    ],
    icon: Coffee,
    description: 'Coffee & Beverages',
  },

  // Electricity & Power
  {
    keywords: ['electricity', 'power', 'điện', 'năng lượng', 'tiền điện'],
    icon: Zap,
    description: 'Electricity & Power',
  },
  // Internet & Wifi
  {
    keywords: ['internet', 'wifi', 'broadband', 'mạng', 'băng thông rộng'],
    icon: Wifi,
    description: 'Internet & Connectivity',
  },

  // Housing & Utilities
  {
    keywords: [
      'rent',
      'mortgage',
      'housing',
      'home',
      'utilities',
      'water',
      'thuê nhà',
      'vay nhà',
      'nhà ở',
      'nhà',
      'tiện ích',
      'nước',
      'hóa đơn nhà',
    ],
    icon: Home,
    description: 'Housing & Utilities',
  },

  // Clothing & Fashion
  {
    keywords: [
      'clothes',
      'clothing',
      'fashion',
      'quần áo',
      'thời trang',
      'may mặc',
      'áo quần',
    ],
    icon: Shirt,
    description: 'Clothing & Fashion',
  },
  // Shopping (general)
  {
    keywords: ['shopping', 'retail', 'mua sắm', 'bán lẻ', 'mua hàng'],
    icon: ShoppingBag,
    description: 'Shopping',
  },

  // Music
  {
    keywords: ['music', 'nhạc', 'âm nhạc', 'nghe nhạc'],
    icon: Music,
    description: 'Music',
  },
  // Entertainment (general)
  {
    keywords: [
      'entertainment',
      'game',
      'movie',
      'fun',
      'hobby',
      'giải trí',
      'trò chơi',
      'phim',
      'vui chơi',
      'sở thích',
    ],
    icon: Gamepad2,
    description: 'Entertainment',
  },

  // Travel
  {
    keywords: [
      'travel',
      'vacation',
      'trip',
      'hotel',
      'flight',
      'du lịch',
      'nghỉ dưỡng',
      'chuyến đi',
      'khách sạn',
      'máy bay',
      'vé máy bay',
    ],
    icon: Plane,
    description: 'Travel',
  },

  // Education
  {
    keywords: [
      'education',
      'school',
      'course',
      'learning',
      'book',
      'giáo dục',
      'trường học',
      'khóa học',
      'học tập',
      'sách',
      'học phí',
    ],
    icon: GraduationCap,
    description: 'Education',
  },

  // Fitness & Gym
  {
    keywords: [
      'fitness',
      'gym',
      'thể dục',
      'tập gym',
      'phòng tập',
      'thể hình',
      'sức khỏe',
    ],
    icon: Dumbbell,
    description: 'Fitness & Gym',
  },

  // Health & Medical (general)
  {
    keywords: [
      'health',
      'medical',
      'doctor',
      'hospital',
      'medicine',
      'sức khỏe',
      'y tế',
      'bác sĩ',
      'bệnh viện',
      'thuốc',
      'khám bệnh',
    ],
    icon: Heart,
    description: 'Health & Medical',
  },

  // Phone & Mobile
  {
    keywords: ['phone', 'điện thoại', 'di động', 'mobile', 'cước phí', 'sim'],
    icon: Phone,
    description: 'Phone & Mobile',
  },

  // Bills & Services (general)
  {
    keywords: [
      'bill',
      'service',
      'subscription',
      'hóa đơn',
      'dịch vụ',
      'đăng ký',
      'phí dịch vụ',
      'thanh toán',
    ],
    icon: Building2,
    description: 'Bills & Services',
  },

  // Maintenance & Repairs
  {
    keywords: [
      'maintenance',
      'repair',
      'fix',
      'bảo trì',
      'sửa chữa',
      'bảo dưỡng',
      'sửa',
    ],
    icon: Wrench,
    description: 'Maintenance & Repairs',
  },

  // Gifts & Donations
  {
    keywords: [
      'gift',
      'donation',
      'charity',
      'quà tặng',
      'tặng',
      'từ thiện',
      'quyên góp',
      'quà',
    ],
    icon: Gift,
    description: 'Gifts & Donations',
  },

  // Investment & Trading
  {
    keywords: [
      'investment',
      'profit',
      'đầu tư',
      'lợi nhuận',
      'chứng khoán',
      'cổ phiếu',
      'kiếm tiền',
    ],
    icon: TrendingUp,
    description: 'Investment & Trading',
  },

  // Salary & Income (general)
  {
    keywords: [
      'salary',
      'income',
      'wage',
      'earning',
      'lương',
      'thu nhập',
      'tiền lương',
      'công',
      'thưởng',
    ],
    icon: Banknote,
    description: 'Salary & Income',
  },

  // Savings & Emergency Fund
  {
    keywords: [
      'saving',
      'emergency',
      'fund',
      'tiết kiệm',
      'khẩn cấp',
      'quỹ',
      'dự phòng',
      'để dành',
    ],
    icon: PiggyBank,
    description: 'Savings & Emergency Fund',
  },

  // Electronics
  {
    keywords: [
      'electronics',
      'electronic',
      'tech',
      'technology',
      'gadget',
      'điện tử',
      'công nghệ',
      'thiết bị',
      'đồ điện tử',
    ],
    icon: Smartphone,
    description: 'Electronics',
  },

  // Sports & Fitness
  {
    keywords: [
      'sports',
      'sport',
      'athletic',
      'exercise',
      'workout',
      'thể thao',
      'vận động',
      'tập luyện',
      'thể dục thể thao',
    ],
    icon: Trophy,
    description: 'Sports',
  },

  // Automotive
  {
    keywords: [
      'automotive',
      'auto',
      'car maintenance',
      'vehicle service',
      'ô tô',
      'xe hơi',
      'bảo dưỡng xe',
      'dịch vụ xe',
    ],
    icon: Car,
    description: 'Automotive',
  },

  // Beauty & Personal Care
  {
    keywords: [
      'beauty',
      'cosmetic',
      'makeup',
      'skincare',
      'personal care',
      'làm đẹp',
      'mỹ phẩm',
      'chăm sóc da',
      'trang điểm',
    ],
    icon: Sparkles,
    description: 'Beauty & Personal Care',
  },

  // Gaming
  {
    keywords: [
      'gaming',
      'video game',
      'console',
      'pc game',
      'chơi game',
      'trò chơi điện tử',
      'game online',
      'máy chơi game',
    ],
    icon: Gamepad2,
    description: 'Gaming',
  },

  // Business
  {
    keywords: [
      'business',
      'work',
      'professional',
      'office',
      'kinh doanh',
      'công việc',
      'văn phòng',
      'chuyên nghiệp',
    ],
    icon: Briefcase,
    description: 'Business',
  },

  // Finance & Banking
  {
    keywords: [
      'finance',
      'financial',
      'bank',
      'banking',
      'tài chính',
      'ngân hàng',
      'giao dịch tài chính',
      'dịch vụ ngân hàng',
    ],
    icon: Banknote,
    description: 'Finance & Banking',
  },

  // Social & Community
  {
    keywords: [
      'social',
      'community',
      'networking',
      'meeting',
      'xã hội',
      'cộng đồng',
      'gặp gỡ',
      'kết nối',
    ],
    icon: Users,
    description: 'Social & Community',
  },

  // Art & Creative
  {
    keywords: [
      'art',
      'creative',
      'design',
      'drawing',
      'painting',
      'nghệ thuật',
      'sáng tạo',
      'thiết kế',
      'vẽ',
      'hội họa',
    ],
    icon: Palette,
    description: 'Art & Creative',
  },

  // Photography
  {
    keywords: [
      'photography',
      'photo',
      'camera',
      'picture',
      'nhiếp ảnh',
      'chụp ảnh',
      'máy ảnh',
      'hình ảnh',
    ],
    icon: Camera,
    description: 'Photography',
  },

  // Tools & Equipment
  {
    keywords: [
      'tools',
      'equipment',
      'hardware',
      'instrument',
      'công cụ',
      'thiết bị',
      'dụng cụ',
      'phần cứng',
    ],
    icon: Settings,
    description: 'Tools & Equipment',
  },

  // Pets & Animals
  {
    keywords: [
      'pets',
      'pet',
      'animal',
      'dog',
      'cat',
      'thú cưng',
      'động vật',
      'chó',
      'mèo',
      'thú nuôi',
    ],
    icon: PawPrint,
    description: 'Pets & Animals',
  },
];

/**
 * Predefined color schemes for category icons using the design system
 */
export const CATEGORY_COLOR_SCHEMES = [
  { bg: 'var(--gradient-primary)', text: 'var(--white)' }, // Primary green
  {
    bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    text: 'var(--white)',
  }, // Blue
  {
    bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    text: 'var(--white)',
  }, // Amber
  {
    bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    text: 'var(--white)',
  }, // Red
  {
    bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    text: 'var(--white)',
  }, // Purple
  {
    bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    text: 'var(--white)',
  }, // Cyan
  {
    bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    text: 'var(--white)',
  }, // Orange
  {
    bg: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
    text: 'var(--white)',
  }, // Lime
  {
    bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    text: 'var(--white)',
  }, // Pink
  {
    bg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    text: 'var(--white)',
  }, // Teal
  {
    bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    text: 'var(--white)',
  }, // Indigo
  {
    bg: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    text: 'var(--white)',
  }, // Violet
];

/**
 * Generate a consistent color scheme for a category name
 */
export const getCategoryColorScheme = (categoryName: string) => {
  // Create a simple hash from the category name
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    const char = categoryName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a consistent index
  const index = Math.abs(hash) % CATEGORY_COLOR_SCHEMES.length;
  return CATEGORY_COLOR_SCHEMES[index];
};

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
 * Note: Only includes suggestions that have corresponding translations defined
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

/**
 * Get category icon configuration with color scheme
 */
export const getCategoryIconConfigWithColor = (
  categoryName: string,
  size?: number,
  className?: string
) => {
  const icon = getCategoryIcon(categoryName);
  const colorScheme = getCategoryColorScheme(categoryName);

  return {
    icon,
    colorScheme,
    size: size || 24,
    className: className || '',
  };
};
