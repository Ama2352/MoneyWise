/**
 * User-related type definitions
 */

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  currentPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Register route returns just a boolean for success/failure
export interface RegisterResponse {
  success: boolean;
}

// Login route returns a raw token string (converted to structured format by API layer)
export interface LoginResponse {
  token: string;
}

// Legacy AuthResponse - keeping for backward compatibility
export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
