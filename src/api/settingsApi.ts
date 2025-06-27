import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { UserProfile } from '../types';

/**
 * Settings and Profile API services
 */

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  currentPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
}

export const settingsApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data;
  },

  /**
   * Update user profile - with proper currentPassword for security
   */
  updateProfile: async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
    console.log('🔄 [SETTINGS] Updating profile with data:', {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      hasCurrentPassword: !!profileData.currentPassword,
      currentPasswordLength: profileData.currentPassword?.length,
      hasNewPassword: !!profileData.newPassword
    });
    
    try {
      // Backend ALWAYS expects newPassword and confirmNewPassword fields
      // If user doesn't want to change password, send current password as newPassword
      const userWantsPasswordChange = profileData.newPassword && profileData.newPassword.trim() !== '';
      
      const updatePayload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        currentPassword: profileData.currentPassword,
        // If no password change intended, send current password as newPassword to satisfy validation
        newPassword: userWantsPasswordChange ? profileData.newPassword : profileData.currentPassword,
        confirmNewPassword: userWantsPasswordChange ? (profileData.confirmNewPassword || '') : profileData.currentPassword
      };
      
      console.log('🔍 [SETTINGS] Payload structure check:', {
        userWantsPasswordChange,
        hasFirstName: 'firstName' in updatePayload,
        hasLastName: 'lastName' in updatePayload,
        hasCurrentPassword: 'currentPassword' in updatePayload,
        hasNewPassword: 'newPassword' in updatePayload,
        hasConfirmNewPassword: 'confirmNewPassword' in updatePayload,
        passwordStrategy: userWantsPasswordChange ? 'CHANGE_PASSWORD' : 'KEEP_CURRENT_PASSWORD',
        keys: Object.keys(updatePayload)
      });
      
      // Safe debug logging that doesn't expose passwords
      const debugPayload = {
        firstName: updatePayload.firstName,
        lastName: updatePayload.lastName,
        currentPassword: '[HIDDEN]',
        newPassword: userWantsPasswordChange ? '[NEW_PASSWORD_HIDDEN]' : '[CURRENT_PASSWORD_REUSED]',
        confirmNewPassword: userWantsPasswordChange ? '[CONFIRM_PASSWORD_HIDDEN]' : '[CURRENT_PASSWORD_REUSED]',
        strategy: userWantsPasswordChange ? 'CHANGING_PASSWORD' : 'PROFILE_ONLY_UPDATE'
      };
      
      console.log('📤 [SETTINGS] Sending update payload:', debugPayload);
      
      const response = await httpClient.put<UserProfile>('/Accounts/profile', updatePayload);
      console.log('✅ [SETTINGS] Profile update SUCCESS:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.log('❌ [SETTINGS] Profile update failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Status Text:', error.response?.statusText);
      console.log('   Error Data:', error.response?.data);
      console.log('   Request URL:', error.config?.url);
      console.log('   Request Method:', error.config?.method);
      
      // Log the actual request body for debugging (without password)
      if (error.config?.data) {
        try {
          const requestBody = JSON.parse(error.config.data);
          const safeBody: any = {
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            currentPassword: requestBody.currentPassword ? '[HIDDEN]' : 'MISSING'
          };
          
          // Only include password fields if they exist in the request
          if ('newPassword' in requestBody) {
            safeBody.newPassword = requestBody.newPassword ? '[HIDDEN]' : 'NULL_OR_EMPTY';
          }
          
          if ('confirmNewPassword' in requestBody) {
            safeBody.confirmNewPassword = requestBody.confirmNewPassword ? '[HIDDEN]' : 'NULL_OR_EMPTY';
          }
          
          console.log('   Request Body:', safeBody);
          console.log('   Body Keys:', Object.keys(requestBody));
          
        } catch (parseError) {
          console.log('   Request Body (raw):', error.config.data);
        }
      }
      
      throw error;
    }
  },

  /**
   * Upload user avatar - try different endpoints
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    console.log('📸 [SETTINGS] Uploading avatar:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
    // Try different endpoints since /Accounts/avatar might not exist
    const endpoints = [
      '/Accounts/avatar',
      '/Accounts/uploadAvatar', 
      '/Accounts/upload-avatar',
      '/Users/avatar',
      '/Users/uploadAvatar'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📤 [SETTINGS] Trying avatar endpoint: ${endpoint}`);
        
        const formData = new FormData();
        formData.append('file', file); // Most common field name
        
        const response = await httpClient.post<{ avatarUrl: string }>(
          endpoint,
          formData,
          {
            timeout: 30000,
            headers: {
              // Let browser set Content-Type with boundary
            }
          }
        );
        
        console.log(`✅ [SETTINGS] Avatar upload SUCCESS at ${endpoint}:`, response.data);
        return response.data;
        
      } catch (error: any) {
        console.log(`❌ [SETTINGS] Avatar endpoint ${endpoint} failed:`, error.response?.status);
        
        // If this endpoint gives 404, continue to next endpoint
        // If it gives 500, try different field names on same endpoint
        if (error.response?.status === 500) {
          const fieldNames = ['avatar', 'image', 'photo'];
          
          for (const fieldName of fieldNames) {
            try {
              console.log(`🔄 [SETTINGS] Trying field name "${fieldName}" on ${endpoint}`);
              const altFormData = new FormData();
              altFormData.append(fieldName, file);
              
              const response = await httpClient.post<{ avatarUrl: string }>(
                endpoint,
                altFormData,
                { timeout: 30000 }
              );
              
              console.log(`✅ [SETTINGS] Avatar upload SUCCESS with field "${fieldName}":`, response.data);
              return response.data;
              
            } catch (fieldError: any) {
              console.log(`❌ [SETTINGS] Field "${fieldName}" also failed:`, fieldError.response?.status);
            }
          }
        }
        
        // Continue to next endpoint
        continue;
      }
    }
    
    // If all endpoints failed, throw the last error
    throw new Error('All avatar upload endpoints failed. The backend may not support avatar uploads yet.');
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: number): Promise<UserResponse> => {
    const response = await httpClient.get<UserResponse>(
      `/Accounts/users/${userId}`
    );
    return response.data;
  },

  /**
   * Create a test account for testing profile updates
   */
  createTestAccount: async (accountData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<UserResponse> => {
    console.log('🧪 [SETTINGS] Creating test account:', {
      email: accountData.email,
      firstName: accountData.firstName,
      lastName: accountData.lastName
    });
    
    try {
      const response = await httpClient.post<UserResponse>('/Accounts/register', {
        email: accountData.email,
        password: accountData.password,
        firstName: accountData.firstName,
        lastName: accountData.lastName
      });
      
      console.log('✅ [SETTINGS] Test account created successfully:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.log('❌ [SETTINGS] Test account creation failed:', error.response?.data);
      throw error;
    }
  }
};

export default settingsApi; 