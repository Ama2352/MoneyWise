import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../constants';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  UserProfile,
  RefreshTokenResponse,
} from '../types';

/**
 * Authentication API services
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<string>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // API returns raw token string, convert to LoginResponse format
    return {
      token: response.data,
    };
  },
  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await httpClient.post<boolean>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return {
      success: response.data,
    };
  } /**
   * Refresh access token
   */,
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    const response = await httpClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { expiredToken: refreshToken || accessToken } // Use refresh token if available, otherwise expired access token
    );
    return response.data;
  },
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data;
  },
};
