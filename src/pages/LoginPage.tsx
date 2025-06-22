import { useAuthContext } from '../contexts';
import { useToastContext } from '../contexts';
import { useLanguageContext } from '../contexts';
import { Button } from '../components/ui';
import { AuthLayout } from '../components/layout';
import { AuthInput, EmailIcon, PasswordIcon } from '../components/forms';
import { useForm } from '../hooks';
import { createFormValidationService, type LoginFormData } from '../services';
import { ROUTES } from '../constants';
import './LoginPage.css';

const LoginPage = () => {
  const { login, isLoading } = useAuthContext();
  const { showError } = useToastContext();
  const { translations } = useLanguageContext();

  const validationService = createFormValidationService(translations);

  const { values, errors, handleSubmit, setValue } = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: values => {
      const result = validationService.validateLoginForm(values);
      return result.errors;
    },
    onSubmit: async values => {
      try {
        const result = await login({
          email: values.email,
          password: values.password,
        });
        if (result.success) {
          // Store success message for dashboard to show
          sessionStorage.setItem(
            'loginSuccess',
            translations.auth.loginSuccess
          );
          // React Router will handle navigation automatically when isAuthenticated becomes true
        } else {
          showError(result.error || translations.auth.loginFailed);
        }
      } catch (error) {
        console.error('Login error:', error);
        showError(translations.auth.loginFailed);
      }
    },
  });

  return (
    <AuthLayout
      title={translations.auth.loginTitle}
      subtitle={translations.auth.loginSubtitle}
      footerText={translations.auth.noAccount}
      footerLinkText={translations.auth.signUp}
      footerLinkTo={ROUTES.REGISTER}
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <AuthInput
          type="email"
          placeholder={translations.auth.emailPlaceholder}
          value={values.email}
          onChange={value => setValue('email', value)}
          error={errors.email}
          icon={<EmailIcon />}
        />

        <AuthInput
          type="password"
          placeholder={translations.auth.passwordPlaceholder}
          value={values.password}
          onChange={value => setValue('password', value)}
          error={errors.password}
          showPasswordToggle={true}
          icon={<PasswordIcon />}
        />

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="auth-submit-btn"
          >
            {isLoading
              ? translations.auth.loggingIn
              : translations.auth.loginButton}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
