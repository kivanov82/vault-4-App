"use client"

import { useEffect, useState } from "react"
import { TypingText } from "./typing-text"

interface TerminalHeaderProps {
  isConnected: boolean
  onConnect: () => void
}

const LAUNCH_DATE = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

export function TerminalHeader({ isConnected, onConnect }: TerminalHeaderProps) {
  const [timeSinceLaunch, setTimeSinceLaunch] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const diff = now.getTime() - LAUNCH_DATE.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeSinceLaunch(
        `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
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
          <TypingText text="// HYPERLIQUID AI-TRADING AGENT" className="text-xs text-muted-foreground mt-1" />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-xs text-muted-foreground hidden sm:flex flex-col items-end font-mono">
            <span className="text-[10px] opacity-60">UPTIME</span>
            <span className="text-primary">{timeSinceLaunch}</span>
          </div>
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
