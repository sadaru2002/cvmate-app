"use client"

import { useEffect, useState } from "react"

export function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; duration: number; left: number }>>([])

  useEffect(() => {
    const particleArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      left: Math.random() * 100,
    }))
    setParticles(particleArray)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-cyan-400/30 rotate-45 floating-element" />
      <div
        className="absolute top-40 right-20 w-16 h-16 border border-purple-400/30 rounded-full floating-element"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-40 left-20 w-12 h-12 border border-pink-400/30 floating-element"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute bottom-20 right-40 w-24 h-24 border border-blue-400/30 rotate-12 floating-element"
        style={{ animationDelay: "1s" }}
      />
    </div>
  )
}
