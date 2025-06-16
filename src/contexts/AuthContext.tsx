import React, { createContext, useContext } from 'react';
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
  } = useAuthentication();

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

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
