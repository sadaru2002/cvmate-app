"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image" // Import Image component
import { useRouter } from "next/navigation" // Import useRouter
import { availableTemplates } from "@/hooks/use-resume-builder" // Import availableTemplates

// Map availableTemplates to the structure needed for the carousel
const carouselTemplates = availableTemplates.map((template) => ({
  id: template.id,
  name: template.name, // Template name
  // Use the first two colors for a gradient, ensuring Tailwind can parse arbitrary values
  colorGradient: `from-[${template.colors[0]}] to-[${template.colors[1]}]`,
  image: template.thumbnail,
}));

export function ModernCVCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const router = useRouter() // Initialize useRouter

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselTemplates.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselTemplates.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselTemplates.length) % carouselTemplates.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const handleViewTemplateClick = () => {
    setIsAutoPlaying(false); // Stop auto-play
    router.push("/dashboard"); // Navigate to dashboard
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 p-8">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          // This inline style is dynamic and necessary for carousel functionality.
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {carouselTemplates.map((template, index) => {
            const isActive = index === currentIndex
            // Determine transform classes for 3D effect
            let transformClass = "translate-x-full opacity-0 scale-75 rotate-y-45"
            let zIndex = 1

            if (isActive) {
              transformClass = "translate-x-0 opacity-100 scale-100 rotate-y-0"
              zIndex = 10
            } else if (index === (currentIndex - 1 + carouselTemplates.length) % carouselTemplates.length) { // isPrev
              transformClass = "-translate-x-1/2 opacity-60 scale-90 -rotate-y-25"
              zIndex = 5
            } else if (index === (currentIndex + 1) % carouselTemplates.length) { // isNext
              transformClass = "translate-x-1/2 opacity-60 scale-90 rotate-y-25"
              zIndex = 5
            } else {
              // For cards further away, move them out of view
              transformClass = "translate-x-full opacity-0 scale-75 rotate-y-45"
              zIndex = 1
            }

            return (
              <div key={template.id} className="flex-shrink-0 w-1/3 px-3">
                <div
                  className={`
                    relative group cursor-pointer transition-all duration-500 ease-out
                    transform hover:scale-105 hover:-translate-y-2 hover:rotate-1
                    ${isActive ? "scale-105 z-10" : "scale-95 opacity-80"}
                  `}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Resume Card */}
                  <div
                    className={`
                    relative rounded-xl overflow-hidden shadow-2xl
                    bg-gradient-to-br ${template.colorGradient} // Use template.colorGradient for background
                    transition-all duration-500 group-hover:shadow-3xl
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
                    h-[400px] flex items-center justify-center // Fixed height for the card container
                  `}
                  >
                    <Image
                      src={template.image}
                      alt={template.name}
                      width={250} // Fixed width for the image
                      height={350} // Fixed height for the image
                      className="object-contain w-full h-full p-4" // Image fills the container, maintains aspect ratio
                    />

                    {/* Hover Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
                      onClick={handleViewTemplateClick} // Add onClick handler here
                    >
                      <div className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        View Template
                      </div>
                    </div>
                  </div>

                  {/* 3D Shadow */}
                  <div
                    className={`
                    absolute inset-0 rounded-xl bg-gradient-to-br ${template.colorGradient} opacity-30 blur-xl
                    transform translate-y-4 -z-10 transition-all duration-500
                    group-hover:translate-y-6 group-hover:opacity-50
                  `}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous template" // Added aria-label
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next template" // Added aria-label
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {carouselTemplates.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to template ${index + 1}`} // Added aria-label
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${
                index === currentIndex
                  ? "bg-gradient-to-r from-cyan-400 to-purple-400 scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}