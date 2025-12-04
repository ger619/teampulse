import { tokenManager } from '../utils/tokenManager';

// API Configuration
// Use relative URL for proxy, or full URL for production
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Get auth headers with valid access token
 * Automatically refreshes token if expired
 * @returns {Promise<Object>} Headers object with Authorization if authenticated
 */
export const getAuthHeaders = async () => {
  const token = await tokenManager.getValidToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Get auth headers synchronously (use only when token is guaranteed fresh)
 * @returns {Object} Headers object with current token
 */
export const getAuthHeadersSync = () => {
  const token = tokenManager.getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
export const handleResponse = async (response) => {
  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401) {
    // Try to refresh token and retry request once
    try {
      await tokenManager.refreshAccessToken();
      // Token refreshed, caller should retry the request
      throw new Error('TOKEN_EXPIRED');
    } catch {
      // Refresh failed, user needs to log in again
      tokenManager.clearTokens();
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || error.detail || `Request failed with status ${response.status}`);
  }
  return response.json();
};
