import axios from 'axios';
import { apiConfig, ENDPOINTS } from '../config/api';

// Types
interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

interface AuthTokens {
  token: string;
  refreshToken: string;
}

// Create axios instance
const api = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const getStoredTokens = (): AuthTokens | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return token && refreshToken ? { token, refreshToken } : null;
};

const setStoredTokens = (tokens: AuthTokens) => {
  localStorage.setItem(TOKEN_KEY, tokens.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

const clearStoredTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = getStoredTokens();

      if (tokens) {
        try {
          const response = await api.post(ENDPOINTS.auth.refreshToken, {
            refreshToken: tokens.refreshToken,
          });

          const newTokens: AuthTokens = {
            token: response.data.token,
            refreshToken: response.data.refreshToken,
          };

          setStoredTokens(newTokens);
          originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearStoredTokens();
          window.location.reload();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth service methods
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post(ENDPOINTS.auth.login, {
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;
      setStoredTokens({ token, refreshToken });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  },

  async signup(name: string, email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post(ENDPOINTS.auth.signup, {
        name,
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;
      setStoredTokens({ token, refreshToken });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Signup failed');
      }
      throw error;
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.auth.resetRequest, { email });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Password reset request failed');
      }
      throw error;
    }
  },

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.auth.resetConfirm, {
        token,
        newPassword,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Password reset confirmation failed');
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    clearStoredTokens();
  },

  isAuthenticated(): boolean {
    return !!getStoredTokens();
  },

  getAuthToken(): string | null {
    return getStoredTokens()?.token || null;
  },
}; 