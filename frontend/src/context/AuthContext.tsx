'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/user';
import { axiosInstance } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      setUser(res.data.data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('mms_token');
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mms_token');
    if (savedToken) {
      setToken(savedToken);
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('mms_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mms_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
