import React, { createContext, useContext, useMemo } from 'react';
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
  const toast = useToastHook();

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => toast,
    [
      toast.toasts,
      toast.showSuccess,
      toast.showError,
      toast.showInfo,
      toast.showWarning,
      toast.removeToast,
    ]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
