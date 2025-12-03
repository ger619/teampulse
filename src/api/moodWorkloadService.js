import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

// ============ Moods ============

// List moods
export const getMoods = async () => {
  const response = await fetch(`${API_BASE_URL}/moods/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Create mood (Admin only)
export const createMood = async (moodData) => {
  const response = await fetch(`${API_BASE_URL}/moods/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(moodData),
  });
  return handleResponse(response);
};

// Get mood by ID
export const getMoodById = async (moodId) => {
  const response = await fetch(`${API_BASE_URL}/moods/${moodId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Update mood (Admin only)
export const updateMood = async (moodId, moodData) => {
  const response = await fetch(`${API_BASE_URL}/moods/${moodId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(moodData),
  });
  return handleResponse(response);
};

// Delete mood (Admin only)
export const deleteMood = async (moodId) => {
  const response = await fetch(`${API_BASE_URL}/moods/${moodId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to delete mood: ${response.status}`);
  }
  return true;
};

// ============ Workloads ============

// List workloads
export const getWorkloads = async () => {
  const response = await fetch(`${API_BASE_URL}/workloads/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Create workload (Admin only)
export const createWorkload = async (workloadData) => {
  const response = await fetch(`${API_BASE_URL}/workloads/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(workloadData),
  });
  return handleResponse(response);
};

// Get workload by ID
export const getWorkloadById = async (workloadId) => {
  const response = await fetch(`${API_BASE_URL}/workloads/${workloadId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Update workload (Admin only)
export const updateWorkload = async (workloadId, workloadData) => {
  const response = await fetch(`${API_BASE_URL}/workloads/${workloadId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(workloadData),
  });
  return handleResponse(response);
};

// Delete workload (Admin only)
export const deleteWorkload = async (workloadId) => {
  const response = await fetch(`${API_BASE_URL}/workloads/${workloadId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to delete workload: ${response.status}`);
  }
  return true;
};
