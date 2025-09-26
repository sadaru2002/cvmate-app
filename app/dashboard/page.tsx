"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { ArrowRight, FileText, Trash2, Plus } from "lucide-react" // Added Plus icon
import Link from "next/link"
import { AuthGuard } from "@/components/AuthGuard"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateResumeDialog } from "@/components/CreateResumeDialog" // Import the new dialog
import api from "@/lib/axios" // Import the axios instance

// Define the type for a resume item, matching the IResume interface from lib/models/Resume.ts
interface ResumeItem {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  // Add other fields you might want to display, e.g., status, thumbnailLink
  // For now, we'll just use title and dates.
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      // The AuthGuard ensures the user is authenticated before this component renders.
      // The axios interceptor in lib/axios.ts will automatically add the Authorization header
      // if a token exists in localStorage (for email/password users).
      // For NextAuth.js (Google OAuth) users, the session cookie is automatically sent by the browser.
      const response = await api.get('/resumes');
      const data = response; // axios interceptor already returns response.data

      if (data.resumes) {
        setResumes(data.resumes);
      } else {
        setError(data.message || "Failed to fetch resumes.");
        toast.error(data.message || "Failed to fetch resumes.");
      }
    } catch (err: any) {
      console.error("Error fetching resumes:", err);
      setError(err.message || "An unexpected error occurred while fetching resumes.");
      toast.error(err.message || "An unexpected error occurred while fetching resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return;
    }

    try {
      // Rely on the axios interceptor for authentication
      await api.delete(`/resumes/${resumeId}`);
      toast.success("Resume deleted successfully!");
      fetchResumes(); // Refresh the list of resumes
    } catch (err: any) {
      console.error("Error deleting resume:", err);
      toast.error(err.message || "An unexpected error occurred while deleting the resume.");
    }
  };

  return (
    <AuthGuard>
      <div className="relative flex flex-col flex-1">
        <div className="p-6 lg:p-12 flex-1">
          <div className="relative z-10 flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold text-white glow-text">
              Your <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Dashboard</span>
            </h1>
            <Link href="/post-auth-landing" passHref>
              <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 transition-colors">
                Back to Home
              </Button>
            </Link>
          </div>

          <section className="relative z-10 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-8 glow-text">
              Your Resumes
            </h2>

            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <GlassCard key={i} className="p-6 flex flex-col justify-between animate-pulse">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-end gap-2 mt-4">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center text-red-400 py-10">
                <p className="mb-4">{error}</p>
                <Button onClick={fetchResumes} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add New Resume Card */}
                <CreateResumeDialog onResumeCreated={fetchResumes}>
                  <GlassCard className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-transform duration-200 min-h-[200px]">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white glow-text">Add New Resume</h3>
                  </GlassCard>
                </CreateResumeDialog>

                {resumes.map((resume) => (
                  <GlassCard key={resume._id} className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-semibold text-white">{resume.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-300 text-sm mb-4">Last Updated: <span className="font-medium text-purple-300">{new Date(resume.updatedAt).toLocaleDateString()}</span></p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Link href={`/resume-builder?id=${resume._id}`} passHref>
                        <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                          View / Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600/30 hover:bg-red-700/40 text-red-300 border-red-500/30"
                        onClick={() => handleDeleteResume(resume._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {!loading && !error && resumes.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                <p className="mb-4">You haven't created any resumes yet.</p>
                {/* The "Add New Resume" card now handles this, so this CTA is redundant */}
              </div>
            )}
          </section>
        </div>
      </div>
    </AuthGuard>
  )
}