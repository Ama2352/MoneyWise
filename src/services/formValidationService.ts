import { validateEmail, validateRequired, validatePassword } from '../utils';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class FormValidationService {
  private translations: any;

  constructor(translations: any) {
    this.translations = translations;
  }

  validateLoginForm(data: LoginFormData): ValidationResult {
    const errors: Record<string, string> = {};

    if (!validateRequired(data.email)) {
      errors.email = this.translations.validation.emailRequired;
    } else if (!validateEmail(data.email)) {
      errors.email = this.translations.validation.emailInvalid;
    }

    if (!validateRequired(data.password)) {
      errors.password = this.translations.validation.passwordRequired;
    } else if (data.password.length < 6) {
      errors.password = this.translations.validation.passwordTooShort;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateRegisterForm(data: RegisterFormData): ValidationResult {
    const errors: Record<string, string> = {};

    if (!validateRequired(data.firstName)) {
      errors.firstName = this.translations.validation.firstNameRequired;
    }

    if (!validateRequired(data.lastName)) {
      errors.lastName = this.translations.validation.lastNameRequired;
    }

    if (!validateRequired(data.email)) {
      errors.email = this.translations.validation.emailRequired;
    } else if (!validateEmail(data.email)) {
      errors.email = this.translations.validation.emailInvalid;
    }

    if (!validateRequired(data.password)) {
      errors.password = this.translations.validation.passwordRequired;
    } else {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        // Map the first error to appropriate translation key
        const firstError = passwordValidation.errors[0];
        if (firstError.includes('6 characters')) {
          errors.password = this.translations.validation.passwordTooShort;
        } else if (firstError.includes('uppercase')) {
          errors.password =
            this.translations.validation.passwordMissingUppercase;
        } else if (firstError.includes('lowercase')) {
          errors.password =
            this.translations.validation.passwordMissingLowercase;
        } else if (firstError.includes('number')) {
          errors.password = this.translations.validation.passwordMissingNumber;
        } else if (firstError.includes('special')) {
          errors.password = this.translations.validation.passwordMissingSpecial;
        } else {
          errors.password = firstError; // Fallback to original error
        }
      }
    }

    if (!validateRequired(data.confirmPassword)) {
      errors.confirmPassword =
        this.translations.validation.confirmPasswordRequired;
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = this.translations.validation.passwordsNotMatch;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Factory function to create validation service with translations
export const createFormValidationService = (translations: any) => {
  return new FormValidationService(translations);
};
