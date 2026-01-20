"use client";

import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard'); // Redirect if already logged in
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]"><p>Carregando...</p></div>; // Or a spinner
  }
  
  if (isAuthenticated) { // Should be caught by useEffect, but as a fallback
    return <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]"><p>Redirecionando...</p></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] py-12">
      <LoginForm />
    </div>
  );
}
