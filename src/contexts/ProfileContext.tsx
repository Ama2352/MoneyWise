import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../api/settingsApi';
import type { UserProfile } from '../types';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
  setProfileAvatar: (avatar: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions for localStorage
  const getStoredProfile = (): UserProfile | null => {
    try {
      const stored = localStorage.getItem('moneywise_profile');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading profile from localStorage:', error);
      return null;
    }
  };

  const saveProfileToStorage = (profileData: UserProfile): void => {
    try {
      localStorage.setItem('moneywise_profile', JSON.stringify(profileData));
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  };

  const getStoredAvatar = (): string | null => {
    try {
      return localStorage.getItem('moneywise_avatar');
    } catch (error) {
      console.error('Error loading avatar from localStorage:', error);
      return null;
    }
  };

  // Load profile data
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try backend first
      const backendProfile = await settingsApi.getProfile();
      setProfile(backendProfile);
      saveProfileToStorage(backendProfile);
    } catch (error) {
      console.log('⚠️ [PROFILE] Backend fetch failed, using localStorage');
      
      // Fallback to localStorage
      const storedProfile = getStoredProfile();
      if (storedProfile) {
        // Load stored avatar and merge
        const storedAvatar = getStoredAvatar();
        const profileWithAvatar = {
          ...storedProfile,
          avatar: storedAvatar || storedProfile.avatar
        };
        setProfile(profileWithAvatar);
      } else {
        // Initialize with default profile
        const defaultProfile: UserProfile = {
          id: 'temp-' + Date.now(),
          email: '',
          firstName: '',
          lastName: '',
          displayName: '',
          username: '',
          avatar: null,
          phoneNumber: '',
          dateOfBirth: '',
          bio: ''
        };
        setProfile(defaultProfile);
        saveProfileToStorage(defaultProfile);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback((profileData: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return null;
      
      const updatedProfile = { ...prev, ...profileData };
      saveProfileToStorage(updatedProfile);
      return updatedProfile;
    });
  }, []);

  // Set avatar specifically
  const setProfileAvatar = useCallback((avatar: string | null) => {
    if (avatar) {
      localStorage.setItem('moneywise_avatar', avatar);
    } else {
      localStorage.removeItem('moneywise_avatar');
    }
    
    setProfile(prev => prev ? { ...prev, avatar } : prev);
  }, []);

  // Refresh profile from backend
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Initialize on mount & reload when user changes
  useEffect(() => {
    loadProfile();
    // Theo dõi access token, mỗi khi token thay đổi thì reload profile
    const checkTokenChange = () => {
      const token = localStorage.getItem('moneywise_token') || localStorage.getItem('moneywise_access_token') || localStorage.getItem('access_token') || localStorage.getItem('ACCESS_TOKEN') || localStorage.getItem('VITE_ACCESS_TOKEN') || localStorage.getItem('vite_access_token') || localStorage.getItem('moneywise_jwt') || localStorage.getItem('jwt') || localStorage.getItem('token') || localStorage.getItem('VITE_TOKEN') || localStorage.getItem('vite_token') || localStorage.getItem('moneywise_profile_token') || localStorage.getItem('moneywise_auth_token') || localStorage.getItem('moneywise_user_token') || localStorage.getItem('moneywise_user_access_token') || localStorage.getItem('moneywise_user_jwt') || localStorage.getItem('moneywise_user') || localStorage.getItem('moneywise_userid') || localStorage.getItem('moneywise_user_id') || localStorage.getItem('moneywise_uid') || localStorage.getItem('moneywise_email') || localStorage.getItem('moneywise_username') || localStorage.getItem('moneywise_email_address') || localStorage.getItem('moneywise_login_token') || localStorage.getItem('moneywise_login_jwt') || localStorage.getItem('moneywise_login_access_token') || localStorage.getItem('moneywise_login_user_token') || localStorage.getItem('moneywise_login_user_jwt') || localStorage.getItem('moneywise_login_user_access_token') || localStorage.getItem('moneywise_login_user') || localStorage.getItem('moneywise_login_userid') || localStorage.getItem('moneywise_login_user_id') || localStorage.getItem('moneywise_login_uid') || localStorage.getItem('moneywise_login_email') || localStorage.getItem('moneywise_login_username') || localStorage.getItem('moneywise_login_email_address');
      return token;
    };
    let lastToken = checkTokenChange();
    const interval = setInterval(() => {
      const newToken = checkTokenChange();
      if (newToken !== lastToken) {
        lastToken = newToken;
        loadProfile();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loadProfile]);

  const contextValue: ProfileContextType = {
    profile,
    isLoading,
    updateProfile,
    refreshProfile,
    setProfileAvatar,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 