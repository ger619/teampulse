import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

// Get current user
export const getCurrentUser = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/me/`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

// Update current user
export const updateCurrentUser = async (userData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/me/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// List all users (Admin only)
export const getAllUsers = async (page = 1) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/?page=${page}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

// Alias for consistency
export const getUsers = getAllUsers;

// Get user by ID (Admin only)
export const getUserById = async (userId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

// Update user (Admin only)
export const updateUser = async (userId, userData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`);
  }
  return true;
};
