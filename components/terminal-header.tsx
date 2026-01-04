"use client"

import { useEffect, useState } from "react"
import { TypingText } from "./typing-text"

interface TerminalHeaderProps {
  isConnected: boolean
  onConnect: () => void
}

export function TerminalHeader({ isConnected, onConnect }: TerminalHeaderProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="terminal-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h1 className="text-sm md:text-base font-bold glow-pulse truncate">{">"} VAULT_4</h1>
          <TypingText text="// DECENTRALIZED PORTFOLIO SYSTEM" className="text-xs text-muted-foreground mt-1" />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:block font-mono">{currentTime}</span>
          <button onClick={onConnect} className="terminal-button px-3 py-1.5 text-xs">
            {isConnected ? "[ CONNECTED ]" : "[ CONNECT ]"}
          </button>
        </div>
      </div>

      {isConnected && (
        <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-2 text-xs">
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-muted-foreground truncate">0x7F4e...c3D9</span>
        </div>
      )}
    </header>
  )
}
