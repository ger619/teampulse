// API Configuration
// Use relative URL for proxy, or full URL for production
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || error.detail || `Request failed with status ${response.status}`);
  }
  return response.json();
};
