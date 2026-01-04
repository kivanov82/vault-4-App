"use client"

import { useState } from "react"
import { BlinkingLabel } from "./blinking-label"

interface AccountStatsProps {
  isConnected: boolean
}

export function AccountStats({ isConnected }: AccountStatsProps) {
  const [viewMode, setViewMode] = useState<"account" | "pnl">("account")

  const stats = isConnected
    ? {
        totalEquity: "$12,847.32",
        perpsEquity: "$8,234.56",
        spotEquity: "$4,612.76",
        pnl: "+$1,284.73",
        pnlPercent: "+11.12%",
        totalPnl: "+$3,847.91",
        dailyPnl: "+$284.12",
        weeklyPnl: "+$1,124.56",
      }
    : {
        totalEquity: "$0.00",
        perpsEquity: "$0.00",
        spotEquity: "$0.00",
        pnl: "$0.00",
        pnlPercent: "0.00%",
        totalPnl: "$0.00",
        dailyPnl: "$0.00",
        weeklyPnl: "$0.00",
      }

  return (
    <div className="terminal-border p-3">
      <div className="flex items-center justify-between mb-2">
        <BlinkingLabel text={viewMode === "account" ? "ACCOUNT_VALUE" : "PNL_OVERVIEW"} />
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setViewMode("account")}
            className={`px-2 py-1 border ${
              viewMode === "account"
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/50"
            } transition-all`}
          >
            ACC
          </button>
          <button
            onClick={() => setViewMode("pnl")}
            className={`px-2 py-1 border ${
              viewMode === "pnl"
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/50"
            } transition-all`}
          >
            PNL
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {viewMode === "account" ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-bold glow-text">{stats.totalEquity}</span>
              <span className={`text-sm ${isConnected ? "text-primary" : "text-muted-foreground"}`}>
                {stats.pnl} ({stats.pnlPercent})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="terminal-border p-2">
                <span className="text-muted-foreground block">PERPS_EQUITY</span>
                <span className="text-primary font-semibold">{stats.perpsEquity}</span>
              </div>
              <div className="terminal-border p-2">
                <span className="text-muted-foreground block">SPOT_EQUITY</span>
                <span className="text-primary font-semibold">{stats.spotEquity}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-bold glow-text">{stats.totalPnl}</span>
              <span className={`text-sm ${isConnected ? "text-primary" : "text-muted-foreground"}`}>ALL_TIME</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="terminal-border p-2">
                <span className="text-muted-foreground block">24H_PNL</span>
                <span className="text-primary font-semibold">{stats.dailyPnl}</span>
              </div>
              <div className="terminal-border p-2">
                <span className="text-muted-foreground block">7D_PNL</span>
                <span className="text-primary font-semibold">{stats.weeklyPnl}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
