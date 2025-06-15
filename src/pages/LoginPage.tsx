import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts';
import { useToastContext } from '../contexts'; // Renamed to avoid confusion with hook
import { Button, Input, Card } from '../components/ui';
import type { LoginFormData } from '../types';
import { validateEmail, validateRequired } from '../utils';
import { ROUTES } from '../constants';
import './LoginPage.css';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const { showError } = useToastContext();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        // Store success message for dashboard to show
        sessionStorage.setItem(
          'loginSuccess',
          'Welcome back! Login successful.'
        );
        // React Router will handle navigation automatically when isAuthenticated becomes true
      } else {
        showError(
          result.error || 'Login failed. Please check your credentials.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Login failed. Please check your credentials and try again.');
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
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <Card className="auth-card">
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {' '}
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
              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="auth-submit-btn"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
              <div className="auth-footer">
                <p className="auth-switch">
                  Don't have an account?{' '}
                  <Link to={ROUTES.REGISTER} className="auth-link">
                    Sign up
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

export default LoginPage;
