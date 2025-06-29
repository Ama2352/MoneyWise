import useSWR, { mutate } from 'swr';
import type { UpdateProfileRequest, UserProfile } from '../types';
import { SWR_KEYS } from '../config/swr';
import { settingsApi } from '../api/settingsApi';

export const useProfile = () => {
  const { data, error, isLoading } = useSWR<UserProfile>(
    SWR_KEYS.ACCOUNT.PROFILE,
    async () => {
      const result = await settingsApi.getProfile();
      return result;
    }
  );

  return {
    userProfile: data,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.ACCOUNT.PROFILE),
  };
};

export const useProfileMutations = () => {
  const updateProfile = async (profileData: UpdateProfileRequest) => {
    try {
      const updatedProfile = await settingsApi.updateProfile(profileData);
      mutate(SWR_KEYS.ACCOUNT.PROFILE);
      return { success: true, data: updatedProfile };
    } catch (error: any) {
      const data = error.response?.data;
      return {
        success: false,
        error: data || {
          message: 'Failed to update profile',
        },
      };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const response = await settingsApi.uploadAvatar(file);
      mutate(SWR_KEYS.ACCOUNT.PROFILE);
      return { success: true, data: response.avatarUrl };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload avatar',
      };
    }
  };

  const removeAvatar = async () => {
    try {
      await settingsApi.removeAvatar();
      mutate(SWR_KEYS.ACCOUNT.PROFILE);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove avatar',
      };
    }
  };

  return {
    updateProfile,
    uploadAvatar,
    removeAvatar,
  };
};
