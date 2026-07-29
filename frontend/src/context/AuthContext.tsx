import { createContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  register: (userData: AuthFormData) => Promise<void>;
  login: (userData: AuthFormData) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  }, []);

  const register = async (userData: AuthFormData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data);
      setIsSuccess(true);
      setIsError(false);
      setMessage('');
    } catch (error: unknown) {
      setIsError(true);
      setIsSuccess(false);
      setMessage(getErrorMessage(error));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: AuthFormData) => {
    setIsLoading(true);
    try {
      const data = await authService.login(userData);
      setUser(data);
      setIsSuccess(true);
      setIsError(false);
      setMessage('');
    } catch (error: unknown) {
      setIsError(true);
      setIsSuccess(false);
      setMessage(getErrorMessage(error));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsSuccess(false);
    setIsError(false);
    setMessage('');
  };

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setMessage('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        isSuccess,
        message,
        register,
        login,
        logout,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
