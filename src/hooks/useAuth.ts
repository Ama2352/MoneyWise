import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
import { STORAGE_KEYS } from '../constants';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from '../types';

export interface UseAuthenticationReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  tokenExpired: boolean;
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterRequest
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: (isManual?: boolean) => void;
  refreshToken: () => Promise<{
    success: boolean;
    message: string;
    token: string | null;
  }>;
  clearTokenExpired: () => void;
}

// Hook for managing authentication state and operations
export const useAuthentication = (): UseAuthenticationReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Logout function
  const logout = useCallback((isManual: boolean = true) => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setIsAuthenticated(false);

    // Clear SWR cache on logout to prevent data leakage
    import('swr').then(({ mutate }) => {
      console.log('🗑️ [SWR] Clearing cache due to logout');
      mutate(() => true, undefined, { revalidate: false });
    });

    if (!isManual) {
      // Token expired, show dialog
      setTokenExpired(true);
    }
  }, []);

  // Clear token expiry dialog
  const clearTokenExpired = useCallback(() => {
    setTokenExpired(false);
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Skip if we're already authenticated or initial check is done
      if (isAuthenticated || initialCheckDone) {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (token) {
        try {
          // Only set isAuthenticated, don't fetch user profile
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid/expired, clear tokens and let the interceptor handle the state updates
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          // Don't set authentication state here - let handleTokenExpired handle it
        }
      }

      setInitialCheckDone(true);
      setIsLoading(false);
    };

    // Listen for token expiry events from HTTP interceptor
    const handleTokenExpired = () => {
      setTokenExpired(true);
      // Do NOT set isAuthenticated to false yet!
    };

    window.addEventListener('token-expired', handleTokenExpired);
    checkAuth();

    // Cleanup event listener
    return () => {
      window.removeEventListener('token-expired', handleTokenExpired);
    };
  }, [initialCheckDone]); // Remove isAuthenticated from dependencies to prevent re-runs

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);

    try {
      const response: LoginResponse = await authApi.login(credentials);
      // Store the token
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);

      try {
        setIsAuthenticated(true);

        // Clear SWR cache on login to get fresh user-specific data
        import('swr').then(({ mutate }) => {
          console.log('🗑️ [SWR] Clearing cache due to login');
          mutate(() => true, undefined, { revalidate: true });
        });

        return { success: true };
      } catch (profileError) {
        // Still authenticated even if profile fetch fails
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response: RegisterResponse = await authApi.register(userData);
      if (response.success) {
        // Registration successful but user needs to login separately
        return {
          success: true,
          message: 'Registration successful. Please log in.',
        };
      } else {
        return { success: false, message: 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authApi.refreshToken();
      if (response.success) {
        return {
          success: response.success,
          message: response.message,
          token: response.token,
        };
      } else {
        return { success: false, message: 'Token refresh failed', token: null };
      }
    } catch (error) {
      return { success: false, message: 'Token refresh failed', token: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isAuthenticated,
    tokenExpired,
    login,
    register,
    logout,
    refreshToken,
    clearTokenExpired,
  };
};
