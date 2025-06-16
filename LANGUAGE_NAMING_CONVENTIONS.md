# Hook Naming Conventions

## Overview

To avoid confusion between similar hooks and ensure clear import paths, this project uses distinct naming conventions for hooks and their corresponding context consumers.

## Language Hooks

### 1. `useTranslations` (Hook - Direct Language Management)

**Location:** `src/hooks/useLanguage.ts`
**Export:** `useTranslations`
**Purpose:** Direct language state management with React hooks
**Usage:** When you need to build custom language functionality

```typescript
import { useTranslations } from '../hooks';

const CustomLanguageComponent = () => {
  const { language, setLanguage, t, translations, toggleLanguage, isLoading } = useTranslations();

  // Direct access to language state management
  // Use this when building custom language features
  return (
    <div>
      <p>Current language: {language}</p>
      <button onClick={toggleLanguage}>Toggle Language</button>
    </div>
  );
};
```

### 2. `useLanguageContext` (Context Hook - Consumer)

**Location:** `src/contexts/LanguageContext.tsx`
**Export:** `useLanguageContext`
**Purpose:** Access language state through React Context
**Usage:** Standard usage for components that need translations

```typescript
import { useLanguageContext } from '../contexts';

const StandardComponent = () => {
  const { t, language, setLanguage } = useLanguageContext();

  // Standard usage for most components
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
};
```

## Authentication Hooks

### 1. `useAuthentication` (Hook - Direct Auth Management)

**Location:** `src/hooks/useAuth.ts`
**Export:** `useAuthentication`
**Purpose:** Direct authentication state management with React hooks
**Usage:** When you need to build custom authentication functionality

```typescript
import { useAuthentication } from '../hooks';

const CustomAuthComponent = () => {
  const {
    userProfile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken
  } = useAuthentication();

  // Direct access to auth state management
  // Use this when building custom auth features
  return (
    <div>
      <p>User: {userProfile?.firstName}</p>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      {isLoading && <span>Loading...</span>}
    </div>
  );
};
```

### 2. `useAuthContext` (Context Hook - Consumer)

**Location:** `src/contexts/AuthContext.tsx`
**Export:** `useAuthContext`
**Purpose:** Access authentication state through React Context
**Usage:** Standard usage for components that need authentication

```typescript
import { useAuthContext } from '../contexts';

const StandardComponent = () => {
  const { userProfile, isAuthenticated, logout } = useAuthContext();

  // Standard usage for most components
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {userProfile?.firstName}!</p>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

**Key Differences:**

- `useAuthentication`: Full auth hook with all functionality
- `useAuthContext`: Context consumer for standard usage (recommended for most cases)

## Import Patterns

### For Standard Components (Recommended)

Most components should use the context hook:

```typescript
import { useLanguageContext } from '../contexts';
```

### For Custom Language Features

Only use the direct hook when building custom language functionality:

```typescript
import { useTranslations } from '../hooks';
```

### For Authentication Features

Use the following imports for authentication-related functionality:

```typescript
import { useAuthentication } from '../hooks'; // For custom auth features
import { useAuthContext } from '../contexts'; // For standard auth usage
```

## Why This Structure?

1. **Clear Distinction**: `useTranslations` vs `useLanguageContext` - no naming conflicts
2. **Purpose-Driven**: The names indicate their intended use case
3. **Import Clarity**: Different import paths prevent accidental mixing
4. **Maintainability**: Easy to understand which hook to use for which purpose

## Migration Guide

If you have old imports, update them as follows:

```typescript
// OLD (ambiguous)
import { useLanguage } from '../hooks';
import { useLanguage } from '../contexts';
import { useAuth } from '../contexts';

// NEW (clear)
import { useTranslations } from '../hooks'; // For custom language features
import { useLanguageContext } from '../contexts'; // For standard usage
import { useAuthentication } from '../hooks'; // For custom auth features
import { useAuthContext } from '../contexts'; // For standard auth usage
```

## Best Practices

### Language Hooks

1. **Default Choice**: Use `useLanguageContext` for 95% of cases
2. **Custom Features**: Only use `useTranslations` when building language-specific functionality

### Authentication Hooks

1. **Default Choice**: Use `useAuthContext` for 95% of cases
2. **Custom Features**: Only use `useAuthentication` when building auth-specific functionality

### General

1. **Consistent Imports**: Stick to the import patterns shown above
2. **Documentation**: Always document which hook you're using and why
3. **Context First**: Prefer context hooks over direct hooks unless you need the extra functionality

## Examples

### Standard Page Component

```typescript
import React from 'react';
import { useLanguageContext } from '../contexts';

const DashboardPage = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  );
};
```

### Custom Language Switcher

```typescript
import React from 'react';
import { useTranslations } from '../hooks';

const AdvancedLanguageSwitcher = () => {
  const { language, setLanguage, toggleLanguage, isLoading } = useTranslations();

  // Custom logic for language switching
  const handleLanguageChange = (newLang) => {
    if (!isLoading) {
      setLanguage(newLang);
    }
  };

  return (
    <div>
      {isLoading ? 'Loading...' : `Current: ${language}`}
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  );
};
```

### Custom Authentication Component

```typescript
import React from 'react';
import { useAuthentication } from '../hooks';

const CustomAuthComponent = () => {
  const {
    userProfile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken
  } = useAuthentication();

  // Custom logic for authentication
  const handleLogin = () => {
    login('username', 'password');
  };

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {isAuthenticated ? (
        <div>
          <p>Welcome, {userProfile?.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please log in</p>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};
```
