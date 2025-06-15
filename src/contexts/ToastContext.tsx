import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useToast as useToastHook } from '../hooks/useToast';
import type { ToastMessage } from '../hooks/useToast';

interface ToastContextType {
  toasts: ToastMessage[];
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export { ToastContext };

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, showSuccess, showError, showInfo, showWarning, removeToast } =
    useToastHook();

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
