import React from 'react';
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
  Tag,  DollarSign,
} from 'lucide-react';
import './IconSelector.css';

export type CategoryIcon = 
  | 'ShoppingCart'
  | 'Coffee'
  | 'Car'
  | 'Home'
  | 'Utensils'
  | 'Gamepad2'
  | 'Shirt'
  | 'Plane'
  | 'Heart'
  | 'GraduationCap'
  | 'Briefcase'
  | 'CreditCard'
  | 'Gift'
  | 'Music'
  | 'Camera'
  | 'Dumbbell'
  | 'Smartphone'
  | 'Book'
  | 'Fuel'
  | 'PiggyBank'
  | 'TrendingUp'
  | 'Wallet'
  | 'Building2'
  | 'Stethoscope'
  | 'ShoppingBag'
  | 'Wrench'
  | 'Tag'
  | 'DollarSign';

const ICON_MAP = {
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
};

const ICON_CATEGORIES = {
  General: ['Tag', 'DollarSign', 'Wallet', 'PiggyBank', 'TrendingUp'],
  Shopping: ['ShoppingCart', 'ShoppingBag', 'Shirt', 'Gift'],
  Food: ['Coffee', 'Utensils'],
  Transportation: ['Car', 'Plane', 'Fuel'],
  Home: ['Home', 'Wrench'],
  Entertainment: ['Gamepad2', 'Music', 'Camera', 'Book'],
  Health: ['Heart', 'Stethoscope', 'Dumbbell'],
  Work: ['Briefcase', 'GraduationCap', 'Building2'],
  Technology: ['Smartphone'],
  Financial: ['CreditCard'],
};

interface IconSelectorProps {
  selectedIcon?: string;
  onIconSelect: (icon: CategoryIcon) => void;
  color?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onIconSelect,
  color = 'var(--primary-500)',
}) => {
  return (
    <div className="icon-selector">
      <div className="icon-selector__label">Choose Icon</div>
      
      {Object.entries(ICON_CATEGORIES).map(([categoryName, icons]) => (
        <div key={categoryName} className="icon-selector__category">
          <div className="icon-selector__category-title">{categoryName}</div>
          <div className="icon-selector__grid">
            {icons.map((iconName) => {
              const IconComponent = ICON_MAP[iconName as CategoryIcon];
              const isSelected = selectedIcon === iconName;
              
              return (
                <button
                  key={iconName}
                  type="button"
                  className={`icon-selector__item ${isSelected ? 'icon-selector__item--selected' : ''}`}
                  onClick={() => onIconSelect(iconName as CategoryIcon)}
                  style={isSelected ? { borderColor: color, backgroundColor: `${color}15` } : {}}
                >
                  <IconComponent 
                    size={20} 
                    color={isSelected ? color : 'var(--text-secondary)'} 
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get icon component by name
export const getIconComponent = (iconName?: string) => {
  if (!iconName) return Tag;
  return ICON_MAP[iconName as CategoryIcon] || Tag;
};
