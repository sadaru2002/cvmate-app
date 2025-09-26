"use client"

import { LandingPageContent } from "@/components/layout/LandingPageContent"
import { AuthGuard } from "@/components/AuthGuard" // Import AuthGuard

export default function PostAuthLandingPage() {
  return (
    <AuthGuard> {/* Wrap content with AuthGuard */}
      <LandingPageContent heroButtonLink="/dashboard" />
    </AuthGuard>
  );
}