"use client"

interface BlinkingLabelProps {
  text: string
  className?: string
}

export function BlinkingLabel({ text, className = "" }: BlinkingLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="inline-block w-2 h-2 bg-primary animate-pulse" />
      <span className="text-xs text-muted-foreground uppercase tracking-wider">
        {">"} {text}
      </span>
    </div>
  )
}
