import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { useToastContext } from '../contexts'; // Renamed to avoid confusion with hook
import { Button, Input, Card } from '../components/ui';
import { validateEmail, validateRequired, validatePassword } from '../utils';
import { ROUTES } from '../constants';
import './RegisterPage.css';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!validateRequired(formData.firstName)) {
      newErrors.firstName = 'First name is required';
    }

    if (!validateRequired(formData.lastName)) {
      newErrors.lastName = 'Last name is required';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        // Registration successful, show toast and then navigate
        showSuccess(
          'Registration successful! Please log in with your credentials.'
        );
        navigate(ROUTES.LOGIN);
      } else {
        showError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError('Registration failed. Please try again.');
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-brand">
            <div className="auth-brand-icon">💰</div>
            <h1 className="auth-brand-title">Money Wise</h1>
          </div>

          <div className="auth-header">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">
              Join us to start managing your finances
            </p>
          </div>

          <Card className="auth-card">
            {' '}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-row">
                <div className="form-group">
                  <Input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(value: string) =>
                      handleInputChange('firstName', value)
                    }
                    error={errors.firstName}
                    className="auth-input"
                    icon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    }
                  />
                </div>
                <div className="form-group">
                  <Input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(value: string) =>
                      handleInputChange('lastName', value)
                    }
                    error={errors.lastName}
                    className="auth-input"
                    icon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(value: string) =>
                    handleInputChange('email', value)
                  }
                  error={errors.email}
                  className="auth-input"
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                />
              </div>

              <div className="form-group">
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(value: string) =>
                    handleInputChange('password', value)
                  }
                  error={errors.password}
                  className="auth-input"
                  showPasswordToggle={true}
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                />
              </div>

              <div className="form-group">
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(value: string) =>
                    handleInputChange('confirmPassword', value)
                  }
                  error={errors.confirmPassword}
                  className="auth-input"
                  showPasswordToggle={true}
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                />
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="auth-submit-btn"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>

              <div className="auth-footer">
                <p className="auth-switch">
                  Already have an account?{' '}
                  <Link to={ROUTES.LOGIN} className="auth-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
