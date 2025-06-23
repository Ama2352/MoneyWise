import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts';
import { useToastContext } from '../contexts';
import { useLanguageContext } from '../contexts';
import { Button } from '../components/ui';
import { AuthLayout } from '../components/layout';
import {
  AuthInput,
  EmailIcon,
  PasswordIcon,
  UserIcon,
} from '../components/forms';
import { useForm } from '../hooks';
import { createFormValidationService } from '../services';
import type { RegisterFormData } from '../services';
import { ROUTES } from '../constants';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthContext();
  const { showSuccess, showError } = useToastContext();
  const { translations } = useLanguageContext();

  const validationService = createFormValidationService(translations);

  const { values, errors, handleSubmit, setValue } = useForm<RegisterFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: values => {
      const result = validationService.validateRegisterForm(values);
      return result.errors;
    },
    onSubmit: async values => {
      try {
        const result = await register({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        if (result.success) {
          // Registration successful, show toast and then navigate
          showSuccess(translations.auth.registerSuccess);
          // Add a small delay to ensure toast is displayed and state is updated
          setTimeout(() => {
            navigate(ROUTES.LOGIN, { replace: true });
          }, 100);
        } else {
          showError(result.error || translations.auth.registerFailed);
        }
      } catch (error) {
        console.error('Registration error:', error);
        showError(translations.auth.registerFailed);
      }
    },
  });

  return (
    <AuthLayout
      title={translations.auth.registerTitle}
      subtitle={translations.auth.registerSubtitle}
      footerText={translations.auth.hasAccount}
      footerLinkText={translations.auth.signIn}
      footerLinkTo={ROUTES.LOGIN}
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="form-row">
          <AuthInput
            type="text"
            placeholder={translations.auth.firstNamePlaceholder}
            value={values.firstName}
            onChange={value => setValue('firstName', value)}
            error={errors.firstName}
            icon={<UserIcon />}
          />
          <AuthInput
            type="text"
            placeholder={translations.auth.lastNamePlaceholder}
            value={values.lastName}
            onChange={value => setValue('lastName', value)}
            error={errors.lastName}
            icon={<UserIcon />}
          />
        </div>

        <AuthInput
          type="email"
          placeholder={translations.auth.emailAddressPlaceholder}
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

        <AuthInput
          type="password"
          placeholder={translations.auth.confirmPasswordPlaceholder}
          value={values.confirmPassword}
          onChange={value => setValue('confirmPassword', value)}
          error={errors.confirmPassword}
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
              ? translations.auth.registering
              : translations.auth.registerButton}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
