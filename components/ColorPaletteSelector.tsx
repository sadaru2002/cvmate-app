"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { availableColorPalettes } from "@/hooks/use-resume-builder"

interface ColorPaletteSelectorProps {
  currentColorPalette: string[];
  onSelectColorPalette: (colors: string[]) => void; // Changed to accept string[]
}

export function ColorPaletteSelector({
  currentColorPalette,
  onSelectColorPalette,
}: ColorPaletteSelectorProps) {
  // Determine the currently selected palette ID based on its colors
  const currentPaletteId = availableColorPalettes.find(
    (p) => JSON.stringify(p.colors) === JSON.stringify(currentColorPalette)
  )?.id || "default"; // Fallback to 'default' if not found

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
      {availableColorPalettes.map((palette) => (
        <div
          key={palette.id}
          className={cn(
            "relative border-2 rounded-lg cursor-pointer transition-all duration-200 p-2",
            currentPaletteId === palette.id ? "border-cyan-400 ring-2 ring-cyan-400" : "border-white/20 hover:border-white/40"
          )}
          onClick={() => onSelectColorPalette(palette.colors)} // Pass palette.colors directly
        >
          <div className="flex h-12 rounded-md overflow-hidden mb-2">
            {palette.colors.map((color, index) => (
              <div key={index} className="flex-1 h-full" style={{ backgroundColor: color }}></div>
            ))}
          </div>
          <p className="text-white text-sm text-center">{palette.name}</p>
          {currentPaletteId === palette.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyan-400/20 rounded-lg">
              <Check className="w-8 h-8 text-cyan-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}