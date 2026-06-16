export const API_BASE_URL = "http://localhost:3333/api";

export function getToken() {
  return localStorage.getItem("racingAngelsToken");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao chamar API.");
  }

  return data;
}

export async function login(username, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });

  localStorage.setItem("racingAngelsToken", data.token);
  localStorage.setItem("racingAngelsUser", JSON.stringify(data.user));

  return data;
}

export function getRaces(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return apiFetch(`/races${query ? `?${query}` : ""}`);
}

export function createRace(payload) {
  return apiFetch("/races", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteRace(id) {
  return apiFetch(`/races/${id}`, { method: "DELETE" });
}

export function getDrivers(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return apiFetch(`/drivers${query ? `?${query}` : ""}`);
}

export function updateDriver(id, payload) {
  return apiFetch(`/drivers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function getTracks(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return apiFetch(`/tracks${query ? `?${query}` : ""}`);
}

export function createTrack(payload) {
  return apiFetch("/tracks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getCars(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return apiFetch(`/cars${query ? `?${query}` : ""}`);
}

export function getProducts(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return apiFetch(`/products${query ? `?${query}` : ""}`);
}

export function createOrder(payload) {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getAnalytics() {
  return apiFetch("/analytics");
}

export function getDashboardSummary() {
  return apiFetch("/dashboard/summary");
}
