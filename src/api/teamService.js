import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

// List teams (public - for signup)
export const getPublicTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/public/teams/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

// List teams
export const getTeams = async (page = 1) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/teams/?page=${page}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

// Create team (Admin only)
export const createTeam = async (teamData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/teams/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(teamData),
  });
  return handleResponse(response);
};

// Get team by ID
export const getTeamById = async (teamId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

// Update team (Admin only)
export const updateTeam = async (teamId, teamData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(teamData),
  });
  return handleResponse(response);
};

// Delete team (Admin only)
export const deleteTeam = async (teamId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete team: ${response.status}`);
  }
  return true;
};

// Add member to team (Admin only)
export const addMemberToTeam = async (teamId, userId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/add-member/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: userId }),
  });
  return handleResponse(response);
};

// Remove member from team (Admin only)
export const removeMemberFromTeam = async (teamId, userId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/remove-member/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: userId }),
  });
  return handleResponse(response);
};
