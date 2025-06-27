import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Camera,
  Save,
  Loader,
  Edit3,
  X,
  AlertCircle,
  Shield,
  Key,
  Bell,
  Globe,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { settingsApi } from '../api/settingsApi';
import { useAuthContext, useToastContext } from '../contexts';
import '../styles/pages.css';
import '../styles/modals.css';
import '../styles/settings.css';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const SettingsPage: React.FC = () => {
  // Use AuthContext instead of ProfileContext for better synchronization
  const { userProfile, isLoading } = useAuthContext();
  
  // Local state
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
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { showSuccess, showError } = useToastContext();

  // Password management state
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [pwErrors, setPwErrors] = useState<{[key: string]: string}>({});
  const [pwLoading, setPwLoading] = useState(false);
  const [pwShow, setPwShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [updateProfileWithPassword, setUpdateProfileWithPassword] = useState(false);

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

  // Update formData whenever userProfile changes (from AuthContext)
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        displayName: userProfile.displayName || '',
        username: userProfile.username || userProfile.email || '',
      });
    }
  }, [userProfile]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUpdating(true);
    try {
      console.log('📤 [PROFILE] Updating profile with data:', formData);
      
      // Note: Profile-only updates require a current password for security
      // For now, we'll show a message asking user to use the password section
      showError('To update profile information, please use the Security section below and provide your current password.');
      setEditMode(false);
      
    } catch (error: any) {
      console.error('❌ [PROFILE] Update failed:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile. Please try again.';
      showError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Convert to base64 for localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Store avatar in localStorage
        localStorage.setItem('moneywise_avatar', base64String);
        showSuccess('Avatar updated successfully!');
        // Force page reload to refresh with new avatar
        window.location.reload();
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('❌ [AVATAR] Upload failed:', error);
      showError('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // File input handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(e);
    }
  };

  // Delete avatar handler
  const handleDeleteAvatar = async () => {
    if (!userProfile?.avatar) return;
    
    try {
      console.log('🗑️ [AVATAR] Deleting avatar...');
      
      localStorage.removeItem('moneywise_avatar');
      showSuccess('Avatar deleted successfully!');
      console.log('✅ [AVATAR] Avatar deleted successfully');
      
      // Force page reload to refresh without avatar
      window.location.reload();
      
    } catch (error) {
      console.error('❌ [AVATAR] Error deleting avatar:', error);
      showError('Failed to delete avatar. Please try again.');
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
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        displayName: userProfile.displayName || '',
        username: userProfile.username || userProfile.email || '',
      });
    }
    setEditMode(false);
    setFormErrors({});
  };

  // Password validation
  const validatePasswordForm = () => {
    const errors: {[key: string]: string} = {};
    if (!pwForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!pwForm.newPassword) errors.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(pwForm.newPassword)) errors.newPassword = 'Password must contain an uppercase letter';
    else if (!/[a-z]/.test(pwForm.newPassword)) errors.newPassword = 'Password must contain a lowercase letter';
    else if (!/[0-9]/.test(pwForm.newPassword)) errors.newPassword = 'Password must contain a number';
    else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwForm.newPassword)) errors.newPassword = 'Password must contain a special character';
    if (pwForm.newPassword !== pwForm.confirmNewPassword) errors.confirmNewPassword = 'Passwords do not match';
    setPwErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
      // Focus vào trường lỗi đầu tiên
      const firstError = Object.keys(pwErrors)[0];
      if (firstError) {
        const el = document.getElementById(`pw-${firstError}`);
        if (el) (el as HTMLInputElement).focus();
        // Show toast cho lỗi validation đầu tiên
        showError(pwErrors[firstError]);
      }
      return;
    }
    
    // If updating profile, validate profile form too
    if (updateProfileWithPassword && !validateForm()) {
      showError('Please check your profile information.');
      return;
    }
    
    setPwLoading(true);
    try {
      // Use profile data if updating profile, otherwise use current userProfile data
      const profileData = updateProfileWithPassword ? formData : {
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        email: userProfile?.email || '',
        displayName: userProfile?.displayName || '',
        username: userProfile?.username || '',
      };
      
      console.log('📤 [SECURITY] Updating with data:', {
        updateProfileWithPassword,
        profileData,
        hasPassword: !!pwForm.newPassword
      });
      
      await settingsApi.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmNewPassword: pwForm.confirmNewPassword,
      });
      
      const successMessage = updateProfileWithPassword 
        ? 'Profile and password updated successfully!' 
        : 'Password changed successfully!';
      
      console.log('✅ [SECURITY] Update successful, showing toast:', successMessage);
      showSuccess(successMessage);
      
      console.log('✅ [SECURITY] Clearing forms...');
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setPwErrors({});
      setUpdateProfileWithPassword(false);
      
      // If profile was updated, refresh the page to show new data
      if (updateProfileWithPassword) {
        console.log('✅ [SECURITY] Profile updated, will reload in 2 seconds...');
        setTimeout(() => {
          console.log('✅ [SECURITY] Reloading page now...');
          window.location.reload();
        }, 2000); // Increased to 2 seconds to see the toast
      }
      
    } catch (error: any) {
      console.error('❌ [SECURITY] Update failed:', error);
      
      // Lấy message backend nếu có
      let backendMsg = error.response?.data?.message || error.message || '';
      // Mapping lỗi HTTP phổ biến
      if (!backendMsg || /^Request failed with status code/.test(backendMsg)) {
        if ([500,502,503,504].includes(error.response?.status)) backendMsg = 'The server is currently unavailable. Please try again later.';
        else if (error.response?.status === 400) backendMsg = 'Invalid input. Please check your information and try again.';
        else if (error.response?.status === 401 || error.response?.status === 403) backendMsg = 'You are not authorized. Please login again.';
        else backendMsg = 'Something went wrong. Please try again.';
      }
      // Nếu backendMsg là lỗi current password
      if (/current password|invalid/i.test(backendMsg)) {
        backendMsg = 'Your current password is wrong. Please enter again.';
      }
      setPwErrors(errs => ({ ...errs, currentPassword: backendMsg }));
      showError(backendMsg);
      // Focus vào trường current password
      setTimeout(() => {
        const el = document.getElementById('pw-currentPassword');
        if (el) (el as HTMLInputElement).focus();
      }, 100);
    } finally {
      setPwLoading(false);
    }
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
              </div>

              {/* Avatar Section */}
              <div className="avatar-section">
                <div className="avatar-container">
                  <div className="avatar-wrapper">
                    {userProfile?.avatar ? (
                      <img 
                        src={userProfile.avatar} 
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
                    
                    {userProfile?.avatar && (
                      <button
                        className="avatar-delete-btn"
                        onClick={handleDeleteAvatar}
                        title="Delete avatar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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
                  <h3>{userProfile?.displayName || 'Unknown User'}</h3>
                  <p>{userProfile?.email}</p>
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
                      <User size={16} />
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      disabled={!editMode}
                      className="form-input"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={!editMode}
                      className="form-input"
                      placeholder="Enter your username"
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
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="btn btn--primary"
                      >
                        {isUpdating ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="btn btn--secondary"
                        disabled={isUpdating}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Security Settings</h2>
                <p>Change your password for better account protection</p>
              </div>
              <form onSubmit={handleChangePassword} className="profile-form" autoComplete="off">
                
                {/* Option to update profile with password */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={updateProfileWithPassword}
                      onChange={(e) => setUpdateProfileWithPassword(e.target.checked)}
                      style={{ margin: 0 }}
                    />
                    Also update my profile information
                  </label>
                  <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                    Check this to update your name and email along with password change
                  </span>
                </div>

                {/* Profile fields (shown when checkbox is checked) */}
                {updateProfileWithPassword && (
                  <div className="form-grid" style={{ marginBottom: '24px', padding: '16px', border: '1px solid var(--gray-200)', borderRadius: '8px', backgroundColor: 'var(--gray-50)' }}>
                    <h4 style={{ gridColumn: '1 / -1', margin: '0 0 16px 0', color: 'var(--gray-700)' }}>Profile Information</h4>
                    
                    <div className="form-group">
                      <label className="form-label">
                        <User size={16} />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
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

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
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
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <Key size={16} /> Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={pwShow.current ? 'text' : 'password'}
                        value={pwForm.currentPassword}
                        onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                        className={`form-input ${pwErrors.currentPassword ? 'error' : ''}`}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                        id="pw-currentPassword"
                      />
                      <button type="button" style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none' }}
                        tabIndex={-1} onClick={() => setPwShow(s => ({ ...s, current: !s.current }))}>
                        {pwShow.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.currentPassword && <div className="form-error"><AlertCircle size={14} />{pwErrors.currentPassword}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Key size={16} /> New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={pwShow.new ? 'text' : 'password'}
                        value={pwForm.newPassword}
                        onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                        className={`form-input ${pwErrors.newPassword ? 'error' : ''}`}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        id="pw-newPassword"
                      />
                      <button type="button" style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none' }}
                        tabIndex={-1} onClick={() => setPwShow(s => ({ ...s, new: !s.new }))}>
                        {pwShow.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.newPassword && <div className="form-error"><AlertCircle size={14} />{pwErrors.newPassword}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Key size={16} /> Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={pwShow.confirm ? 'text' : 'password'}
                        value={pwForm.confirmNewPassword}
                        onChange={e => setPwForm(f => ({ ...f, confirmNewPassword: e.target.value }))}
                        className={`form-input ${pwErrors.confirmNewPassword ? 'error' : ''}`}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        id="pw-confirmNewPassword"
                      />
                      <button type="button" style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none' }}
                        tabIndex={-1} onClick={() => setPwShow(s => ({ ...s, confirm: !s.confirm }))}>
                        {pwShow.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.confirmNewPassword && <div className="form-error"><AlertCircle size={14} />{pwErrors.confirmNewPassword}</div>}
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={pwLoading}>
                    {pwLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />} 
                    {updateProfileWithPassword ? 'Update Profile & Password' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'profile' && activeSection !== 'security' && (
            <div className="settings-section">
              <div className="coming-soon">
                <h3>Coming Soon</h3>
                <p>This section is under development.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 