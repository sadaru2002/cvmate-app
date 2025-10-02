"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const cvImages = [
  {
    id: 1,
    src: "/images/cv-michael-harris.jpg",
    alt: "Michael Harris - Digital Marketing Resume",
    title: "Digital Marketing Specialist",
  },
  {
    id: 2,
    src: "/images/cv-financial-analyst.jpg",
    alt: "Financial Analyst Resume",
    title: "Financial Analyst",
  },
  {
    id: 3,
    src: "/images/cv-dana-scully.jpg",
    alt: "Dana Scully - ATS Format Specialist Resume",
    title: "ATS Format Specialist",
  },
]

export function CVCarousel3D() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cvImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cvImages.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cvImages.length) % cvImages.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      {/* Main Carousel Container */}
      <div className="relative h-[600px] md:h-[700px] overflow-hidden rounded-2xl">
        {/* CV Images */}
        <div className="relative w-full h-full perspective-1000">
          {cvImages.map((cv, index) => {
            const isActive = index === currentIndex
            const isPrev = index === (currentIndex - 1 + cvImages.length) % cvImages.length
            const isNext = index === (currentIndex + 1) % cvImages.length

            let transformClass = "translate-x-full opacity-0 scale-75 rotate-y-45"
            let zIndex = 1

            if (isActive) {
              transformClass = "translate-x-0 opacity-100 scale-100 rotate-y-0"
              zIndex = 10
            } else if (isPrev) {
              transformClass = "-translate-x-1/2 opacity-60 scale-90 -rotate-y-25"
              zIndex = 5
            } else if (isNext) {
              transformClass = "translate-x-1/2 opacity-60 scale-90 rotate-y-25"
              zIndex = 5
            }

            return (
              <div
                key={cv.id}
                className={`absolute inset-0 transition-all duration-700 ease-out transform-gpu ${transformClass} cv-3d-card`}
                style={{ zIndex }}
              >
                <div className="relative w-full h-full group cursor-pointer" onClick={() => goToSlide(index)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl blur-xl transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-500 group-hover:scale-105">
                    <img
                      src={cv.src || "/placeholder.svg"}
                      alt={cv.alt}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-102"
                    />

                    {/* Overlay with title */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                      <h3 className="text-white text-xl font-semibold mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {cv.title}
                      </h3>
                    </div>

                    {/* Rainbow border effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rainbow-border-3d" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-3">
        {cvImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gradient-to-r from-cyan-400 to-purple-400 scale-125 shadow-lg shadow-cyan-400/50"
                : "bg-white/30 hover:bg-white/50 hover:scale-110"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center mt-4">
        <button
          className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
            isAutoPlaying
              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/50"
              : "bg-white/10 text-gray-400 border border-white/20 hover:bg-white/20"
          }`}
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          {isAutoPlaying ? "Auto-playing" : "Click to auto-play"}
        </button>
      </div>
    </div>
  )
}
