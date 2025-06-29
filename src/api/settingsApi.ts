import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { UpdateProfileRequest, UserProfile } from '../types';

/**
 * Settings and Profile API services
 */

export const settingsApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>(
      API_ENDPOINTS.ACCOUNT.PROFILE
    );
    return response.data;
  },

  /**
   * Update user profile - with proper currentPassword for security
   */
  updateProfile: async (
    profileData: UpdateProfileRequest
  ): Promise<UserProfile> => {
    // Ensure currentPassword is provided for security
    if (!profileData.currentPassword) {
      throw new Error('Current password is required to update profile');
    }

    const response = await httpClient.put<UserProfile>(
      API_ENDPOINTS.ACCOUNT.PROFILE,
      profileData
    );

    return response.data;
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<{ avatarUrl: string }>(
      API_ENDPOINTS.ACCOUNT.AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Remove user avatar
   */
  removeAvatar: async (): Promise<{ success: boolean }> => {
    await httpClient.delete(API_ENDPOINTS.ACCOUNT.AVATAR);
    return { success: true };
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>(
      `/Accounts/users/${userId}`
    );
    return response.data;
  },
};

export default settingsApi;
