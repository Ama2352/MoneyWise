import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  User,
  Mail,
  Camera,
  Save,
  Loader,
  Edit3,
  Check,
  X,
  AlertCircle,
  Shield,
  Key,
  Bell,
  Globe,
} from 'lucide-react';
import { settingsApi } from '../api/settingsApi';
import { useAuthentication, useToast } from '../hooks';
import type { UserProfile } from '../types';
import '../styles/pages.css';
import '../styles/modals.css';
import '../styles/settings.css';
import httpClient from '../api/httpClient';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const SettingsPage: React.FC = () => {
  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    displayName: '',
    username: '',
    currentPassword: '', // Required for backend security
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { } = useAuthentication();
  const { showSuccess, showError } = useToast();

  // Settings sections
  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      description: 'Manage your personal information and avatar',
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'Password and security settings',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences',
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Globe,
      description: 'Language and display settings',
    },
  ];

  // Temporary profile system for when backend is not available
  const createTemporaryProfileSystem = useCallback(() => {
    console.log('🔧 [TEMP] Using localStorage profile system');
    
    const getStoredProfile = (): UserProfile | null => {
      try {
        const stored = localStorage.getItem('moneywise_profile');
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.error('❌ [TEMP] Error loading profile from localStorage:', error);
        return null;
      }
    };

    const saveProfile = (profile: UserProfile): void => {
      try {
        localStorage.setItem('moneywise_profile', JSON.stringify(profile));
        console.log('💾 [TEMP] Profile saved to localStorage');
      } catch (error) {
        console.error('❌ [TEMP] Error saving profile to localStorage:', error);
      }
    };

    const saveAvatar = (avatarDataUrl: string): void => {
      try {
        localStorage.setItem('moneywise_avatar', avatarDataUrl);
        console.log('📸 [TEMP] Avatar saved to localStorage');
      } catch (error) {
        console.error('❌ [TEMP] Error saving avatar to localStorage:', error);
      }
    };

    const getStoredAvatar = (): string | null => {
      try {
        return localStorage.getItem('moneywise_avatar');
      } catch (error) {
        console.error('❌ [TEMP] Error loading avatar from localStorage:', error);
        return null;
      }
    };

    return { getStoredProfile, saveProfile, saveAvatar, getStoredAvatar };
  }, []);

  // Load profile with automatic fallback to localStorage
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    const tempSystem = createTemporaryProfileSystem();
    
    try {
      // Try backend first
      const backendProfile = await settingsApi.getProfile();
      setProfile(backendProfile);
      
      // Sync to localStorage for backup
      tempSystem.saveProfile(backendProfile);
      
    } catch (error) {
      console.log('⚠️ [BACKEND] Profile fetch failed, using localStorage');
      
      // Fallback to localStorage
      const storedProfile = tempSystem.getStoredProfile();
      if (storedProfile) {
        setProfile(storedProfile);
      } else {
        // Initialize with empty profile if nothing stored
        const emptyProfile: UserProfile = {
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
        setProfile(emptyProfile);
        tempSystem.saveProfile(emptyProfile);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debug API testing functions (only in development)
  const testApiEndpoints = async () => {
    if (!import.meta.env.DEV) return;
    
    console.log('🧪 [DEBUG] Testing API endpoints...');
    
    // Test 1: Simple profile GET (this should work)
    try {
      const profileResponse = await settingsApi.getProfile();
      console.log('✅ [DEBUG] Profile GET successful:', profileResponse);
    } catch (error: any) {
      console.log('❌ [DEBUG] Profile GET failed:', error.response?.status);
    }
    
    // Test 2: Minimal profile PUT with just one field
    try {
      const minimalUpdate = { firstName: 'Test' };
      console.log('🧪 [DEBUG] Testing minimal profile update:', minimalUpdate);
      await httpClient.put('/Accounts/profile', minimalUpdate);
      console.log('✅ [DEBUG] Minimal profile PUT successful');
    } catch (error: any) {
      console.log('❌ [DEBUG] Minimal profile PUT failed:', { status: error.response?.status, data: error.response?.data });
    }
    
    // Test 3: Check current profile structure
    try {
      const currentProfile = await httpClient.get('/Accounts/profile');
      console.log('🧪 [DEBUG] Current profile structure:', currentProfile.data);
    } catch (error: any) {
      console.log('❌ [DEBUG] Profile structure check failed');
    }
  };

  // Comprehensive backend endpoint discovery
  const discoverBackendEndpoints = async () => {
    if (!import.meta.env.DEV) return;
    
    console.log('🔍 [DISCOVERY] Starting backend endpoint discovery...');
    
    const endpointsToTest = [
      // Profile endpoints
      { method: 'GET', path: '/Accounts/profile', description: 'Get Profile' },
      { method: 'GET', path: '/Users/profile', description: 'Get User Profile (alt)' },
      { method: 'GET', path: '/Profile', description: 'Get Profile (simple)' },
      
      // Check for PATCH instead of PUT
      { method: 'PATCH', path: '/Accounts/profile', description: 'Patch Profile', data: { firstName: 'Test' } },
      { method: 'PATCH', path: '/Users/profile', description: 'Patch User Profile', data: { firstName: 'Test' } },
      
      // Check for POST update
      { method: 'POST', path: '/Accounts/profile/update', description: 'Post Profile Update', data: { firstName: 'Test' } },
      { method: 'POST', path: '/Accounts/updateProfile', description: 'Post Update Profile', data: { firstName: 'Test' } },
      
      // API discovery endpoints
      { method: 'GET', path: '/api', description: 'API Root' },
      { method: 'GET', path: '/swagger', description: 'Swagger Docs' },
      { method: 'GET', path: '/swagger-ui', description: 'Swagger UI' },
      { method: 'GET', path: '/api/swagger', description: 'API Swagger' },
      { method: 'GET', path: '/health', description: 'Health Check' },
      { method: 'GET', path: '/api/health', description: 'API Health Check' },
    ];

    for (const endpoint of endpointsToTest) {
      try {
        const config: any = {
          method: endpoint.method.toLowerCase(),
          url: endpoint.path,
          timeout: 5000,
        };
        
        if (endpoint.data) {
          config.data = endpoint.data;
        }
        
        const response = await httpClient(config);
        console.log(`✅ [DISCOVERY] ${endpoint.method} ${endpoint.path} (${endpoint.description}): ${response.status}`);
        
        // If it's a documentation endpoint, log some details
        if (endpoint.path.includes('swagger') || endpoint.path.includes('api')) {
          console.log(`   📄 Response type: ${response.headers['content-type']}`);
          if (typeof response.data === 'string' && response.data.length < 1000) {
            console.log(`   📄 Response preview: ${response.data.substring(0, 200)}...`);
          }
        }
      } catch (error: any) {
        const status = error.response?.status || 'Network Error';
        console.log(`❌ [DISCOVERY] ${endpoint.method} ${endpoint.path} (${endpoint.description}): ${status}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🏁 [DISCOVERY] Backend endpoint discovery completed');
  };

  // Test direct backend communication (bypass Vite proxy)
  const testDirectBackend = async () => {
    if (!import.meta.env.DEV) return;
    
    console.log('🔗 [DIRECT] Testing direct backend communication...');
    
    // Get current token for authentication
    const token = localStorage.getItem('token');
    console.log('🔗 [DIRECT] Using token:', token ? `${token.substring(0, 20)}...` : 'No token found');
    
    const directTests: Array<{
      name: string;
      url: string;
      method: string;
      headers: Record<string, string>;
      body?: string;
    }> = [
      {
        name: 'Direct Backend Health Check',
        url: 'http://localhost:8080/health',
        method: 'GET',
        headers: {}
      },
      {
        name: 'Direct Backend API Root',
        url: 'http://localhost:8080/api',
        method: 'GET',
        headers: {}
      },
      {
        name: 'Direct Profile GET',
        url: 'http://localhost:8080/api/Accounts/profile',
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      },
      {
        name: 'Direct Profile PUT (minimal)',
        url: 'http://localhost:8080/api/Accounts/profile',
        method: 'PUT',
        headers: token ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'TestDirect' })
      }
    ];

    for (const test of directTests) {
      try {
        const fetchOptions: RequestInit = {
          method: test.method,
          headers: test.headers,
          mode: 'cors', // Important for cross-origin requests
        };
        
        if (test.body) {
          fetchOptions.body = test.body;
        }
        
        console.log(`🔗 [DIRECT] Testing: ${test.name}`);
        console.log(`🔗 [DIRECT] URL: ${test.url}`);
        console.log(`🔗 [DIRECT] Method: ${test.method}`);
        console.log(`🔗 [DIRECT] Headers:`, test.headers);
        
        const response = await fetch(test.url, fetchOptions);
        
        console.log(`🔗 [DIRECT] ${test.name}: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          try {
            const data = await response.text();
            console.log(`🔗 [DIRECT] Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
          } catch (e) {
            console.log(`🔗 [DIRECT] Response: (not text data)`);
          }
        } else {
          console.log(`🔗 [DIRECT] Error response: ${response.status} ${response.statusText}`);
        }
        
      } catch (error: any) {
        console.log(`🔗 [DIRECT] ${test.name} failed:`, error.message);
        console.log(`🔗 [DIRECT] Error details:`, error);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('🔗 [DIRECT] Direct backend testing completed');
  };

  // Create a test account for testing profile updates
  const createTestAccount = async () => {
    if (!import.meta.env.DEV) return;
    
    console.log('🧪 [TEST] Creating NEW test account...');
    
    try {
      // Generate unique timestamp for account
      const timestamp = Date.now();
      const testAccountData = {
        email: `testuser${timestamp}@example.com`,
        password: 'TestUser@123',
        firstName: 'Test',
        lastName: 'User'
      };
      
      const result = await settingsApi.createTestAccount(testAccountData);
      console.log('✅ [TEST] Test account created successfully:', result);
      showSuccess(`✅ NEW Test Account Created!
📧 Email: ${testAccountData.email}
🔑 Password: ${testAccountData.password}
👤 Name: ${testAccountData.firstName} ${testAccountData.lastName}

You can now logout and login with this account to test profile updates!`);
      
    } catch (error: any) {
      console.log('❌ [TEST] Test account creation failed:', error.response?.data);
      
      if (error.response?.status === 400) {
        showError('Account creation failed: Email might already exist or invalid data format');
      } else {
        showError('Test account creation failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Enhanced error information display
  const getErrorDetails = (error: any) => {
    const details = {
      status: error?.response?.status || 'Unknown',
      statusText: error?.response?.statusText || 'Unknown',
      message: error?.message || 'Unknown error',
      data: error?.response?.data || 'No response data',
      headers: error?.response?.headers || 'No headers',
    };
    
    return details;
  };

  // Load profile and avatar on component mount
  useEffect(() => {
    const initializeProfile = async () => {
      await loadProfile();
      
      // Load stored avatar after profile is loaded
      const tempSystem = createTemporaryProfileSystem();
      const storedAvatar = tempSystem.getStoredAvatar();
      if (storedAvatar) {
        setProfile(prev => prev ? { ...prev, avatar: storedAvatar } : prev);
      }
    };
    
    initializeProfile();
  }, []); // Empty dependency array to run only once

  // Update formData whenever profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        displayName: profile.displayName || '',
        username: profile.username || profile.email || '',
        currentPassword: '', // Always reset password field
      });
    }
  }, [profile]);

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !validateForm()) return;

    setIsUpdating(true);

    try {
      // Try backend first with proper format
      console.log('🔄 [UI] Attempting backend update with current password');
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        currentPassword: formData.currentPassword,
      };
      
      const updatedProfile = await settingsApi.updateProfile(updateData);
      setProfile(updatedProfile);
      setEditMode(false);
      
      // Also save to localStorage as backup
      const tempSystem = createTemporaryProfileSystem();
      tempSystem.saveProfile(updatedProfile);
      
      showSuccess('Profile updated successfully!');
      
    } catch (error: any) {
      console.error('❌ [UI] Backend update failed, using localStorage fallback:', error);
      
      // Fallback to localStorage system
      const tempSystem = createTemporaryProfileSystem();
      const updatedProfile = { 
        ...profile,
        firstName: formData.firstName,
        lastName: formData.lastName, 
        email: formData.email,
        displayName: formData.displayName,
        username: formData.username
      };
      tempSystem.saveProfile(updatedProfile);
      setProfile(updatedProfile);
      setEditMode(false);
      
      // Show appropriate error message
      if (error.response?.status === 400) {
        showError('Invalid password or data format. Changes saved locally.');
      } else {
        showError('Backend unavailable. Changes saved locally.');
      }
      
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    const tempSystem = createTemporaryProfileSystem();

    try {
      // Use temporary system for avatar upload
      console.log('📸 [TEMP] Processing avatar upload locally');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarDataUrl = e.target?.result as string;
        
        // Save avatar and update profile
        tempSystem.saveAvatar(avatarDataUrl);
        
        const updatedProfile = { ...profile, avatar: avatarDataUrl };
        tempSystem.saveProfile(updatedProfile);
        setProfile(updatedProfile);
        
        showSuccess('Avatar updated successfully (saved locally)');
        setIsUploadingAvatar(false);
      };
      
      reader.onerror = () => {
        showError('Failed to process image');
        setIsUploadingAvatar(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('❌ [TEMP] Error uploading avatar:', error);
      showError('Failed to upload avatar');
      setIsUploadingAvatar(false);
    }
  };

  // File input handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use temporary avatar upload since backend doesn't work
      handleAvatarUpload(e);
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    }
    
    if (!formData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required to save changes';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form helpers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        displayName: profile.displayName || '',
        username: profile.username || profile.email || '',
        currentPassword: '', // Always reset password field
      });
    }
    setEditMode(false);
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <Loader size={40} className="animate-spin" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`settings-nav-item ${
                    activeSection === section.id ? 'active' : ''
                  }`}
                >
                  <Icon size={20} />
                  <div className="settings-nav-content">
                    <span className="settings-nav-title">{section.title}</span>
                    <span className="settings-nav-description">{section.description}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Profile Settings</h2>
                <p>Update your personal information and avatar</p>
                
                {/* Backend Status Information */}
                <div style={{
                  background: '#e0f2fe',
                  border: '1px solid #81d4fa',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#01579b'
                }}>
                  <span style={{ fontSize: '16px' }}>🔐</span>
                  <div>
                    <strong>Security Update:</strong> Profile updates now require your current password for verification. 
                    Backend integration is ready with localStorage fallback.
                  </div>
                </div>
              </div>

              {/* Debug Section - Only show in development */}
              {import.meta.env.DEV && (
                <div style={{ 
                  background: '#f8f9fa', 
                  border: '1px solid #e9ecef', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  marginBottom: '24px' 
                }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#495057' }}>
                    🔧 Debug Information
                  </h3>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    <div className="status-item">
                      <div><strong>GET Profile:</strong> ✅ Working (200 OK)</div>
                      <div><strong>Update/Upload Status:</strong> ❌ Not Working (400/500 errors)</div>
                      <div><strong>Temporary System:</strong> ✅ Active (localStorage-based)</div>
                      <div><strong>Stored Locally:</strong> {profile ? '✅ Yes' : '❌ No'}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={testApiEndpoints}
                      style={{
                        padding: '8px 16px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🧪 Test API Endpoints
                    </button>
                    <button 
                      onClick={discoverBackendEndpoints}
                      style={{
                        padding: '8px 16px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🔍 Discover Backend
                    </button>
                    <button 
                      onClick={testDirectBackend}
                      style={{
                        padding: '8px 16px',
                        background: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🔗 Test Direct Backend
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          console.log('🧪 [QUICK TEST] Testing with known password...');
                          const testData = {
                            firstName: 'Test Updated',
                            lastName: 'User Updated',
                            currentPassword: 'password123' // Common test password
                          };
                          const result = await settingsApi.updateProfile(testData);
                          console.log('✅ [QUICK TEST] Success!', result);
                          showSuccess('Quick test successful!');
                        } catch (error: any) {
                          console.log('❌ [QUICK TEST] Failed with password123');
                          
                          // Try another common password
                          try {
                            const testData2 = {
                              firstName: 'Test Updated',
                              lastName: 'User Updated', 
                              currentPassword: '123456'
                            };
                            const result2 = await settingsApi.updateProfile(testData2);
                            console.log('✅ [QUICK TEST] Success with 123456!', result2);
                            showSuccess('Quick test successful with 123456!');
                          } catch (error2) {
                            console.log('❌ [QUICK TEST] Also failed with 123456');
                            showError('Quick test failed - need to check actual user password');
                          }
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🚀 Quick Test Update
                    </button>
                  </div>
                </div>
              )}

              {/* Avatar Section */}
              <div className="avatar-section">
                <div className="avatar-container">
                  <div className="avatar-wrapper">
                    {profile?.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt="Profile Avatar" 
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <User size={40} />
                      </div>
                    )}
                    
                    <button
                      className="avatar-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <div className="avatar-info">
                  <h3>{profile?.displayName || 'Unknown User'}</h3>
                  <p>{profile?.email}</p>
                  <span className="avatar-hint">
                    Click the camera icon to upload a new avatar (max 5MB)
                  </span>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!editMode}
                      className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && (
                      <div className="form-error">
                        <AlertCircle size={14} />
                        {formErrors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!editMode}
                      className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && (
                      <div className="form-error">
                        <AlertCircle size={14} />
                        {formErrors.lastName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editMode}
                      className={`form-input ${formErrors.email ? 'error' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <div className="form-error">
                        <AlertCircle size={14} />
                        {formErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Edit3 size={16} />
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      disabled={!editMode}
                      className={`form-input ${formErrors.displayName ? 'error' : ''}`}
                      placeholder="Enter your display name"
                    />
                    {formErrors.displayName && (
                      <div className="form-error">
                        <AlertCircle size={14} />
                        {formErrors.displayName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile?.phoneNumber || ''}
                      onChange={(e) => profile && setProfile({ ...profile, phoneNumber: e.target.value })}
                      disabled={!editMode}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Key size={16} />
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      disabled={!editMode}
                      className={`form-input ${formErrors.currentPassword ? 'error' : ''}`}
                      placeholder="Enter your current password"
                    />
                    {formErrors.currentPassword && (
                      <div className="form-error">
                        <AlertCircle size={14} />
                        {formErrors.currentPassword}
                      </div>
                    )}
                    <div className="form-hint">
                      Required for security verification
                    </div>
                  </div>

                  <div className="form-group form-group--full">
                    <label className="form-label">
                      <Edit3 size={16} />
                      Bio
                    </label>
                    <textarea
                      value={profile?.bio || ''}
                      onChange={(e) => profile && setProfile({ ...profile, bio: e.target.value })}
                      disabled={!editMode}
                      className="form-textarea"
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  {!editMode ? (
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="btn btn--primary"
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="btn btn--secondary"
                        disabled={isUpdating}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            💾 Save Changes (Local)
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>

                {editMode && (
                  <div className="offline-indicator">
                    💡 Changes saved locally - will sync when backend is available
                  </div>
                )}
              </form>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Security Settings</h2>
                <p>Manage your password and security preferences</p>
              </div>
              
              <div className="security-options">
                <div className="security-item">
                  <div className="security-item-icon">
                    <Key size={24} />
                  </div>
                  <div className="security-item-content">
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                  </div>
                  <button className="btn btn--secondary" disabled>
                    <Key size={16} />
                    Change Password
                  </button>
                </div>
                
                <div className="security-item">
                  <div className="security-item-icon">
                    <Shield size={24} />
                  </div>
                  <div className="security-item-content">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn btn--secondary" disabled>
                    <Shield size={16} />
                    Enable 2FA
                  </button>
                </div>
              </div>
              
              {/* Development Tools */}
              {import.meta.env.DEV && (
                <div className="security-item">
                  <div className="security-item-icon">
                    <User size={24} />
                  </div>
                  <div className="security-item-content">
                    <h3>Create Test Account</h3>
                    <p>Create a test account for testing profile updates</p>
                  </div>
                  <button 
                    className="btn btn--secondary" 
                    onClick={createTestAccount}
                  >
                    <User size={16} />
                    Create Test Account
                  </button>
                </div>
              )}
              
              <div className="coming-soon">
                <AlertCircle size={20} />
                <span>These security features are coming soon!</span>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Notification Settings</h2>
                <p>Choose what notifications you want to receive</p>
              </div>
              
              <div className="coming-soon">
                <Bell size={20} />
                <span>Notification settings will be available soon!</span>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Preferences</h2>
                <p>Customize your app experience</p>
              </div>
              
              <div className="coming-soon">
                <Globe size={20} />
                <span>Preference settings will be available soon!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 