// REST API client for Launchpad

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface AxiosConfigWithRetry extends InternalAxiosRequestConfig {
  retryCount?: number;
}

interface ErrorResponseData {
  message?: string;
}

// Use proxy to avoid CORS issues
// The API server sends duplicate CORS headers which causes browsers to reject requests
// In development: proxy through webpack dev server (config-overrides.js)
// In production: use Cloudflare Worker or similar proxy (see PROXY_SETUP.md)
const getApiBaseUrl = (): string => {
  // Use CORS proxy if configured (for production)
  if (process.env.REACT_APP_PROXY_URL) {
    return process.env.REACT_APP_PROXY_URL;
  }

  // Use webpack dev server proxy in development
  if (process.env.NODE_ENV === 'development') {
    return '/api'; // Proxied through config-overrides.js
  }

  // Fallback to direct API call (may have CORS issues)
  return 'https://launch.meme/api/';
};

const API_BASE_URL = getApiBaseUrl();
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000');
const MAX_RETRIES = parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json, text/plain, */*',
    // Note: Origin and Referer are "unsafe headers" that browsers block
    // The proxy will set these server-side in setupProxy.js
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Note: We can't set Origin/Referer in browser (unsafe headers)
    // These need to be set by the proxy server-side
    // For direct API calls, the server may reject without these headers
    // This is why we need the proxy to work
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosConfigWithRetry;

    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry count
    if (!config.retryCount) {
      config.retryCount = 0;
    }

    // Retry logic with exponential backoff
    // Retry on 5xx errors OR network/CORS errors
    const shouldRetry =
      config.retryCount < MAX_RETRIES &&
      ((error.response?.status && error.response.status >= 500) ||
        (!error.response && error.request) || // Network error
        error.message?.toLowerCase().includes('cors')); // CORS error

    if (shouldRetry) {
      config.retryCount += 1;
      const delay = Math.pow(2, config.retryCount) * 1000; // Exponential backoff

      console.warn(
        `Retrying request (attempt ${config.retryCount}/${MAX_RETRIES}) after ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));

      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

// Error handler helper
export const handleApiError = (error: Error | AxiosError): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as ErrorResponseData;
      return data?.message || `Error: ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response
      // Check if it's a CORS error
      if (
        error.message.toLowerCase().includes('cors') ||
        error.message.toLowerCase().includes('network error')
      ) {
        return 'API temporarily unavailable due to network error. Please try again.';
      }
      return 'Network error. Please check your connection.';
    }
  }
  // Something else happened
  if (error.message.toLowerCase().includes('cors')) {
    return 'API temporarily unavailable due to network error. Please try again.';
  }
  return error.message || 'An unexpected error occurred.';
};

export default apiClient;
