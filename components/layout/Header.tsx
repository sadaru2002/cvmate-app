"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User, LayoutDashboard } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfileDialog } from "@/components/UserProfileDialog"
import React, { useState, useEffect } from "react"
import { toast } from "sonner" // Using sonner for simple toasts
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string; // Changed from 'image' to 'profileImageUrl' for consistency with existing code
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession(); // Get NextAuth session
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (sessionStatus === 'loading') {
        setLoadingUser(true);
        return;
      }

      if (sessionStatus === 'authenticated' && session?.user) {
        // User authenticated via NextAuth (e.g., Google)
        setCurrentUser({
          id: session.user.id as string, // NextAuth user.id is available in session callback
          name: session.user.name || 'User',
          email: session.user.email || '',
          profileImageUrl: session.user.image || undefined,
        });
        setLoadingUser(false);
        return;
      }

      // If NextAuth session is unauthenticated, check local storage for email/password user
      if (sessionStatus === 'unauthenticated') {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            // Verify token with your backend API
            const response = await fetch('/api/auth/verify', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            const data = await response.json();
            if (response.ok && data.valid) {
              setCurrentUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                profileImageUrl: data.user.profileImageUrl,
              });
              localStorage.setItem('user', JSON.stringify(data.user)); // Update local storage with verified user
            } else {
              // Token invalid or expired
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setCurrentUser(null);
            }
          } catch (error) {
            console.error("Error verifying token:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null); // No token or stored user
        }
      }
      setLoadingUser(false);
    };

    fetchUserProfile();
  }, [session, sessionStatus]); // Depend on session and sessionStatus

  const handleProfileSave = (data: { name: string; email: string; profileImageUrl?: string }) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...data });
    }
  };

  const handleLogout = async () => {
    // If user is logged in via NextAuth, use signOut
    if (sessionStatus === 'authenticated') {
      await signOut({ callbackUrl: '/auth' }); // Redirect to login page after logout
      toast.info("You have been logged out.");
    } else {
      // For email/password users, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      toast.info("You have been logged out.");
      router.push("/auth"); // Redirect to login page after logout
    }
  };

  const isAppVariant = pathname.startsWith("/dashboard") ||
                       pathname.startsWith("/optimize") ||
                       pathname.startsWith("/templates") ||
                       pathname.startsWith("/resume-builder") ||
                       pathname.startsWith("/preview-download") ||
                       pathname.startsWith("/post-auth-landing");

  const defaultNavItems = (
    <>
      <Link href="/auth" passHref>
        <Button variant="ghost" className={`text-white hover:text-cyan-400 transition-colors ${pathname === "/auth" ? "text-cyan-400 font-semibold" : ""}`}>
          Login
        </Button>
      </Link>
      <Link href="/signup" passHref>
        <Button variant="gradient-glow"> {/* Changed to gradient-glow variant */}
          Signup
        </Button>
      </Link>
    </>
  );

  const appNavItems = (
    <div className="flex items-center gap-4">
      <Link href="/dashboard" passHref>
        <Button variant="ghost" className={`text-white hover:text-cyan-400 transition-colors ${pathname === "/dashboard" ? "text-cyan-400 font-semibold" : ""}`}>
          <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
        </Button>
      </Link>
      {currentUser && (
        <UserProfileDialog initialData={currentUser} onSave={handleProfileSave}>
          <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors">
            <Avatar className="size-8 border-2 border-transparent group-hover:border-cyan-400 transition-colors">
              <AvatarImage src={currentUser.profileImageUrl} alt="User Avatar" />
              <AvatarFallback>{currentUser.name?.split(' ').map(n => n[0]).join('') || 'JD'}</AvatarFallback>
            </Avatar>
            <span className="text-white text-sm hidden md:block group-hover:text-cyan-400 transition-colors">
              {currentUser.name}
            </span>
          </Button>
        </UserProfileDialog>
      )}
      <Button variant="ghost" size="icon" className="text-white hover:text-cyan-400 transition-colors" onClick={handleLogout}>
        <LogOut className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-6 py-4 lg:px-12 bg-black/40 backdrop-blur-sm">
      <Link href="/" passHref>
        <div className="text-2xl font-bold text-cyan-400 glow-text cursor-pointer">CVMate</div>
      </Link>
      <nav className="flex items-center gap-4">
        {loadingUser ? (
          <div className="h-8 w-24 bg-white/10 rounded-md animate-pulse"></div> // Simple loading state
        ) : isAppVariant && currentUser ? appNavItems : defaultNavItems}
      </nav>
    </header>
  );
}