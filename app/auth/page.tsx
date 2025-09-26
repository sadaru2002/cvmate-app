"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner" // Using sonner for simple toasts
import { GoogleSignInButton } from "@/components/GoogleSignInButton" // Import the new component
import { signIn } from 'next-auth/react'; // Import signIn from next-auth/react

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
        toast.success("Login successful!");
        router.push("/post-auth-landing");
      } else {
        toast.error(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Use NextAuth.js signIn for Google
      await signIn('google', { callbackUrl: '/post-auth-landing' });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <GlassCard className="relative z-10 w-full max-w-md p-8 space-y-6 text-center" hover={true}>
        <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text mb-4">
          CVMate
        </div>
        <p className="text-gray-300 text-lg mb-8">Welcome back! Sign in to your account</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email / Username
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email or username"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Link href="#" className="text-sm text-cyan-400 hover:underline mt-2 block text-right">
              Forgot Password?
            </Link>
          </div>

          <Button variant="gradient-glow" className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        {/* Separator line */}
        <div className="relative h-px bg-white/20 my-6" />
        
        {/* "OR" text below separator */}
        <p className="text-gray-500 text-sm -mt-4 mb-8">OR</p> {/* Adjusted margins */}

        <div className="flex justify-center">
          <GoogleSignInButton onClick={handleGoogleLogin} disabled={loading} />
        </div>

        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}