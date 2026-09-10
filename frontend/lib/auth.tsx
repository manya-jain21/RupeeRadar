'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticatePersonnel, PersonnelUser } from './authConfig';

export type SafeUser = Omit<PersonnelUser, 'passwords'>;

interface AuthContextType {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (id: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'rupeeradar_auth_user';
const COOKIE_NAME = 'rupeeradar_session';

function setSessionCookie(user: SafeUser | null) {
  if (typeof document === 'undefined') return;
  if (user) {
    const value = encodeURIComponent(JSON.stringify(user));
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SafeUser;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(parsed);
        setSessionCookie(parsed);
      }
    } catch {
      // Fallback
    } finally {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, []);

  const login = async (id: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = authenticatePersonnel(id, pass);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        setSessionCookie(result.user);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: result.error || 'Authentication rejected.' };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Terminal error during authentication.' };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSessionCookie(null);
    } catch {
      // ignore
    }
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
