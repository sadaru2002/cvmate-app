"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/AuthGuard" // Import AuthGuard

// Placeholder data for resume templates
const resumeTemplates = [
  {
    id: "1",
    name: "John Doe",
    role: "Software Engineer",
    experience: "Senior Developer • Tech Corp • 2021-Present",
    description: "Clean and contemporary design",
    style: "Modern",
    popularity: "High",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Marketing Manager",
    professionalSummary: "Experienced marketing professional...",
    description: "Traditional and professional",
    style: "Classic",
    popularity: "Medium",
  },
  {
    id: "3",
    name: "Alex Chen",
    role: "UX Designer",
    skills: ["Figma", "React"],
    description: "Perfect for creative roles",
    style: "Creative",
    popularity: "High",
  },
  {
    id: "4",
    name: "Sam Wilson",
    role: "Data Scientist",
    experience: "Data Analyst | StartupCo",
    description: "Simple and elegant design",
    style: "Minimal",
    popularity: "Medium",
  },
  {
    id: "5",
    name: "Emma Davis",
    role: "Product Manager",
    keyAchievements: ["Increased user engagement by 40%", "Led team of 8 developers"],
    description: "Emphasizes achievements",
    style: "Modern",
    popularity: "High",
  },
  {
    id: "6",
    name: "Michael Brown",
    role: "Financial Analyst",
    education: "MBA, Finance | Harvard Business School",
    description: "Traditional business format",
    style: "Classic",
    popularity: "Low",
  },
  {
    id: "7",
    name: "Lisa Garcia",
    role: "Graphic Designer",
    portfolio: "Brand identity for 20+ companies",
    description: "Modern creative layout",
    style: "Creative",
    popularity: "Medium",
  },
  {
    id: "8",
    name: "Ryan Kim",
    role: "Software Architect",
    experience: "Senior Engineer • Google • 2020-2023",
    description: "Clean with bold typography",
    style: "Minimal",
    popularity: "High",
  },
];

export default function TemplateSelectionPage() {
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [selectedPopularity, setSelectedPopularity] = useState("Popular");
  const router = useRouter();

  const filteredTemplates = resumeTemplates.filter((template) => {
    const styleMatch = selectedStyle === "All Styles" || template.style === selectedStyle;
    const popularityMatch = selectedPopularity === "Popular" || template.popularity === selectedPopularity;
    return styleMatch && popularityMatch;
  });

  const handleSelectTemplate = (templateId: string) => {
    // In a real app, you might pass the templateId to the resume builder page
    // For now, we'll just navigate to the resume builder page
    console.log(`Template ${templateId} selected!`);
    router.push("/resume-builder");
  };

  return (
    <AuthGuard> {/* Wrap content with AuthGuard */}
      <div className="relative flex flex-col flex-1">

        <main className="relative z-10 px-6 py-12 lg:px-12 flex-1">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white lg:text-5xl mb-4 leading-tight glow-text">
              Choose Your{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                Resume Template
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Select a professional, ATS-optimized design that fits your style and industry.
            </p>
          </div>

          {/* Filter/Sort Section */}
          <div className="flex justify-center gap-4 mb-12">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  {selectedStyle} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border">
                <DropdownMenuItem onClick={() => setSelectedStyle("All Styles")}>All Styles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStyle("Modern")}>Modern</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStyle("Classic")}>Classic</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStyle("Creative")}>Creative</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStyle("Minimal")}>Minimal</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  {selectedPopularity} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border">
                <DropdownMenuItem onClick={() => setSelectedPopularity("Popular")}>Popular</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPopularity("High")}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPopularity("Medium")}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPopularity("Low")}>Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredTemplates.map((template) => (
              <GlassCard key={template.id} className="p-6 flex flex-col justify-between text-left">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{template.role}</p>
                  {template.experience && <p className="text-gray-300 text-sm mb-2">Experience: {template.experience}</p>}
                  {template.professionalSummary && <p className="text-gray-300 text-sm mb-2">Professional Summary: {template.professionalSummary}</p>}
                  {template.skills && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {template.skills.map((skill, i) => (
                        <span key={i} className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {template.keyAchievements && (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-300 text-sm">Key Achievements:</h4>
                      <ul className="list-disc list-inside text-gray-400 text-sm">
                        {template.keyAchievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {template.education && <p className="text-gray-300 text-sm mb-2">Education: {template.education}</p>}
                  {template.portfolio && <p className="text-gray-300 text-sm mb-2">Portfolio: {template.portfolio}</p>}
                </div>
                <div className="mt-4">
                  <Button
                    variant="gradient-glow"
                    className="w-full"
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    Select Template
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}