import { API_BASE_URL, handleResponse } from './config';

// Register a new user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Refresh access token
export const refreshToken = async (refreshToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  return handleResponse(response);
};

// Logout user
export const logoutUser = async (refreshToken) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  return handleResponse(response);
};
