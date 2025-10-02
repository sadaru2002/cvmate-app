import { forwardRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  variant?: "default" | "high-contrast"
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = true, variant = "default", ...props }, ref) => {
    const baseClass = variant === "high-contrast" ? "glass-panel-high-contrast" : "glass-panel"
    return (
      <div ref={ref} className={cn(baseClass, className)} {...props}>
        {children}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"