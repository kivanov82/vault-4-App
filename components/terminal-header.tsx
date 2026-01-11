"use client"

import { useEffect, useState } from "react"
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { TypingText } from "./typing-text"
import { hyperliquidChain } from "@/lib/wagmi"
import { LAUNCH_DATE_ISO } from "@/lib/constants"

const LAUNCH_DATE = new Date(LAUNCH_DATE_ISO)

export function TerminalHeader() {
  const [timeSinceLaunch, setTimeSinceLaunch] = useState("")
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const betaTooltip =
    "The platform is in beta mode; deposits will be enabled once the model is proven."
  const isWrongChain = isConnected && chainId !== hyperliquidChain.id
  const labelText = "// Vault 4 - AI-driven fund-of-vaults on Hyperliquid"

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
          <h1 className="text-sm md:text-base font-bold glow-pulse truncate">{">"} Vault 4</h1>
          <TypingText text={labelText} className="text-xs text-muted-foreground mt-1" />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-xs text-muted-foreground hidden sm:flex flex-col items-end font-mono">
            <span className="text-[10px] opacity-60">UPTIME</span>
            <span className="text-primary">{timeSinceLaunch}</span>
          </div>
          {isWrongChain && (
            <button
              onClick={() => switchChain({ chainId: hyperliquidChain.id })}
              disabled={isSwitching}
              className="terminal-button px-3 py-1.5 text-xs"
            >
              {isSwitching ? "[ SWITCHING ]" : "[ SWITCH ]"}
            </button>
          )}
          <div className="relative flex flex-col items-center group">
            <button
              onClick={() => {
                if (isConnected) {
                  disconnect()
                  return
                }
                const connector = connectors[0]
                if (connector) {
                  connect({ connector })
                }
              }}
              disabled={!isConnected}
              className={`terminal-button px-3 py-1.5 text-xs ${!isConnected ? "cursor-not-allowed" : ""}`}
            >
              {isConnected ? "[ DISCONNECT ]" : "[ CONNECT ]"}
            </button>
            {!isConnected && (
              <span className="mt-1 px-2 py-1 text-[10px] uppercase tracking-[0.2em] font-mono bg-black/90 border border-[color:var(--terminal-green-bright)] text-primary rounded-sm shadow-[0_0_12px_rgba(39,250,218,0.45)] absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none opacity-0 translate-y-1 transition duration-150 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                The platform is in beta; deposits enable once the model proves itself.
              </span>
            )}
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-2 text-xs">
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className={isWrongChain ? "text-destructive" : "text-primary"}>HYPERLIQUID</span>
          <span className="text-muted-foreground truncate">{formatAddress(address)}</span>
        </div>
      )}
    </header>
  )
}

function formatAddress(address?: string) {
  if (!address) return "0x"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
