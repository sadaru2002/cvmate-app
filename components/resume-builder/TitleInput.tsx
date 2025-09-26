"use client"

import React, { useState } from "react"
import { Check, Pencil } from "lucide-react" // Using Lucide icons

interface TitleInputProps {
  title: string;
  setTitle: (value: string) => void;
}

export function TitleInput({ title, setTitle }: TitleInputProps) {
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {showInput ? (
        <>
          <input
            type="text"
            placeholder="Resume title"
            className="text-sm md:text-[17px] bg-transparent outline-none text-cyan-400 placeholder:text-gray-400 focus:ring-0 focus:border-0"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            onBlur={() => setShowInput(false)} // Hide input on blur
            autoFocus // Focus input when it appears
          />
          <button
            type="button"
            className="cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
            onClick={() => setShowInput(false)}
          >
            <Check className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <h2 className="text-sm md:text-[17px] font-semibold text-white glow-text">{title || "Untitled Resume"}</h2>
          <button
            type="button"
            className="cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
            onClick={() => setShowInput(true)}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}