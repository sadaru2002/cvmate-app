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

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please log in.");
        router.push("/auth"); // Redirect to login page after successful signup
      } else {
        // Display the more detailed error message if available
        toast.error(data.error || data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      // Use NextAuth.js signIn for Google
      await signIn('google', { callbackUrl: '/post-auth-landing' });
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Failed to sign up with Google.");
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
        <p className="text-gray-300 text-lg mb-8">Create your account</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="sr-only">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
              placeholder="Create a password"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button variant="gradient-glow" className="w-full" onClick={handleSignup} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </div>

        {/* Separator line */}
        <div className="relative h-px bg-white/20 my-6" />
        
        {/* "OR" text below separator */}
        <p className="text-gray-500 text-sm -mt-4 mb-8">OR</p> {/* Adjusted margins */}

        <div className="flex justify-center">
          <GoogleSignInButton onClick={handleGoogleSignup} disabled={loading} />
        </div>

        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/auth" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}