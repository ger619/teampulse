import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

// List pulse logs with optional filters
export const getPulseLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.user) params.append('user', filters.user);
  if (filters.team) params.append('team', filters.team);
  if (filters.year) params.append('year', filters.year);
  if (filters.week_index) params.append('week_index', filters.week_index);
  if (filters.mood) params.append('mood', filters.mood);
  if (filters.workload) params.append('workload', filters.workload);
  if (filters.page) params.append('page', filters.page);
  
  const queryString = params.toString();
  const url = queryString 
    ? `${API_BASE_URL}/pulse-logs/?${queryString}`
    : `${API_BASE_URL}/pulse-logs/`;
  
  const headers = await getAuthHeaders();
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

// Create pulse log
export const createPulseLog = async (pulseLogData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/pulse-logs/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(pulseLogData),
  });
  return handleResponse(response);
};

// Get pulse log by ID
export const getPulseLogById = async (logId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/pulse-logs/${logId}/`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

// Update pulse log
export const updatePulseLog = async (logId, pulseLogData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/pulse-logs/${logId}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(pulseLogData),
  });
  return handleResponse(response);
};

// Delete pulse log
export const deletePulseLog = async (logId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/pulse-logs/${logId}/`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete pulse log: ${response.status}`);
  }
  return true;
};
