import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useTranslations } from '../hooks/useLanguage';
import type { UseTranslationsReturn } from '../hooks/useLanguage';

type LanguageContextType = UseTranslationsReturn;

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export { LanguageContext };

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const lang = useTranslations();

  // Memoize the context value to prevent unnecessary re-renders
  // but force re-render when language or translations change
  const value = useMemo(
    () => ({
      ...lang,
      // Force component re-renders when language changes
      _version: `${lang.language}-${Date.now()}`
    }),
    [lang.language, lang.translations, lang.isLoading, lang.setLanguage, lang.toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      'useLanguageContext must be used within a LanguageProvider'
    );
  }
  return context;
};
