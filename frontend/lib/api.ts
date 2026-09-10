import { FALLBACK_COMPLAINTS } from './fallbackData';

// Use environment variable for production, fallback to localhost for development
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function fetchComplaints() {
  try {
    const res = await fetch(`${API_BASE}/complaints/?limit=100`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    // API is unreachable; silently use fallback telemetry
  }
  return { status: 'success', data: FALLBACK_COMPLAINTS };
}

export async function fetchPredictions() {
  try {
    const res = await fetch(`${API_BASE}/predictions/`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // API unreachable fallback
  }
  return { status: 'success', data: [] };
}

export async function fetchATMs() {
  try {
    const res = await fetch(`${API_BASE}/atms/`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // API unreachable fallback
  }
  return { status: 'success', data: [] };
}
