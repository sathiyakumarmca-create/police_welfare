// Detect environment: use backend URL from env var, fallback to known Render URL, or localhost
const getApiBaseUrl = () => {
  // 1. If explicitly set via environment variable, use it
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (envUrl) {
    let url = envUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    url = url.replace(/\/+$/, '');
    if (!url.endsWith('/api')) url = `${url}/api`;
    return url;
  }

  // 2. Auto-detect: if running on Render, use Render backend URL
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://police-welfare-backend.onrender.com/api';
  }

  // 3. Local development fallback
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('Police Welfare API Base URL:', API_BASE_URL);

export async function registerMember(memberData) {
  try {
    const response = await fetch(`${API_BASE_URL}/members/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });

    // Handle empty response body
    const text = await response.text();
    let data = {};
    if (text) {
      try { data = JSON.parse(text); } catch (_) { /* ignore parse errors */ }
    }

    if (!response.ok) {
      let message = `Registration failed (HTTP ${response.status}).`;
      if (typeof data.detail === 'string') {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = data.detail.map(err => err.msg || JSON.stringify(err)).join(', ');
      } else if (data.detail && typeof data.detail === 'object') {
        message = data.detail.msg || JSON.stringify(data.detail);
      }
      throw new Error(message);
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Server returned an empty response. Please check backend logs.');
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export async function fetchMembers() {
  try {
    const response = await fetch(`${API_BASE_URL}/members`);
    const text = await response.text();
    if (!text) return [];
    const data = JSON.parse(text);
    return data.data || [];
  } catch (err) {
    console.error('API Fetch Members error:', err);
    return [];
  }
}

export async function checkDuplicates(mobile, aadhaar) {
  try {
    const params = new URLSearchParams();
    if (mobile) params.append('mobile', mobile);
    if (aadhaar) params.append('aadhaar', aadhaar);

    const response = await fetch(`${API_BASE_URL}/members/check-duplicate?${params.toString()}`);
    const text = await response.text();
    if (response.ok && text) {
      return JSON.parse(text);
    }
    return { mobile_exists: false, aadhaar_exists: false };
  } catch (err) {
    return { mobile_exists: false, aadhaar_exists: false };
  }
}
