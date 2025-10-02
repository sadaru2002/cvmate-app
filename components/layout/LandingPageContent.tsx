"use client"

import { Button } from "@/components/ui/button"
import { Edit, Settings, Download, Check } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { ModernCVCarousel } from "@/components/modern-cv-carousel"
import Link from "next/link"
import { LottieAnimation } from "@/components/LottieAnimation" // Import LottieAnimation
import resumeAnimationData from "@/public/animations/resume-animation.json" // Import animation data

interface LandingPageContentProps {
  heroButtonLink?: string;
}

export function LandingPageContent({ heroButtonLink = "/signup" }: LandingPageContentProps) {
  return (
    <div className="relative flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative z-10 px-6 text-center lg:px-12 flex-1 flex flex-col pt-20 pb-32"> {/* Adjusted padding here */}
        <h1 className="text-4xl font-bold text-white lg:text-6xl mb-6 leading-tight">
          Create Your{" "}
          <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
            ATS Ready
          </span>{" "}
          <br /> {/* Added line break here */}
          Resume with{" "}
          <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
            AI
          </span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          CVMate helps you build professional, keyword-optimized resumes that pass ATS filters and land interviews.
        </p>
        <Link href={heroButtonLink} passHref className="mt-auto">
          <Button variant="gradient-glow" className="mx-auto">
            Let's Build
          </Button>
        </Link>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12">
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-center mb-16 glow-text">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <GlassCard className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 floating-element">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4 glow-text">1. Enter Details</h3>
            <p className="text-gray-300">
              Input your work experience, skills, and education. Our intuitive interface makes it quick and easy.
            </p>
          </GlassCard>

          <GlassCard className="p-8 text-center">
            <div
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 floating-element"
              style={{ animationDelay: "2s" }}
            >
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4 glow-text">2. Optimize with AI</h3>
            <p className="text-gray-300">
              Our AI analyzes job descriptions and optimizes your resume with relevant keywords and formatting.
            </p>
          </GlassCard>

          <GlassCard className="p-8 text-center">
            <div
              className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 floating-element"
              style={{ animationDelay: "4s" }}
            >
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4 glow-text">3. Download PDF</h3>
            <p className="text-gray-300">
              Get your polished, ATS-ready resume in PDF format, ready to impress employers.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Professional Results Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-8 glow-text">
                Professional Results
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                See how CVMate transforms your information into stunning, ATS-optimized resumes that stand out to both
                algorithms and hiring managers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">ATS-friendly formatting</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">Keyword optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">Professional design</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <LottieAnimation
                animationData={resumeAnimationData}
                loop={true}
                autoplay={true}
                className="w-full h-full max-w-sm mx-auto" // Added styling for size
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resume Templates Section */}
      <section className="relative z-10 px-6 py-16 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-4 glow-text">
            Build your resume in minutes
          </h2>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates, each optimized for ATS systems and modern
            hiring practices.
          </p>
          <ModernCVCarousel />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 py-20 text-center lg:px-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Start building your{" "}
          <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
            resume
          </span>
          <br />
          with{" "}
          <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
            CVMate today
          </span>
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who have landed their dream jobs with AI-optimized resumes.
        </p>
        <Link href={heroButtonLink} passHref>
          <Button variant="gradient-glow" className="mx-auto">
            Let's Build
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 text-center border-t border-white/30 bg-black/40 backdrop-blur-sm lg:px-12">
        <div className="text-2xl font-bold text-cyan-400 mb-4 glow-text">CVMate</div>
        <p className="text-gray-400 text-sm">© 2024 CVMate. All rights reserved.</p>
      </footer>
    </div>
  );
}