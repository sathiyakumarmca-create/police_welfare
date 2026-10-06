// Cleanly format API URL for Render deployment and local development.
const LOCAL_API_URL = 'http://localhost:8000/api';
const DEFAULT_RENDER_BACKEND_URL = 'https://police-welfare-backend.onrender.com/api';
let rawUrl = (import.meta.env.VITE_API_URL || '').trim();

if (!rawUrl) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  rawUrl = hostname.includes('render') ? DEFAULT_RENDER_BACKEND_URL : LOCAL_API_URL;
}

if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = `https://${rawUrl}`;
}

rawUrl = rawUrl.replace(/\/+$/, '');
if (!rawUrl.endsWith('/api')) {
  rawUrl = `${rawUrl}/api`;
}

const API_BASE_URL = rawUrl;

console.log("Police Welfare API Endpoint:", API_BASE_URL);

export async function registerMember(memberData) {
  try {
    const response = await fetch(`${API_BASE_URL}/members/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    const contentType = response.headers.get('content-type') || '';
    let data = {};
    if (contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      let message = `Registration failed (${response.status}).`;
      if (typeof data.detail === 'string') {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = data.detail.map(err => err.msg || JSON.stringify(err)).join(', ');
      } else if (data.detail && typeof data.detail === 'object') {
        message = data.detail.msg || JSON.stringify(data.detail);
      }
      throw new Error(message);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export async function fetchMembers() {
  try {
    const response = await fetch(`${API_BASE_URL}/members`);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return data.data || [];
    }
    return [];
  } catch (err) {
    console.error("API Fetch Members error:", err);
    return [];
  }
}

export async function checkDuplicates(mobile, aadhaar) {
  try {
    const params = new URLSearchParams();
    if (mobile) params.append('mobile', mobile);
    if (aadhaar) params.append('aadhaar', aadhaar);

    const response = await fetch(`${API_BASE_URL}/members/check-duplicate?${params.toString()}`);
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      return await response.json();
    }
    return { mobile_exists: false, aadhaar_exists: false };
  } catch (err) {
    return { mobile_exists: false, aadhaar_exists: false };
  }
}
