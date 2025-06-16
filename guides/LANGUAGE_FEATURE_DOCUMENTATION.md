# Language Feature Implementation Documentation

## 📋 Table of Contents

- [🌐 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [📂 File Structure](#-file-structure)
- [🔧 Core Components](#-core-components)
- [🎯 Implementation Details](#-implementation-details)
- [🎨 UI Components](#-ui-components)
- [🔄 Data Flow](#-data-flow)
- [📱 Usage Examples](#-usage-examples)
- [🧪 Testing the Feature](#-testing-the-feature)
- [🚀 Extension Guide](#-extension-guide)

---

## 🌐 Overview

The MoneyWise application includes a comprehensive internationalization (i18n) system that supports multiple languages with seamless switching, persistence, and type safety. The system is built following React best practices and maintains the application's clean architecture.

### Supported Languages

- **English (en)** - Default language
- **Vietnamese (vi)** - Secondary language
- **Extensible** - Easy to add more languages

### Key Features

- ✅ Language persistence across sessions
- ✅ Real-time language switching
- ✅ Type-safe translation keys
- ✅ Fallback support for missing translations
- ✅ Locale-aware formatting (currency, dates, numbers)
- ✅ Multiple UI components for language switching
- ✅ Browser language detection

---

## 🏗️ Architecture

The language feature follows a layered architecture:

```
┌─────────────────────────────────────┐
│           UI Components             │
│   (LanguageSwitcher, Pages)         │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│        React Context Layer          │
│      (LanguageContext.tsx)          │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│         Custom Hook Layer           │
│        (useLanguage.ts)             │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│        Service Layer                │
│     (languageService.ts)            │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│       Translation Data              │
│    (locales/en.ts, vi.ts)           │
└─────────────────────────────────────┘
```

---

## 📂 File Structure

```
src/
├── types/
│   └── common.ts                    # Language types and TranslationKeys interface
├── constants/
│   └── index.ts                     # Language constants and storage keys
├── locales/
│   ├── index.ts                     # Translation loader and language map
│   ├── en.ts                        # English translations
│   └── vi.ts                        # Vietnamese translations
├── services/
│   └── languageService.ts           # Language business logic and persistence
├── hooks/
│   └── useLanguage.ts               # React hook for language management
├── contexts/
│   ├── index.ts                     # Context exports
│   └── LanguageContext.tsx          # React context provider
├── components/
│   └── ui/
│       ├── LanguageSwitcher.tsx     # Language switching component
│       ├── LanguageSwitcher.css     # Component styles
│       └── index.tsx                # UI component exports
├── utils/
│   └── translationUtils.ts          # Translation utility functions
└── pages/
    ├── LoginPage.tsx                # Login page with translations
    ├── RegisterPage.tsx             # Registration page with translations
    └── DashboardPage.tsx            # Dashboard with translations
```

---

## 🔧 Core Components

### 1. Type Definitions (`src/types/common.ts`)

**Purpose**: Defines TypeScript interfaces for type safety and IntelliSense support.

```typescript
// Language enum
export type Language = 'en' | 'vi';

// Language option for UI components
export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

// Complete translation structure
export interface TranslationKeys {
  common: {
    loading: string;
    error: string;
    // ... more common keys
  };
  auth: {
    login: string;
    register: string;
    // ... more auth keys
  };
  // ... more sections
}
```

**Key Features**:

- Strong typing prevents runtime errors
- IntelliSense support for translation keys
- Extensible structure for new sections
- Compile-time validation of translation completeness

### 2. Language Constants (`src/constants/index.ts`)

**Purpose**: Central configuration for language-related constants.

```typescript
// Available languages
export const LANGUAGES = {
  EN: 'en' as const,
  VI: 'vi' as const,
} as const;

// Language options for UI
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

// Storage keys
export const STORAGE_KEYS = {
  // ... existing keys
  LANGUAGE: 'moneywise_language',
} as const;
```

**Key Features**:

- Centralized configuration
- Type-safe constants
- Easy to modify language settings
- Used across the entire application

### 3. Translation Files (`src/locales/`)

#### English Translations (`src/locales/en.ts`)

**Purpose**: Complete English translation set organized by feature domains.

```typescript
export const en: TranslationKeys = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    // ... more common translations
  },
  auth: {
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to your account to continue',
    loginButton: 'Sign In',
    // ... more auth translations
  },
  validation: {
    emailRequired: 'Email is required',
    passwordTooShort: 'Password must be at least 8 characters',
    // ... more validation messages
  },
  // ... more sections
};
```

#### Vietnamese Translations (`src/locales/vi.ts`)

**Purpose**: Complete Vietnamese translation set with proper localization.

```typescript
export const vi: TranslationKeys = {
  common: {
    loading: 'Đang tải...',
    save: 'Lưu',
    cancel: 'Hủy',
    // ... more common translations
  },
  auth: {
    loginTitle: 'Chào mừng trở lại',
    loginSubtitle: 'Đăng nhập vào tài khoản của bạn để tiếp tục',
    loginButton: 'Đăng nhập',
    // ... more auth translations
  },
  // ... more sections
};
```

#### Translation Loader (`src/locales/index.ts`)

**Purpose**: Provides translation loading and language mapping functionality.

```typescript
import { en } from './en';
import { vi } from './vi';
import type { Language, TranslationKeys } from '../types';

// Translation map for quick access
export const translations: Record<Language, TranslationKeys> = {
  en,
  vi,
};

// Get translations for specific language with fallback
export const getTranslations = (language: Language): TranslationKeys => {
  return translations[language] || translations.en;
};
```

**Key Features**:

- Centralized translation loading
- Automatic fallback to English
- Type-safe translation access
- Easy to add new languages

### 4. Language Service (`src/services/languageService.ts`)

**Purpose**: Handles all language-related business logic, persistence, and utilities.

```typescript
class LanguageService {
  // Get stored language or detect from browser
  getStoredLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored && this.isValidLanguage(stored)) {
      return stored as Language;
    }
    return this.detectBrowserLanguage();
  }

  // Save language to localStorage
  saveLanguage(language: Language): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  // Detect browser language with fallback
  detectBrowserLanguage(): Language {
    const browserLang = navigator.language.split('-')[0];
    return this.isValidLanguage(browserLang) ? (browserLang as Language) : 'en';
  }

  // Validate language code
  isValidLanguage(lang: string): boolean {
    return Object.values(LANGUAGES).includes(lang as Language);
  }

  // Get opposite language for toggling
  getOppositeLanguage(current: Language): Language {
    return current === 'en' ? 'vi' : 'en';
  }

  // Format text with parameters (future use)
  formatText(text: string, params?: Record<string, string | number>): string {
    if (!params) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }
}

export const languageService = new LanguageService();
```

**Key Features**:

- Browser language detection
- Persistent storage management
- Language validation
- Text formatting utilities
- Singleton pattern for consistent access

### 5. Custom Hook (`src/hooks/useLanguage.ts`)

**Purpose**: React hook that provides language state management and translation functions.

```typescript
export interface UseLanguageReturn {
  language: Language; // Current language
  translations: TranslationKeys; // Full translation object
  t: (key: string, fallback?: string) => string; // Translation function
  setLanguage: (language: Language) => void; // Change language
  toggleLanguage: () => void; // Toggle between languages
  isLoading: boolean; // Loading state
}

export const useLanguage = (): UseLanguageReturn => {
  const [language, setLanguageState] = useState<Language>(() =>
    languageService.getStoredLanguage()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Get current translations
  const translations = getTranslations(language);

  // Translation function with nested key support
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const value = getNestedValue(translations, key);
      if (typeof value === 'string') {
        return value;
      }
      return fallback || key;
    },
    [translations]
  );

  // Set language with persistence and DOM updates
  const setLanguage = useCallback((newLanguage: Language) => {
    if (!languageService.isValidLanguage(newLanguage)) {
      console.warn(`Invalid language code: ${newLanguage}`);
      return;
    }

    setIsLoading(true);

    // Simulate async loading for future API integration
    setTimeout(() => {
      setLanguageState(newLanguage);
      languageService.saveLanguage(newLanguage);

      // Update document language attribute for accessibility
      document.documentElement.lang = newLanguage;

      setIsLoading(false);
    }, 100);
  }, []);

  // Toggle between available languages
  const toggleLanguage = useCallback(() => {
    const oppositeLanguage = languageService.getOppositeLanguage(language);
    setLanguage(oppositeLanguage);
  }, [language, setLanguage]);

  // Set initial document language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    translations,
    t,
    setLanguage,
    toggleLanguage,
    isLoading,
  };
};
```

**Key Features**:

- State management for current language
- Translation function with dot notation support
- Language persistence
- DOM attribute updates for accessibility
- Loading states for smooth UX
- Memoized functions for performance

### 6. React Context (`src/contexts/LanguageContext.tsx`)

**Purpose**: Provides global language state through React Context API.

```typescript
type LanguageContextType = UseLanguageReturn;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const languageHook = useLanguageHook();

  return (
    <LanguageContext.Provider value={languageHook}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to access language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

**Key Features**:

- Global state management
- Provider pattern for React tree
- Error handling for missing provider
- Type-safe context access

---

## 🎨 UI Components

### LanguageSwitcher Component (`src/components/ui/LanguageSwitcher.tsx`)

**Purpose**: Provides multiple UI patterns for language switching.

```typescript
interface LanguageSwitcherProps {
  variant?: 'toggle' | 'dropdown';
  showText?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'toggle',
  showText = true,
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage, isLoading } = useLanguage();

  if (variant === 'toggle') {
    return (
      <button
        onClick={toggleLanguage}
        disabled={isLoading}
        className={`language-switcher language-switcher--toggle ${className}`}
        aria-label="Switch language"
      >
        {/* Toggle implementation */}
      </button>
    );
  }

  // Dropdown implementation
  return (
    <div className={`language-switcher language-switcher--dropdown ${className}`}>
      {/* Dropdown implementation */}
    </div>
  );
};
```

**Variants**:

1. **Toggle Button**: Simple button that switches between languages

   - Compact design for headers/navigation
   - Shows current language flag
   - One-click language switching

2. **Dropdown**: Select-style dropdown with all available languages
   - Shows language names
   - Expandable for more than 2 languages
   - More explicit language selection

**Styling** (`src/components/ui/LanguageSwitcher.css`):

- Responsive design
- Smooth transitions
- Loading states
- Accessibility focus styles
- Dark/light theme support

---

## 🔄 Data Flow

### Language Change Flow

```
User clicks language switcher
         ↓
LanguageSwitcher calls setLanguage()
         ↓
useLanguage hook updates state
         ↓
languageService.saveLanguage() persists choice
         ↓
React re-renders with new translations
         ↓
DOM lang attribute updated
         ↓
All t() calls return new language strings
```

### Translation Resolution Flow

```
Component calls t('auth.loginTitle')
         ↓
useLanguage hook receives call
         ↓
getNestedValue() extracts value from translations
         ↓
Returns translated string or fallback
         ↓
Component renders with localized text
```

### Application Startup Flow

```
App starts
         ↓
LanguageProvider initializes
         ↓
useLanguage hook calls languageService.getStoredLanguage()
         ↓
Service checks localStorage → browser language → 'en' fallback
         ↓
Initial language set and DOM updated
         ↓
All components receive initial translations
```

---

## 📱 Usage Examples

### Basic Translation Usage

```typescript
import { useLanguage } from '../hooks';

const MyComponent = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('auth.loginTitle')}</h1>
      <p>{t('common.loading')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
};
```

### Language Switching

```typescript
import { useLanguage } from '../hooks';
import { LanguageSwitcher } from '../components/ui';

const Header = () => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  return (
    <header>
      {/* Method 1: Using LanguageSwitcher component */}
      <LanguageSwitcher variant="toggle" showText={false} />

      {/* Method 2: Custom implementation */}
      <button onClick={() => setLanguage('vi')}>
        Switch to Vietnamese
      </button>

      {/* Method 3: Toggle between languages */}
      <button onClick={toggleLanguage}>
        Toggle Language
      </button>

      <span>Current: {language}</span>
    </header>
  );
};
```

### Form Validation with Translations

```typescript
const LoginForm = () => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: LoginFormData) => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('validation.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('validation.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form>
      <Input
        placeholder={t('auth.emailPlaceholder')}
        error={errors.email}
      />
      <Input
        placeholder={t('auth.passwordPlaceholder')}
        error={errors.password}
      />
      <Button>{t('auth.loginButton')}</Button>
    </form>
  );
};
```

### Locale-Aware Formatting

```typescript
import { formatCurrency, formatDate } from '../utils';

const TransactionItem = ({ transaction }) => {
  const { language } = useLanguage();

  return (
    <div>
      <span>{formatCurrency(transaction.amount, language)}</span>
      <span>{formatDate(transaction.date, language)}</span>
    </div>
  );
};
```

---

## 🧪 Testing the Feature

### Manual Testing Checklist

1. **Language Switching**:

   - [ ] Click language switcher changes UI language immediately
   - [ ] Page refresh maintains selected language
   - [ ] Browser navigation preserves language choice
   - [ ] Invalid language codes fallback to English

2. **Translation Coverage**:

   - [ ] All user-facing text uses translations
   - [ ] No hardcoded strings in components
   - [ ] Validation messages are translated
   - [ ] Button labels and placeholders are localized

3. **Accessibility**:

   - [ ] `lang` attribute updates on document
   - [ ] Screen readers announce language changes
   - [ ] Keyboard navigation works for language switcher
   - [ ] Focus management is maintained

4. **Edge Cases**:
   - [ ] Missing translation keys show fallback
   - [ ] Browser language detection works
   - [ ] LocalStorage corruption handling
   - [ ] Component unmounting doesn't cause errors

### Testing Different Scenarios

```typescript
// Test language persistence
localStorage.clear();
// Refresh page → should detect browser language

localStorage.setItem('moneywise_language', 'vi');
// Refresh page → should load Vietnamese

localStorage.setItem('moneywise_language', 'invalid');
// Refresh page → should fallback to English

// Test translation function
const { t } = useLanguage();
console.log(t('auth.loginTitle')); // Should return translation
console.log(t('invalid.key')); // Should return 'invalid.key'
console.log(t('invalid.key', 'Fallback')); // Should return 'Fallback'
```

---

## 🚀 Extension Guide

### Adding New Languages

1. **Add language to types**:

```typescript
// src/types/common.ts
export type Language = 'en' | 'vi' | 'fr'; // Add new language
```

2. **Add language constants**:

```typescript
// src/constants/index.ts
export const LANGUAGES = {
  EN: 'en' as const,
  VI: 'vi' as const,
  FR: 'fr' as const, // Add new language
} as const;

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add new option
];
```

3. **Create translation file**:

```typescript
// src/locales/fr.ts
import type { TranslationKeys } from '../types';

export const fr: TranslationKeys = {
  common: {
    loading: 'Chargement...',
    save: 'Enregistrer',
    // ... complete translations
  },
  // ... all sections
};
```

4. **Update translation map**:

```typescript
// src/locales/index.ts
import { fr } from './fr';

export const translations: Record<Language, TranslationKeys> = {
  en,
  vi,
  fr, // Add new translations
};
```

### Adding New Translation Sections

1. **Update TranslationKeys interface**:

```typescript
// src/types/common.ts
export interface TranslationKeys {
  // ... existing sections
  newFeature: {
    title: string;
    description: string;
    actions: {
      create: string;
      edit: string;
      delete: string;
    };
  };
}
```

2. **Add to all language files**:

```typescript
// src/locales/en.ts
export const en: TranslationKeys = {
  // ... existing translations
  newFeature: {
    title: 'New Feature',
    description: 'Feature description',
    actions: {
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
    },
  },
};

// src/locales/vi.ts - Add Vietnamese equivalent
// src/locales/fr.ts - Add French equivalent (if applicable)
```

### Advanced Features

#### Dynamic Translation Loading

For large applications, implement dynamic loading:

```typescript
// Future enhancement - dynamic loading
const loadTranslations = async (language: Language) => {
  const translations = await import(`../locales/${language}.ts`);
  return translations.default;
};
```

#### Translation Validation

Add build-time validation for missing translations:

```typescript
// scripts/validate-translations.ts
const validateTranslations = () => {
  const english = require('../src/locales/en.ts');
  const vietnamese = require('../src/locales/vi.ts');

  // Compare keys and report missing translations
};
```

#### Pluralization Support

Extend the system for complex pluralization:

```typescript
// Enhanced translation function
const t = (key: string, count?: number, params?: object) => {
  // Handle pluralization based on language rules
};
```

---

## 🎯 Best Practices Summary

### ✅ DO

- Use hierarchical translation keys: `feature.section.specific`
- Provide fallbacks for all translations
- Keep translations close to feature domains
- Use the `t()` function consistently
- Test all language combinations
- Update documentation when adding translations

### ❌ DON'T

- Hardcode user-facing strings
- Use property access on translations object
- Mix languages in the same component
- Skip translations for new features
- Ignore accessibility considerations
- Forget to handle edge cases

### 🔧 Maintenance

- Regularly audit for missing translations
- Keep translation files synchronized
- Update types when adding new sections
- Test language switching in all browsers
- Monitor localStorage usage
- Consider performance implications of large translation files

---

This documentation provides a complete overview of the language feature implementation. The system is designed to be maintainable, extensible, and performant while providing an excellent user experience for multilingual support.
