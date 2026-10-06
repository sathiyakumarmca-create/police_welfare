const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function registerMember(memberData) {
  try {
    const response = await fetch(`${API_BASE_URL}/members/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    const data = await response.json();
    if (!response.ok) {
      let message = 'Registration failed. Please check your inputs.';
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to fetch members.');
    }
    return data.data || [];
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
    if (!response.ok) return { mobile_exists: false, aadhaar_exists: false };
    return await response.json();
  } catch (err) {
    return { mobile_exists: false, aadhaar_exists: false };
  }
}
