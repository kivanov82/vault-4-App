"use client"

import { useState } from "react"
import { BlinkingLabel } from "./blinking-label"

export function PositionsTable() {
  const [activeTab, setActiveTab] = useState<"positions" | "orders" | "history">("positions")

  const positions = [
    { asset: "BTC-PERP", size: "+0.15", entry: "$43,250", pnl: "+$234.56", roe: "+5.42%" },
    { asset: "ETH-PERP", size: "-0.85", entry: "$2,340", pnl: "-$45.23", roe: "-2.27%" },
    { asset: "SOL-PERP", size: "+12.5", entry: "$98.45", pnl: "+$89.12", roe: "+7.23%" },
  ]

  const tabs = [
    { id: "positions" as const, label: "POSITIONS" },
    { id: "orders" as const, label: "ORDERS" },
    { id: "history" as const, label: "HISTORY" },
  ]

  return (
    <div className="terminal-border p-3">
      <div className="flex items-center justify-between mb-3">
        <BlinkingLabel text="TRADE_DATA" />
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 py-1 text-xs transition-all ${
                activeTab === tab.id
                  ? "terminal-button bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-2">ASSET</th>
              <th className="text-right py-2 px-2">SIZE</th>
              <th className="text-right py-2 px-2 hidden sm:table-cell">ENTRY</th>
              <th className="text-right py-2 px-2">PNL</th>
              <th className="text-right py-2 pl-2">ROE</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                <td className="py-2 pr-2 font-semibold text-primary">{pos.asset}</td>
                <td
                  className={`py-2 px-2 text-right ${pos.size.startsWith("+") ? "text-primary" : "text-destructive"}`}
                >
                  {pos.size}
                </td>
                <td className="py-2 px-2 text-right hidden sm:table-cell">{pos.entry}</td>
                <td className={`py-2 px-2 text-right ${pos.pnl.startsWith("+") ? "text-primary" : "text-destructive"}`}>
                  {pos.pnl}
                </td>
                <td className={`py-2 pl-2 text-right ${pos.roe.startsWith("+") ? "text-primary" : "text-destructive"}`}>
                  {pos.roe}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
        <span>TOTAL_POSITIONS: 3</span>
        <span className="text-primary">NET_PNL: +$278.45</span>
      </div>
    </div>
  )
}
