import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Camera,
  Save,
  Loader,
  Edit3,
  X,
  Shield,
  Key,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { settingsApi } from '../api/settingsApi';
import { useAuthContext, useToastContext } from '../contexts';
import { useTranslations } from '../hooks';
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
  const { translations: t } = useTranslations();
  
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
      title: t.settings.profileSettings,
      icon: User,
      description: t.settings.profileDescription,
    },
    {
      id: 'security',
      title: t.settings.security,
      icon: Shield,
      description: t.settings.securityDescription,
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
      showError(t.settings.updateProfileNote);
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
      showError(t.settings.fileSizeError);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError(t.settings.fileTypeError);
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
        showSuccess(t.settings.avatarUpdateSuccess);
        // Force page reload to refresh with new avatar
        window.location.reload();
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('❌ [AVATAR] Upload failed:', error);
      showError(t.settings.avatarUploadError);
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
      showSuccess(t.settings.avatarDeleteSuccess);
      console.log('✅ [AVATAR] Avatar deleted successfully');
      
      // Force page reload to refresh without avatar
      window.location.reload();
      
    } catch (error) {
      console.error('❌ [AVATAR] Error deleting avatar:', error);
      showError(t.settings.avatarDeleteError);
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = t.settings.firstNameRequired;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t.settings.lastNameRequired;
    }
    if (!formData.displayName.trim()) {
      errors.displayName = t.settings.displayNameRequired;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormErrors({});
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        displayName: userProfile.displayName || '',
      });
    }
  };

  const validatePasswordForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!pwForm.currentPassword) {
      errors.currentPassword = t.settings.currentPasswordRequired;
    }
    if (!pwForm.newPassword) {
      errors.newPassword = t.settings.newPasswordRequired;
    }
    if (pwForm.newPassword && pwForm.newPassword.length < 8) {
      errors.newPassword = t.settings.passwordMinLength;
    }
    if (!pwForm.confirmNewPassword) {
      errors.confirmNewPassword = t.settings.confirmPasswordRequired;
    }
    if (pwForm.newPassword && pwForm.confirmNewPassword && pwForm.newPassword !== pwForm.confirmNewPassword) {
      errors.confirmNewPassword = t.settings.passwordsMustMatch;
    }
    
    setPwErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setPwLoading(true);
    try {
      // If updating profile, validate profile form too
      if (updateProfileWithPassword && !validateForm()) {
        setPwLoading(false);
        return;
      }
      
      // Use profile data if updating profile, otherwise use current userProfile data
      const profileData = updateProfileWithPassword ? formData : {
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        email: userProfile?.email || '',
        displayName: userProfile?.displayName || '',
      };
      
      console.log('📤 [SECURITY] Updating with data:', {
        ...profileData,
        includeProfile: updateProfileWithPassword,
      });
      
      const result = await settingsApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmNewPassword: pwForm.confirmNewPassword,
        // Include profile data if checkbox is checked
        ...(updateProfileWithPassword && {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          displayName: profileData.displayName,
        }),
      });
      
      const successMessage = updateProfileWithPassword 
        ? t.settings.profileAndPasswordUpdated 
        : t.settings.passwordChanged;
      
      console.log('✅ [SECURITY] Update successful, showing toast:', successMessage);
      showSuccess(successMessage);
      
      console.log('✅ [SECURITY] Clearing forms...');
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setPwErrors({});
      setUpdateProfileWithPassword(false);
      
      console.log('✅ [SECURITY] Profile updated, will reload in 2 seconds...');
      setTimeout(() => {
        console.log('✅ [SECURITY] Reloading page now...');
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ [SECURITY] Update failed:', error);
      
      const backendMsg = error.response?.data?.message || error.message || '';
      
      // Nếu backendMsg là lỗi current password
      if (/current password|invalid/i.test(backendMsg)) {
        setPwErrors({ currentPassword: t.settings.currentPasswordWrong });
        // Focus vào trường current password
        const currentPwInput = document.getElementById('pw-currentPassword');
        currentPwInput?.focus();
      } else {
        showError(backendMsg || t.settings.updateError);
      }
    } finally {
      setPwLoading(false);
    }
  };

  const getAvatarSrc = () => {
    const storedAvatar = localStorage.getItem('moneywise_avatar');
    return storedAvatar || userProfile?.avatar || null;
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-center">
          <Loader size={24} className="animate-spin" />
          <span>{t.common.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t.settings.title}</h1>
        <p className="page-subtitle">{t.settings.subtitle}</p>
      </div>

      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
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

        {/* Main Content */}
        <div className="settings-content">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>{t.settings.profileSettings}</h2>
                <p>{t.settings.profileDescription}</p>
              </div>

              {/* Avatar Upload Section */}
              <div className="avatar-section" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                {/* Avatar + overlay buttons */}
                <div className="avatar-container" style={{ position: 'relative', width: 96, height: 96, minWidth: 96 }}>
                  {getAvatarSrc() ? (
                    <img
                      src={getAvatarSrc()!}
                      alt="Profile Avatar"
                      className="avatar-image"
                      style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#e5e7eb', border: '4px solid #fff' }}
                    />
                  ) : (
                    <div className="avatar-placeholder" style={{ width: 96, height: 96, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #fff' }}>
                      <User size={44} color="#9ca3af" />
                    </div>
                  )}
                  {/* Camera icon bottom right */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="avatar-btn-camera"
                    disabled={isUploadingAvatar}
                    style={{ position: 'absolute', right: -8, bottom: -8, width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 2, padding: 0 }}
                    title={t.settings.uploadAvatar}
                  >
                    {isUploadingAvatar ? <Loader size={15} className="animate-spin" /> : <Camera size={16} color="#8b5cf6" />}
                  </button>
                  {/* Trash icon bottom left */}
                  {getAvatarSrc() && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="avatar-btn-trash"
                      style={{ position: 'absolute', left: -8, bottom: -8, width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 2, padding: 0 }}
                      title={t.settings.deleteAvatar}
                    >
                      <Trash2 size={15} color="#ef4444" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="avatar-input"
                    style={{ display: 'none' }}
                  />
                </div>
                {/* Info bên phải avatar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--gray-900)' }} className="display-name">{formData.displayName || userProfile?.displayName || ''}</div>
                  <div className="user-email" style={{ fontSize: 15, marginBottom: 2 }}>{formData.email || userProfile?.email || ''}</div>
                  <div className="avatar-hint-text" style={{ fontSize: 13, marginTop: 4 }}>
                    {t.settings.avatarHint}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      {t.settings.firstName}
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!editMode}
                      className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                      placeholder={t.settings.firstNamePlaceholder}
                    />
                    {formErrors.firstName && (
                      <div className="form-error">
                        {formErrors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      {t.settings.lastName}
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!editMode}
                      className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                      placeholder={t.settings.lastNamePlaceholder}
                    />
                    {formErrors.lastName && (
                      <div className="form-error">
                        {formErrors.lastName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={16} />
                      {t.settings.emailAddress}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="form-input"
                      placeholder={t.settings.emailPlaceholder}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      {t.settings.displayName}
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      disabled={!editMode}
                      className="form-input"
                      placeholder={t.settings.displayNamePlaceholder}
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
                      {t.settings.editProfile}
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
                            {t.settings.updating}
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            {t.settings.saveChanges}
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
                        {t.settings.cancel}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>{t.settings.securitySettings}</h2>
                <p>{t.settings.securitySubtitle}</p>
              </div>
              <form onSubmit={handleChangePassword} className="profile-form" autoComplete="off">
                
                {/* Option to update profile with password */}
                <div className="security-checkbox-container">
                  <label className="security-checkbox-label">
                    <input
                      type="checkbox"
                      checked={updateProfileWithPassword}
                      onChange={(e) => setUpdateProfileWithPassword(e.target.checked)}
                    />
                    {t.settings.alsoUpdateProfile}
                  </label>
                  <div className="security-checkbox-hint">
                    {t.settings.alsoUpdateProfileHint}
                  </div>
                </div>

                {/* Profile fields (shown when checkbox is checked) */}
                {updateProfileWithPassword && (
                  <div className="profile-update-container">
                    <h4 className="profile-update-title">{t.settings.profileInformation}</h4>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">
                          <User size={16} />
                          {t.settings.firstName}
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                          placeholder={t.settings.firstNamePlaceholder}
                        />
                        {formErrors.firstName && (
                          <div className="form-error">
                            {formErrors.firstName}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <User size={16} />
                          {t.settings.lastName}
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                          placeholder={t.settings.lastNamePlaceholder}
                        />
                        {formErrors.lastName && (
                          <div className="form-error">
                            {formErrors.lastName}
                          </div>
                        )}
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">
                          <Mail size={16} />
                          {t.settings.emailAddress}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled={true}
                          className="form-input"
                          placeholder={t.settings.emailPlaceholder}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <Key size={16} /> {t.settings.currentPassword}
                    </label>
                    <div className="password-input-container">
                      <input
                        type={pwShow.current ? 'text' : 'password'}
                        value={pwForm.currentPassword}
                        onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                        className={`form-input password-input ${pwErrors.currentPassword ? 'error' : ''}`}
                        placeholder={t.settings.currentPasswordPlaceholder}
                        autoComplete="current-password"
                        id="pw-currentPassword"
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        tabIndex={-1} 
                        onClick={() => setPwShow(s => ({ ...s, current: !s.current }))}
                      >
                        {pwShow.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.currentPassword && <div className="form-error">{pwErrors.currentPassword}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Key size={16} /> {t.settings.newPassword}
                    </label>
                    <div className="password-input-container">
                      <input
                        type={pwShow.new ? 'text' : 'password'}
                        value={pwForm.newPassword}
                        onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                        className={`form-input password-input ${pwErrors.newPassword ? 'error' : ''}`}
                        placeholder={t.settings.newPasswordPlaceholder}
                        autoComplete="new-password"
                        id="pw-newPassword"
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        tabIndex={-1} 
                        onClick={() => setPwShow(s => ({ ...s, new: !s.new }))}
                      >
                        {pwShow.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.newPassword && <div className="form-error">{pwErrors.newPassword}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Key size={16} /> {t.settings.confirmNewPassword}
                    </label>
                    <div className="password-input-container">
                      <input
                        type={pwShow.confirm ? 'text' : 'password'}
                        value={pwForm.confirmNewPassword}
                        onChange={e => setPwForm(f => ({ ...f, confirmNewPassword: e.target.value }))}
                        className={`form-input password-input ${pwErrors.confirmNewPassword ? 'error' : ''}`}
                        placeholder={t.settings.confirmPasswordPlaceholder}
                        autoComplete="new-password"
                        id="pw-confirmNewPassword"
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        tabIndex={-1} 
                        onClick={() => setPwShow(s => ({ ...s, confirm: !s.confirm }))}
                      >
                        {pwShow.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.confirmNewPassword && <div className="form-error">{pwErrors.confirmNewPassword}</div>}
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={pwLoading}>
                    {pwLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />} 
                    {updateProfileWithPassword ? t.settings.updateProfilePassword : t.settings.changePassword}
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