import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
import { STORAGE_KEYS } from '../constants';
import type {
  UserProfile,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from '../types';

export interface UseAuthenticationReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tokenExpired: boolean;
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; user?: UserProfile | null; error?: string }>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Logout function
  const logout = useCallback((isManual: boolean = true) => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setUserProfile(null);
    setIsAuthenticated(false);

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
          const userData = await authApi.getProfile();
          setUserProfile(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid/expired, trigger expiry dialog
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          setTokenExpired(true);
        }
      }

      setInitialCheckDone(true);
      setIsLoading(false);
    };

    // Listen for token expiry events from HTTP interceptor
    const handleTokenExpired = () => {
      setTokenExpired(true);
      setIsAuthenticated(false);
      setUserProfile(null);
    };

    window.addEventListener('token-expired', handleTokenExpired);
    checkAuth();

    // Cleanup event listener
    return () => {
      window.removeEventListener('token-expired', handleTokenExpired);
    };
  }, [isAuthenticated, initialCheckDone]);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await authApi.login(credentials);
      // Store the token
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);

      // Fetch user profile using the token
      try {
        const userData = await authApi.getProfile();
        setUserProfile(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      } catch (profileError) {
        // Still authenticated even if profile fetch fails
        setIsAuthenticated(true);
        return { success: true, user: null };
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
    userProfile,
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
