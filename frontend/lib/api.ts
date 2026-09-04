// Use environment variable for production, fallback to localhost for development
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function fetchComplaints() {
  const res = await fetch(`${API_BASE}/complaints/?limit=100`);
  return res.json();
}

export async function fetchPredictions() {
  const res = await fetch(`${API_BASE}/predictions/`);
  return res.json();
}

export async function fetchATMs() {
  const res = await fetch(`${API_BASE}/atms/`);
  return res.json();
}
