"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react'; // Import useSession

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession(); // Get NextAuth session status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null for initial loading

  useEffect(() => {
    const checkAuth = async () => {
      // If NextAuth session is loading, wait
      if (sessionStatus === 'loading') {
        setIsAuthenticated(null); // Still loading
        return;
      }

      // If NextAuth session exists, user is authenticated
      if (sessionStatus === 'authenticated') {
        setIsAuthenticated(true);
        return;
      }

      // If NextAuth session is unauthenticated, check local storage token for email/password users
      if (sessionStatus === 'unauthenticated') {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("You need to be logged in to access this page.");
          router.push('/auth');
          setIsAuthenticated(false);
          return;
        }

        try {
          // Verify the local token with your backend API
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (response.ok && data.valid) {
            // Store user info from verification if not already in session
            localStorage.setItem('user', JSON.stringify(data.user));
            setIsAuthenticated(true);
          } else {
            // Token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error("Session expired or invalid. Please log in again.");
            router.push('/auth');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error("An error occurred during authentication. Please log in again.");
          router.push('/auth');
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, [router, pathname, sessionStatus]); // Re-run checkAuth if pathname or sessionStatus changes

  if (isAuthenticated === null) {
    // Show a loading spinner or skeleton while checking authentication
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <Skeleton className="h-32 w-32 rounded-full animate-pulse" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null; // Render children only if authenticated
}