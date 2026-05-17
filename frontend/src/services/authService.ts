import { apiUrl } from './apiClient';

const API_URL = apiUrl('/auth');

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  token: string;
}

// Register user
export const register = async (userData: AuthFormData): Promise<AuthUser> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('user', JSON.stringify(data));
  } else {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

// Login user
export const login = async (userData: AuthFormData): Promise<AuthUser> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('user', JSON.stringify(data));
  } else {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

const authService = {
  register,
  login,
  logout,
  isAuthenticated,
};

export default authService;
