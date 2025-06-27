/**
 * User-related type definitions
 */

export interface UserProfile {
  id: string | number; // Backend uses UUID strings, but keeping number for compatibility
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username?: string;
  avatar?: string | null; // Base64 data URL for temporary storage
  avatarUrl?: string; // Backend URL (when available)
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
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
