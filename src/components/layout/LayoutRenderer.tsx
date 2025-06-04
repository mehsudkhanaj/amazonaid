
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebarLayout } from '@/components/layout/AppSidebarLayout';
import { FullPageLoader } from '@/components/layout/FullPageLoader';
import { useEffect } from 'react';

export function LayoutRenderer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isLoggedIn } = useAuth();

  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);
  const publicRoutes = [...authRoutes, '/']; // Add any other public routes like landing page if needed

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn && isAuthRoute) {
        router.push('/dashboard');
      } else if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        router.push('/login');
      }
    }
  }, [isLoggedIn, isAuthRoute, loading, pathname, router, publicRoutes]);


  if (loading) {
    return <FullPageLoader />;
  }

  if (isLoggedIn && isAuthRoute) {
     // Still show loader while redirecting to avoid flash of auth page
    return <FullPageLoader />;
  }

  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    // Still show loader while redirecting to login
    return <FullPageLoader />;
  }
  
  if (isAuthRoute || pathname === '/') { // For login, signup, and initial landing page
    return <>{children}</>;
  }

  // Authenticated routes
  return <AppSidebarLayout>{children}</AppSidebarLayout>;
}
