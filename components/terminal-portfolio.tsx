"use client"

import { useAccount } from "wagmi"
import { TerminalHeader } from "./terminal-header"
import { AccountStats } from "./account-stats"
import { PnlChart } from "./pnl-chart"
import { PositionsTable } from "./positions-table"
import { ActionButtons } from "./action-buttons"
import { PerformanceMetrics } from "./performance-metrics"
import { CyclingTextPanel } from "./cycling-text-panel"
import { MatrixRain } from "./matrix-rain"
import { CornerDecorations } from "./corner-decorations"

export function TerminalPortfolio() {
  const { isConnected } = useAccount()

  return (
    <>
      <MatrixRain />
      <CornerDecorations />
      
      <main className="min-h-screen bg-background p-3 md:p-4 md:pb-10 max-w-2xl mx-auto relative z-10">
        <TerminalHeader />

        <div className="space-y-3 mt-4">
          {isConnected && <AccountStats isConnected={isConnected} />}
          {isConnected && <ActionButtons />}
          <PerformanceMetrics />
          <PnlChart />
          <CyclingTextPanel />
          <PositionsTable />
        </div>

        <footer className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="glow-text">[ Vault 4 - AI-driven fund-of-vaults ]</span>
            <span>v1.0.0_MAINNET</span>
          </div>
        </footer>
      </main>
    </>
  )
}
