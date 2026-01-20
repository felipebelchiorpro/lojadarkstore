"use client";

import type { User } from '@/types';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('darkstore-auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated && authData.user) {
          setUser(authData.user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('darkstore-auth');
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    let mockUser: User;

    if (email === 'contatofelipebelchior@gmail.com') {
      mockUser = {
        id: 'super-admin-01',
        email,
        name: 'Super Admin Felipe',
        role: 'super_admin'
      };
    } else {
      mockUser = {
        id: 'merchant01',
        email,
        name: 'Merchant Admin',
        role: 'admin'
      };
    }

    setUser(mockUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('darkstore-auth', JSON.stringify({ isAuthenticated: true, user: mockUser }));
    } catch (error) {
      console.error("Failed to save auth data to localStorage", error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('darkstore-auth');
    } catch (error) {
      console.error("Failed to remove auth data from localStorage", error);
    }
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
