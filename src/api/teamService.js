import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

// List teams
export const getTeams = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/teams/?page=${page}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Create team (Admin only)
export const createTeam = async (teamData) => {
  const response = await fetch(`${API_BASE_URL}/teams/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(teamData),
  });
  return handleResponse(response);
};

// Get team by ID
export const getTeamById = async (teamId) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Update team (Admin only)
export const updateTeam = async (teamId, teamData) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(teamData),
  });
  return handleResponse(response);
};

// Delete team (Admin only)
export const deleteTeam = async (teamId) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to delete team: ${response.status}`);
  }
  return true;
};

// Add member to team (Admin only)
export const addMemberToTeam = async (teamId, userId) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/add-member/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }),
  });
  return handleResponse(response);
};

// Remove member from team (Admin only)
export const removeMemberFromTeam = async (teamId, userId) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/remove-member/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }),
  });
  return handleResponse(response);
};
