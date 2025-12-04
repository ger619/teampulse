import { API_BASE_URL, getAuthHeaders } from "./config";

export async function fetchTeamFeedbacks({ is_anonymous } = {}) {
  const params = new URLSearchParams();
  if (typeof is_anonymous !== "undefined") {
    params.set("is_anonymous", String(is_anonymous));
  }
  const url = `${API_BASE_URL}/team-feedbacks/${params.toString() ? `?${params.toString()}` : ""}`;
  const headers = await getAuthHeaders();
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch team feedbacks: ${res.status}`);
  const data = await res.json();
  // Expect paginated response with results
  return Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
}

export async function createTeamFeedback({ message, is_anonymous = false }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/team-feedbacks/`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ message, is_anonymous }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create feedback: ${res.status}`);
  }
  return res.json();
}

export async function deleteTeamFeedback(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/team-feedbacks/${id}/`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to delete feedback: ${res.status}`);
  return true;
}
