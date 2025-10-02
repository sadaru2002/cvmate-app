"use client"

import React from "react"
import { Input as ShadcnInput } from "@/components/ui/input" // Using shadcn's Input as base
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string; // Ensure id is always provided for accessibility
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id} className="text-gray-300">{label}</Label>}
      <ShadcnInput
        id={id}
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        {...props}
      />
    </div>
  );
}