"use client"

import { useEffect, useState } from "react"
import { ParticleBackground } from "./particle-background"

export function ClientOnlyParticleBackground() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <ParticleBackground /> : null
}