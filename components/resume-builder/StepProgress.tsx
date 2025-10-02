"use client"

import React from 'react';
import { cn } from "@/lib/utils" // Keep cn for potential future use or if it's used elsewhere

interface StepProgressProps {
  progress: number;
}

export function StepProgress({ progress }: StepProgressProps) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
      <div
        className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}