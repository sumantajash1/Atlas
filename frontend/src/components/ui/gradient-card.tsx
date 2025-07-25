import type React from "react"

interface GradientCardProps {
  children: React.ReactNode
  className?: string
}

export function GradientCard({ children, className = "" }: GradientCardProps) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-b from-slate-600/10 to-slate-600/30 p-[1px] backdrop-blur-3xl ${className}`}
    >
      <div className="relative rounded-xl bg-slate-950 p-6">{children}</div>
    </div>
  )
}
