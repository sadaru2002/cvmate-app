"use client"

import React from "react"
import Image from "next/image" // Import Image component
import {
  Palette,
  Save,
  Trash2,
  FileText,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { TitleInput } from "@/components/resume-builder/TitleInput"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useResumeContext } from "@/contexts/ResumeContext" // Import useResumeContext
import { TemplateSelectionDialog } from "@/components/TemplateSelectionDialog" // Import the new dialog

export function ResumeBuilderHeader() {
  const {
    resumeData,
    updateResumeSection,
    handleDeleteResume,
    isLoading,
    handleSaveResume,
    handlePreviewAndDownload,
    handleTemplateSelect,
    handleColorPaletteSelect, // New handler
    availableTemplates,
    availableColorPalettes, // New available palettes
  } = useResumeContext(); // Use context instead of direct hook call

  const selectedTemplate = availableTemplates.find(t => t.id === resumeData.template);

  return (
    <GlassCard className="sticky top-0 z-20 mb-8 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none sm:rounded-b-lg border-b border-white/20">
      <div className="flex flex-col items-center sm:items-start gap-2">
        <TitleInput
          title={resumeData.title}
          setTitle={(value) => updateResumeSection("title", value)}
        />
        <p className="text-xs text-gray-400 mt-1 hidden md:block">
          💡 Tip: Always aim to keep your resume to one page for best results!
        </p>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        <TemplateSelectionDialog
          currentTemplateId={resumeData.template || "TemplateOne"} // Pass current template
          onTemplateSelect={handleTemplateSelect} // Pass the context handler
          currentColorPalette={resumeData.colorPalette || availableColorPalettes[0].colors} // Pass current color palette
          onColorPaletteSelect={handleColorPaletteSelect} // Pass the new context handler
        >
          <Button
            variant="gradient-glow" // Changed to gradient-glow variant
            className="relative"
          >
            <Palette className="w-4 h-4 mr-2" />
            Change Theme
          </Button>
        </TemplateSelectionDialog>
        <Button
          variant="gradient-glow-destructive" // Changed to the new destructive gradient variant
          onClick={handleDeleteResume}
          disabled={isLoading || !resumeData._id}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
        <Button
          variant="gradient-glow"
          onClick={() => handleSaveResume(false)}
          disabled={isLoading}
        >
          <Save className="w-4 h-4 mr-2" /> {isLoading ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="gradient-glow"
          onClick={handlePreviewAndDownload}
        >
          <FileText className="w-4 h-4 mr-2" /> Preview & Download
        </Button>
      </div>
    </GlassCard>
  );
}