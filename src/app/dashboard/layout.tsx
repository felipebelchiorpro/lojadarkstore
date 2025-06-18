"use client";

import DashboardNav from '@/components/DashboardNav';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster'; // Assuming Toaster is in RootLayout, but can be here too if specific dashboard toasts are needed.

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    // Basic loading state, can be replaced with a more sophisticated spinner/skeleton
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-3 text-lg text-foreground">Carregando dashboard...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    // This will briefly show if redirection is slow, or if JS is disabled (though app relies on JS)
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <p className="text-lg text-foreground">Redirecionando para login...</p>
        </div>
    );
  }

  // If authenticated, render the dashboard layout
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DashboardNav />
      </div>
      
      {/* Mobile: Header would typically include a SheetTrigger for DashboardNav */}
      {/* For now, assuming header is global and DashboardNav primarily for desktop */}
      {/* Or, DashboardNav itself could be responsive / use a Sheet */}

      <div className="flex-1 flex flex-col">
        {/* Optional: Dashboard-specific header if different from main site header */}
        {/* <header className="bg-background border-b p-4 md:hidden">Mobile Dashboard Header / Menu Toggle</header> */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
      {/* <Toaster /> */} {/* If Toaster is not in RootLayout or for specific dashboard toasts */}
    </div>
  );
}
