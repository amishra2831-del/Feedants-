const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api/v1';
const USER_ID = 'demo-user-001';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'x-user-id': USER_ID, ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Request failed');
  return body;
}

export const api = {
  getCompetition: id => request(`/competitions/${id}`),
  register: id => request(`/competitions/${id}/register`, { method: 'POST' }),
  submit: (id, submissionUrl) => request(`/competitions/${id}/submission`, { method: 'POST', body: JSON.stringify({ submissionUrl }) })
};
