// Light API wrapper — all fetch calls go through here.
// BASE_URL proxied via Vite to http://localhost:3001
 
const BASE = '/api';
 
async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
 
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
 
  return res.json();
}
 
export const api = {
  // Campaigns
  getCampaigns: () => request('GET', '/campaigns'),
  createCampaign: (data) => request('POST', '/campaigns', data),
 
  // Entities
  listEntities: (campaign, type) => request('GET', `/${campaign}/${type}`),
  getEntity: (campaign, type, slug) => request('GET', `/${campaign}/${type}/${slug}`),
  createEntity: (campaign, type, data) => request('POST', `/${campaign}/${type}`, data),
  updateEntity: (campaign, type, slug, data) => request('PUT', `/${campaign}/${type}/${slug}`, data),
  deleteEntity: (campaign, type, slug) => request('DELETE', `/${campaign}/${type}/${slug}`),
  // Search
  search: (campaign, q) => request('GET', `/${campaign}/search?q=${encodeURIComponent(q)}`),
};
