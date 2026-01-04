"use client"

import { useEffect, useState, useCallback } from "react"

const MESSAGES = [
  "VAULT_4 is a decentralized perpetuals trading vault powered by autonomous AI strategies. Your funds are allocated across multiple markets to maximize risk-adjusted returns.",
  "WARNING: Trading cryptocurrencies involves substantial risk of loss. Past performance does not guarantee future results. Only deposit funds you can afford to lose.",
  "DISCLAIMER: This protocol is provided AS-IS without warranties. Smart contract interactions are irreversible. Verify all transactions before signing.",
  "RISK NOTICE: Leverage trading can result in liquidation. The vault may experience drawdowns during volatile market conditions. DYOR before depositing.",
]

interface CyclingTextPanelProps {
  className?: string
}

export function CyclingTextPanel({ className = "" }: CyclingTextPanelProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [phase, setPhase] = useState<"typing" | "pause" | "clear">("typing")
  const [charIndex, setCharIndex] = useState(0)

  const currentMessage = MESSAGES[messageIndex]

  const typeSpeed = 50
  const pauseDuration = 5000

  const skipToNext = useCallback(() => {
    setDisplayedText("")
    setCharIndex(0)
    setMessageIndex((prev) => (prev + 1) % MESSAGES.length)
    setPhase("typing")
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (phase === "typing") {
      if (charIndex < currentMessage.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, typeSpeed)
      } else {
        // Finished typing, go to pause
        setPhase("pause")
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => {
        setPhase("clear")
      }, pauseDuration)
    } else if (phase === "clear") {
      setDisplayedText("")
      setCharIndex(0)
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length)
      setPhase("typing")
    }

    return () => clearTimeout(timeout)
  }, [phase, charIndex, currentMessage])

  return (
    <div className={`terminal-border p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground">{">"}</span>
        <span className="text-xs text-primary font-semibold tracking-wider">SYSTEM_MESSAGE</span>
        <span className="flex-1 h-px bg-border" />
        <button
          onClick={skipToNext}
          className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          title="Next message"
        >
          [{String(messageIndex + 1).padStart(2, "0")}/{String(MESSAGES.length).padStart(2, "0")}]
        </button>
      </div>
      <div className="min-h-[4rem] md:min-h-[3rem]">
        <p className="text-xs text-primary leading-relaxed">
          {displayedText}
          <span
            className={`inline-block ml-0.5 ${phase === "pause" ? "animate-pulse" : ""}`}
            style={{ color: "#00ff41" }}
          >
            _
          </span>
        </p>
      </div>
    </div>
  )
}
