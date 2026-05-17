const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const defaultApiUrl = 'http://localhost:5000/api';

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || defaultApiUrl
);

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getStoredToken = () => {
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as { token?: string };
      if (user.token) return user.token;
    } catch {
      localStorage.removeItem('user');
    }
  }

  return localStorage.getItem('userToken') || localStorage.getItem('token');
};

export const authHeaders = (includeJson = true): HeadersInit => {
  const token = getStoredToken();

  return {
    ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userToken');
  localStorage.removeItem('token');
};
