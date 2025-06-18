"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => void; // Simplified login
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // To handle initial check
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status from localStorage
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
    // Simulate successful login
    const mockUser: User = { id: 'merchant01', email, name: 'Merchant Admin' };
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
