export function saveCheckIn(data) {
  const existing = JSON.parse(localStorage.getItem("pulse_checkins")) || [];
  existing.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("pulse_checkins", JSON.stringify(existing));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("pulse_current_user"));
}
