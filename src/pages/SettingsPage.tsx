import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguageContext, useToastContext } from '../contexts';
import { useProfileMutations, useProfile } from '../hooks';
import { Input, ConfirmDialog } from '../components/ui';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { userProfile } = useProfile();
  const { translations: t } = useLanguageContext();
  const { updateProfile, uploadAvatar, removeAvatar } = useProfileMutations();
  const { showSuccess, showError } = useToastContext();

  // State for profile fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    displayName: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // State for password fields
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [pwErrors, setPwErrors] = useState<{ [key: string]: string }>({});

  // Loading state
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  // Confirmation dialog state
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // File input ref for avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form data from userProfile only once on mount or when userProfile changes for the first time
  const didInit = useRef(false);
  useEffect(() => {
    if (userProfile && !didInit.current) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        displayName: userProfile.displayName || '',
      });
      didInit.current = true;
    }
  }, [userProfile?.id]); // Only depend on userProfile.id instead of the entire object

  // Handle input change for profile fields
  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [formErrors]
  );

  // Handle input change for password fields
  const handlePasswordInputChange = useCallback(
    (field: string, value: string) => {
      setPwForm(prev => ({ ...prev, [field]: value }));
      if (pwErrors[field]) {
        setPwErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [pwErrors]
  );

  // Clear all form errors
  const clearAllErrors = useCallback(() => {
    setFormErrors({});
    setPwErrors({});
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError(
          t.settings.fileTypeError || 'Please select a valid image file'
        );
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showError(
          t.settings.fileSizeError || 'File size must be less than 5MB'
        );
        return;
      }

      setIsUploadingAvatar(true);
      try {
        const result = await uploadAvatar(file);
        if (result.success) {
          showSuccess(
            t.settings.avatarUpdateSuccess || 'Avatar updated successfully!'
          );
        } else {
          showError(
            result.error ||
              t.settings.avatarUploadError ||
              'Failed to upload avatar'
          );
        }
      } catch (error: any) {
        showError(t.settings.avatarUploadError || 'Failed to upload avatar');
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [uploadAvatar, showSuccess, showError, t.settings]
  );

  // Handle avatar removal
  const handleRemoveAvatar = useCallback(async () => {
    setIsRemovingAvatar(true);
    try {
      const result = await removeAvatar();
      if (result.success) {
        showSuccess(
          t.settings.avatarDeleteSuccess || 'Avatar removed successfully!'
        );
        setShowRemoveConfirm(false);
      } else {
        showError(
          result.error ||
            t.settings.avatarDeleteError ||
            'Failed to remove avatar'
        );
      }
    } catch (error: any) {
      showError(t.settings.avatarDeleteError || 'Failed to remove avatar');
    } finally {
      setIsRemovingAvatar(false);
    }
  }, [removeAvatar, showSuccess, showError, t.settings]);

  // Show remove confirmation dialog
  const showRemoveConfirmation = useCallback(() => {
    setShowRemoveConfirm(true);
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleAvatarUpload(file);
      }
      // Reset the input value so the same file can be selected again
      if (event.target) {
        event.target.value = '';
      }
    },
    [handleAvatarUpload]
  );

  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Validate profile fields (displayName is read-only, not validated)
  const validateForm = useCallback((): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) {
      errors.firstName = t.settings.firstNameRequired;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t.settings.lastNameRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [
    formData.firstName,
    formData.lastName,
    t.settings.firstNameRequired,
    t.settings.lastNameRequired,
  ]);

  // Validate password fields (new/confirm not required, but must match if filled)
  const validatePasswordForm = useCallback((): boolean => {
    const errors: { [key: string]: string } = {};
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

    // Always require current password
    if (!pwForm.currentPassword) {
      errors.currentPassword = t.settings.currentPasswordRequired;
    }

    // If any password field is filled, validate all password fields
    if (pwForm.newPassword || pwForm.confirmNewPassword) {
      if (pwForm.newPassword && !passwordRegex.test(pwForm.newPassword)) {
        errors.newPassword =
          t.settings.passwordComplexity ||
          'Password must be at least 6 characters, include 1 uppercase and 1 special character.';
      }
      if (!pwForm.newPassword) {
        errors.newPassword = t.settings.newPasswordRequired;
      }
      if (!pwForm.confirmNewPassword) {
        errors.confirmNewPassword = t.settings.confirmPasswordRequired;
      }
      if (
        pwForm.newPassword &&
        pwForm.confirmNewPassword &&
        pwForm.newPassword !== pwForm.confirmNewPassword
      ) {
        errors.confirmNewPassword = t.settings.passwordsMustMatch;
      }
    }
    setPwErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pwForm, t.settings]);

  // Handle API errors using existing httpClient error handling
  const handleApiError = useCallback(
    (error: any) => {
      let errorMessage = 'An unexpected error occurred';
      let responseData = error;
      // If error has response.data, use that
      if (error?.response?.data) {
        responseData = error.response.data;
      }
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData?.errors?.CurrentPassword) {
        errorMessage = responseData.errors.CurrentPassword[0];
        setPwErrors(prev => ({ ...prev, currentPassword: errorMessage }));
        showError(t.settings.updateError);
        return;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.title) {
        errorMessage = responseData.title;
      }
      if (
        errorMessage.toLowerCase().includes('password') ||
        errorMessage.toLowerCase().includes('current') ||
        errorMessage.toLowerCase().includes('incorrect')
      ) {
        setPwErrors(prev => ({ ...prev, currentPassword: errorMessage }));
      }
      showError(t.settings.updateError);
    },
    [showError]
  );

  // Unified submit handler
  const handleCombinedUpdate = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      // Clear previous errors
      clearAllErrors();

      // Validate forms
      if (!validateForm()) return;
      if (!validatePasswordForm()) return;

      setIsUpdating(true);
      try {
        const result = await updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
          confirmNewPassword: pwForm.confirmNewPassword,
        });

        console.log('Update profile result:', result); // Debug: log the result

        if (result.success) {
          showSuccess(t.settings.profileAndPasswordUpdated);
          // Clear password form on success
          setPwForm({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          });
          setPwErrors({});
        } else {
          // Handle API error response
          handleApiError(result.error);
        }
      } catch (error: any) {
        // Handle thrown errors
        handleApiError(error);
      } finally {
        setIsUpdating(false);
      }
    },
    [
      formData,
      pwForm,
      validateForm,
      validatePasswordForm,
      updateProfile,
      showSuccess,
      handleApiError,
      clearAllErrors,
      t.settings,
    ]
  );

  // Get avatar source
  const avatarSrc = userProfile?.avatarUrl || '/default-avatar.png'; // Use a default avatar image if none exists
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="page-title">{t.settings.title || 'Account Settings'}</h1>
        <p className="page-subtitle">
          {t.settings.subtitle ||
            'Manage your profile information and account security'}
        </p>
      </div>

      <form onSubmit={handleCombinedUpdate} className="settings-form">
        {/* Avatar Section */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="section-title">
              {t.settings.profileSettings || 'Profile Information'}
            </h2>
            <p className="section-subtitle">
              {t.settings.profileDescription ||
                'Update your personal details and avatar'}
            </p>
          </div>
          <div className="card-content">
            {/* Avatar Upload Section */}
            <div className="avatar-section">
              <div className="avatar-container">
                <div className="avatar-wrapper">
                  {userProfile?.avatarUrl ? (
                    <img
                      src={avatarSrc}
                      alt="User avatar"
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                  <button
                    type="button"
                    className="avatar-upload-btn"
                    onClick={triggerFileInput}
                    disabled={isUploadingAvatar || isRemovingAvatar}
                    title={t.settings.uploadAvatar || 'Upload Avatar'}
                  >
                    {isUploadingAvatar ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="loading-spinner"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    )}
                  </button>
                  {userProfile?.avatarUrl && (
                    <button
                      type="button"
                      className="avatar-delete-btn"
                      onClick={showRemoveConfirmation}
                      disabled={isUploadingAvatar || isRemovingAvatar}
                      title={t.settings.deleteAvatar || 'Delete Avatar'}
                    >
                      {isRemovingAvatar ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="loading-spinner"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7,10 12,15 17,10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="avatar-info">
                <h3>{t.settings.uploadAvatar || 'Upload Avatar'}</h3>
                <p>
                  {t.settings.avatarHint ||
                    'Click the camera icon to upload a new avatar'}
                </p>
                <p className="avatar-hint">
                  {t.settings.avatarFileHint ||
                    'Supported formats: JPG, PNG, GIF. Maximum size: 10MB'}
                </p>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />

            {/* Profile Form Fields */}
            <div className="form-grid">
              <Input
                label={t.settings.firstName || 'First Name'}
                type="text"
                value={formData.firstName}
                onChange={value => handleInputChange('firstName', value)}
                error={formErrors.firstName}
                required={true}
                disabled={isUpdating}
                placeholder={
                  t.settings.firstNamePlaceholder || 'Enter your first name'
                }
              />

              <Input
                label={t.settings.lastName || 'Last Name'}
                type="text"
                value={formData.lastName}
                onChange={value => handleInputChange('lastName', value)}
                error={formErrors.lastName}
                required={true}
                disabled={isUpdating}
                placeholder={
                  t.settings.lastNamePlaceholder || 'Enter your last name'
                }
              />

              <Input
                label={t.settings.emailAddress || 'Email Address'}
                type="email"
                value={formData.email}
                onChange={() => {}} // Read-only
                error=""
                required={false}
                disabled={true}
                placeholder={
                  t.settings.emailPlaceholder || 'Enter your email address'
                }
              />

              <Input
                label={t.settings.displayName || 'Display Name'}
                type="text"
                value={formData.displayName}
                onChange={() => {}} // Read-only
                error=""
                required={false}
                disabled={true}
                placeholder={
                  t.settings.displayNamePlaceholder || 'Enter your display name'
                }
              />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="section-title">
              {t.settings.securitySettings || 'Change Password'}
            </h2>
            <p className="section-subtitle">
              {t.settings.securitySubtitle ||
                'Update your account password (optional)'}
            </p>
          </div>
          <div className="card-content">
            <div className="form-grid password-grid">
              <Input
                label={t.settings.currentPassword || 'Current Password'}
                type="password"
                value={pwForm.currentPassword}
                onChange={value =>
                  handlePasswordInputChange('currentPassword', value)
                }
                error={pwErrors.currentPassword}
                required={true}
                disabled={isUpdating}
                placeholder={
                  t.settings.currentPasswordPlaceholder ||
                  'Enter current password'
                }
                showPasswordToggle={true}
              />

              <Input
                label={t.settings.newPassword || 'New Password'}
                type="password"
                value={pwForm.newPassword}
                onChange={value =>
                  handlePasswordInputChange('newPassword', value)
                }
                error={pwErrors.newPassword}
                required={false}
                disabled={isUpdating}
                placeholder={
                  t.settings.newPasswordPlaceholder || 'Enter new password'
                }
                showPasswordToggle={true}
              />

              <Input
                label={t.settings.confirmNewPassword || 'Confirm New Password'}
                type="password"
                value={pwForm.confirmNewPassword}
                onChange={value =>
                  handlePasswordInputChange('confirmNewPassword', value)
                }
                error={pwErrors.confirmNewPassword}
                required={false}
                disabled={isUpdating}
                placeholder={
                  t.settings.confirmPasswordPlaceholder ||
                  'Confirm new password'
                }
                showPasswordToggle={true}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className={`btn-primary ${isUpdating ? 'loading' : ''}`}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span className="loading-spinner"></span>
                {t.settings.updating || 'Updating...'}
              </>
            ) : (
              t.settings.saveChanges || 'Save Changes'
            )}
          </button>
        </div>
      </form>

      {/* Remove Avatar Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRemoveConfirm}
        title={t.settings.deleteAvatar || 'Delete Avatar'}
        message={
          t.settings.deleteAvatarConfirm ||
          'Are you sure you want to delete your avatar? This action cannot be undone.'
        }
        confirmText={t.settings.delete || 'Delete'}
        cancelText={t.settings.cancel || 'Cancel'}
        type="danger"
        onConfirm={handleRemoveAvatar}
        onCancel={() => setShowRemoveConfirm(false)}
      />
    </div>
  );
};

export default SettingsPage;
