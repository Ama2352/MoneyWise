import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT, DEFAULT_HEADERS } from '../config/api';
import { STORAGE_KEYS } from '../constants';

/**
 * HTTP Client for API communication
 * Configured for Spring Boot backend integration
 */

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Request interceptor - Add auth token to requests
httpClient.interceptors.request.use(
  config => {
    // Debug logging (only in development)
    if (import.meta.env.DEV) {
      console.log('🚀 [HTTP] Making request:', {
        url: config.url,
        method: config.method?.toUpperCase()
      });
    }

    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error('❌ [HTTP] Request error:', error);
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Process failed queue after refresh succeeds or fails
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// Response interceptor - Handle responses and errors with token refresh
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ [HTTP] Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
      requestData: error.config?.data,
      requestHeaders: error.config?.headers,
    });

    const originalRequest = error.config as any; // Handle 401 Unauthorized or 403 Forbidden - Token expired or invalid
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // Only trigger token expiry dialog if there was actually a token (existing session)
      const hasToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (hasToken) {
        // This is a real token expiry - show dialog
        window.dispatchEvent(new CustomEvent('token-expired'));
      } else {
        // No token means this is a login failure or other auth issue - just reject
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (!refreshToken && !accessToken) {
          throw new Error('No tokens available for refresh');
        }

        // Call refresh token endpoint directly (not through httpClient to avoid interceptor loops)
        const refreshResponse = await axios.post(
          `/api/Accounts/RefreshToken`,
          {
            expiredToken: refreshToken || accessToken, // Use refresh token if available, otherwise expired access token
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (
          refreshResponse.data &&
          refreshResponse.data.success &&
          refreshResponse.data.token
        ) {
          const newToken = refreshResponse.data.token;

          // Update stored tokens
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);

          // Update the authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Process the queue with the new token
          processQueue(null, newToken);

          // Retry the original request with new token
          return httpClient(originalRequest);
        } else {
          throw new Error('Token refresh failed - invalid response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Clear tokens
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        // Process queue with error
        processQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } // Handle other error cases (but not 403 if it was already handled above as token expiry)
    if (error.response?.status === 403 && originalRequest._retry) {
      // This is a 403 that was already retried, so it's a real permission issue
      console.error('Access forbidden - insufficient permissions');
    }

    if (error.response && error.response.status >= 500) {
      // Server error - show generic error message
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

export default httpClient;
