import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import type { UseAuthReturn } from '../hooks/useAuth';

type AuthContextType = UseAuthReturn;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    userProfile,
    isLoading,
    isAuthenticated,
    tokenExpired,
    login,
    register,
    logout,
    refreshToken,
    clearTokenExpired,
  } = useAuthHook();

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        isLoading,
        isAuthenticated,
        tokenExpired,
        login,
        register,
        logout,
        refreshToken,
        clearTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
