import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuthentication } from '../hooks/useAuth';
import type { UseAuthenticationReturn } from '../hooks/useAuth';

type AuthContextType = UseAuthenticationReturn;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthentication();

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => auth,
    [auth.userProfile, auth.isLoading, auth.isAuthenticated, auth.tokenExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
