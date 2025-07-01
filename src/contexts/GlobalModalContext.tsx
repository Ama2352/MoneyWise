import React, { createContext, useContext, useState } from 'react';

interface LanguageModalState {
  open: boolean;
  onConfirm?: (lang: 'en' | 'vi') => void;
}

interface GlobalModalContextType {
  languageModal: LanguageModalState;
  showLanguageModal: (onConfirm: (lang: 'en' | 'vi') => void) => void;
  hideLanguageModal: () => void;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export const GlobalModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languageModal, setLanguageModal] = useState<LanguageModalState>({ open: false });

  const showLanguageModal = (onConfirm: (lang: 'en' | 'vi') => void) => {
    setLanguageModal({ open: true, onConfirm });
  };

  const hideLanguageModal = () => {
    setLanguageModal({ open: false });
  };

  return (
    <GlobalModalContext.Provider value={{ languageModal, showLanguageModal, hideLanguageModal }}>
      {children}
    </GlobalModalContext.Provider>
  );
};

export const useGlobalModal = () => {
  const ctx = useContext(GlobalModalContext);
  if (!ctx) throw new Error('useGlobalModal must be used within GlobalModalProvider');
  return ctx;
}; 