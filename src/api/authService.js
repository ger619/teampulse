import { API_BASE_URL, handleResponse } from './config';

// Register a new user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Login user
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies to receive refresh token cookie
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Refresh access token (deprecated - now handled by tokenManager)
export const refreshToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send refresh token cookie
  });
  return handleResponse(response);
};

// Logout user
export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send refresh token cookie to be cleared
  });
  return handleResponse(response);
};
