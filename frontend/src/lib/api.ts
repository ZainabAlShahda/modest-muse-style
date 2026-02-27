import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Axios instance (client-side)
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Server-side / RSC-safe axios instance (no interceptors)
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// SWR fetcher
export const apiClient = async (url: string, options?: { method?: string; data?: unknown }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mms_token') : null;
  const res = await axios({
    url: `${BASE_URL}${url}`,
    method: options?.method || 'GET',
    data: options?.data,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};
