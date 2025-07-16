// API Configuration
const API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds
  },
  production: {
    baseUrl: 'https://api.flashvibe.com/api', // Replace with your actual production API URL
    timeout: 10000,
  },
  test: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 5000,
  },
};

// Get current environment
const getEnvironment = () => {
  if (process.env.NODE_ENV === 'production') return 'production';
  if (process.env.NODE_ENV === 'test') return 'test';
  return 'development';
};

// Export configuration for current environment
export const apiConfig = API_CONFIG[getEnvironment()];

// API Endpoints
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    resetRequest: '/auth/reset-password',
    resetConfirm: '/auth/reset-password/confirm',
    refreshToken: '/auth/refresh-token',
  },
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile/update',
  },
} as const; 