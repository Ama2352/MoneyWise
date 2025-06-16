import React, { createContext, useContext } from 'react';
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
  const { language, translations, t, setLanguage, toggleLanguage, isLoading } =
    useTranslations();

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations,
        t,
        setLanguage,
        toggleLanguage,
        isLoading,
      }}
    >
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
