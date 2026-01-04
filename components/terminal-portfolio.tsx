"use client"

import { useState } from "react"
import { TerminalHeader } from "./terminal-header"
import { AccountStats } from "./account-stats"
import { PnlChart } from "./pnl-chart"
import { PositionsTable } from "./positions-table"
import { ActionButtons } from "./action-buttons"
import { PerformanceMetrics } from "./performance-metrics"
import { CyclingTextPanel } from "./cycling-text-panel"

export function TerminalPortfolio() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <main className="min-h-screen bg-background p-3 md:p-4 max-w-2xl mx-auto">
      <TerminalHeader isConnected={isConnected} onConnect={() => setIsConnected(!isConnected)} />

      <div className="space-y-3 mt-4">
        <AccountStats isConnected={isConnected} />
        <ActionButtons />
        <PerformanceMetrics />
        <PnlChart />
        <CyclingTextPanel />
        <PositionsTable />
      </div>

      <footer className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="glow-text">[ VAULT_4_ONLINE ]</span>
          <span>v1.0.0_MAINNET</span>
        </div>
      </footer>
    </main>
  )
}
