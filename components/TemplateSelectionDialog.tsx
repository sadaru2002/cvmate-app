"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Check, Palette } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { availableTemplates, availableColorPalettes } from "@/hooks/use-resume-builder" // Import availableTemplates and availableColorPalettes
import { ColorPaletteSelector } from "@/components/ColorPaletteSelector" // Import new ColorPaletteSelector

interface TemplateSelectionDialogProps {
  currentTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  currentColorPalette: string[]; // New prop for current color palette
  onColorPaletteSelect: (colors: string[]) => void; // Changed to accept string[]
  children: React.ReactNode; // The trigger element (e.g., a button)
}

export function TemplateSelectionDialog({
  currentTemplateId,
  onTemplateSelect,
  currentColorPalette,
  onColorPaletteSelect,
  children,
}: TemplateSelectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplateId);
  const [selectedColorPalette, setSelectedColorPalette] = useState(currentColorPalette);
  const [activeTab, setActiveTab] = useState("templates"); // State to manage active tab

  // Function to reset internal state when dialog opens
  const resetInternalState = useCallback(() => {
    setSelectedTemplateId(currentTemplateId);
    // When dialog opens, set selectedColorPalette to the *current* template's default colors
    // or the current resume's color palette if it's a custom one.
    const currentTemplateConfig = availableTemplates.find(t => t.id === currentTemplateId);
    if (currentTemplateConfig && JSON.stringify(currentTemplateConfig.colors) === JSON.stringify(currentColorPalette)) {
      setSelectedColorPalette(currentTemplateConfig.colors);
    } else {
      // If the current resume's palette is custom or doesn't match the template's default, use it.
      setSelectedColorPalette(currentColorPalette);
    }
    setActiveTab("templates"); // Always start on templates tab
  }, [currentTemplateId, currentColorPalette]);

  // Use onOpenChange to reset state when dialog opens
  useEffect(() => {
    if (open) {
      resetInternalState();
    }
  }, [open, resetInternalState]);


  // Handle template selection within the dialog
  const handleInternalTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const templateConfig = availableTemplates.find(t => t.id === templateId);
    if (templateConfig) {
      setSelectedColorPalette(templateConfig.colors); // Update color palette to template's default
    }
  };

  const handleSave = () => {
    onTemplateSelect(selectedTemplateId);
    onColorPaletteSelect(selectedColorPalette);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl glass-panel-high-contrast">
        <DialogHeader>
          <DialogTitle className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
            Change Theme
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Select a resume template or customize its color palette. Choose suitable options to best represent your professional brand.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md h-9"> {/* Removed p-[3px], added h-9 */}
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white hover:bg-white/10 px-4 text-sm font-medium transition-all first:rounded-l-md last:rounded-r-md data-[state=active]:relative data-[state=active]:z-10 border-r border-white/20" // Removed h-full, py-2, added relative z-10, border-r
            >
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="color-palettes"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white hover:bg-white/10 px-4 text-sm font-medium transition-all first:rounded-l-md last:rounded-r-md data-[state=active]:relative data-[state=active]:z-10 border-l border-white/20" // Removed h-full, py-2, added relative z-10, border-l
            >
              Color Palettes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-4">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">Available Templates</h3>
            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
              {availableTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "relative border-2 rounded-lg cursor-pointer transition-all duration-200",
                    selectedTemplateId === template.id ? "border-cyan-400 ring-2 ring-cyan-400" : "border-white/20 hover:border-white/40"
                  )}
                  onClick={() => handleInternalTemplateSelect(template.id)}
                >
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    width={150}
                    height={200}
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1.5 rounded-b-lg">
                    {template.name}
                  </p>
                  {selectedTemplateId === template.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cyan-400/20 rounded-lg">
                      <Check className="w-8 h-8 text-cyan-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="color-palettes" className="mt-4">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">Choose a Color Palette</h3>
            <ColorPaletteSelector
              currentColorPalette={selectedColorPalette}
              onSelectColorPalette={(colors) => {
                setSelectedColorPalette(colors);
              }}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-white border-white/20 hover:bg-white/10">
            Cancel
          </Button>
          <Button type="button" variant="gradient-glow" onClick={handleSave}>
            Apply Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}