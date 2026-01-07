"use client"

import { useEffect, useState } from "react"
import { BlinkingLabel } from "./blinking-label"

type PositionEntry = {
  vaultAddress: string
  vaultName?: string
  sizePct: number | null
  amountUsd: number | null
  pnlUsd: number | null
  roePct: number | null
}

type PositionsResponse = {
  userAddress: string
  totalPositions: number
  totalCapitalUsd: number | null
  totalInvestedUsd: number | null
  netPnlUsd: number | null
  positions: PositionEntry[]
}

type HistoryEntry = {
  time: number
  type: "vaultDeposit" | "vaultWithdraw"
  vaultAddress: string
  vaultName?: string
  amountUsd: number | null
  realizedPnlUsd: number | null
}

type HistoryResponse = {
  userAddress: string
  total: number
  page: number
  pageSize: number
  totalPages: number
  entries: HistoryEntry[]
}

const API_BASE = process.env.NEXT_PUBLIC_VAULT_API_BASE_URL ?? "http://localhost:3000"

export function PositionsTable() {
  const [activeTab, setActiveTab] = useState<"positions" | "history">("positions")
  const [positionsData, setPositionsData] = useState<PositionsResponse | null>(null)
  const [historyData, setHistoryData] = useState<HistoryResponse | null>(null)
  const [loadingPositions, setLoadingPositions] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyPage, setHistoryPage] = useState(1)

  const tabs = [
    { id: "positions" as const, label: "POSITIONS" },
    { id: "history" as const, label: "HISTORY" },
  ]

  useEffect(() => {
    let active = true
    const loadPositions = async () => {
      setLoadingPositions(true)
      try {
        const positionsRes = await fetch(`${API_BASE}/api/positions`)
        if (positionsRes.ok) {
          const payload = (await positionsRes.json()) as PositionsResponse
          if (active) setPositionsData(payload)
        }
      } finally {
        if (active) setLoadingPositions(false)
      }
    }

    loadPositions()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    const loadHistory = async () => {
      setLoadingHistory(true)
      try {
        const historyRes = await fetch(`${API_BASE}/api/history?page=${historyPage}&pageSize=15`)
        if (historyRes.ok) {
          const payload = (await historyRes.json()) as HistoryResponse
          if (active) setHistoryData(payload)
        }
      } finally {
        if (active) setLoadingHistory(false)
      }
    }

    loadHistory()

    return () => {
      active = false
    }
  }, [historyPage])

  const positions = positionsData?.positions ?? []
  const history = historyData?.entries ?? []
  const netPnl = positionsData?.netPnlUsd ?? null
  const totalPositions = positionsData?.totalPositions ?? 0
  const totalHistoryPages = historyData?.totalPages ?? 1

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
        {activeTab === "positions" && (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-2">ASSET</th>
              <th className="text-right py-2 px-2">SIZE</th>
              <th className="text-right py-2 px-2 hidden sm:table-cell">AMOUNT</th>
              <th className="text-right py-2 px-2">PNL</th>
              <th className="text-right py-2 pl-2">ROE</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                <td className="py-2 pr-2 font-semibold text-primary">
                  {pos.vaultName ?? formatAddress(pos.vaultAddress)}
                </td>
                <td className="py-2 px-2 text-right text-primary">{formatPercent(pos.sizePct)}</td>
                <td className="py-2 px-2 text-right hidden sm:table-cell">{formatUsd(pos.amountUsd)}</td>
                <td className={`py-2 px-2 text-right ${formatSignedClass(pos.pnlUsd)}`}>
                  {formatUsdSigned(pos.pnlUsd)}
                </td>
                <td className={`py-2 pl-2 text-right ${formatSignedClass(pos.roePct)}`}>
                  {formatPercentSigned(pos.roePct)}
                </td>
              </tr>
            ))}
            {!positions.length && (
              <tr className="border-b border-border/30">
                <td className="py-3 text-center text-muted-foreground" colSpan={5}>
                  {loadingPositions ? "LOADING_POSITIONS..." : "NO_POSITIONS"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
        {activeTab === "history" && (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-2">TIME</th>
                <th className="text-left py-2 px-2">TYPE</th>
                <th className="text-left py-2 px-2">VAULT</th>
                <th className="text-right py-2 px-2">AMOUNT</th>
                <th className="text-right py-2 pl-2">REALIZED</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => (
                <tr key={`${entry.vaultAddress}-${entry.time}-${i}`} className="border-b border-border/30">
                  <td className="py-2 pr-2 text-muted-foreground">{formatDate(entry.time)}</td>
                  <td className="py-2 px-2 text-primary">
                    {entry.type === "vaultDeposit" ? "DEPOSIT" : "WITHDRAW"}
                  </td>
                  <td className="py-2 px-2 text-primary">
                    {entry.vaultName ?? formatAddress(entry.vaultAddress)}
                  </td>
                  <td className="py-2 px-2 text-right">{formatUsd(entry.amountUsd)}</td>
                  <td className={`py-2 pl-2 text-right ${formatRealizedClass(entry.realizedPnlUsd)}`}>
                    {formatUsdSigned(entry.realizedPnlUsd)}
                  </td>
                </tr>
              ))}
              {!history.length && (
                <tr className="border-b border-border/30">
                  <td className="py-3 text-center text-muted-foreground" colSpan={5}>
                    {loadingHistory ? "LOADING_HISTORY..." : "NO_HISTORY"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {activeTab === "history" && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            PAGE {historyPage} / {totalHistoryPages}
          </span>
          <div className="flex gap-2">
            <button
              className="terminal-button px-2 py-1 text-xs"
              disabled={historyPage <= 1}
              onClick={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
            >
              PREV
            </button>
            <button
              className="terminal-button px-2 py-1 text-xs"
              disabled={historyPage >= totalHistoryPages}
              onClick={() => setHistoryPage((prev) => Math.min(totalHistoryPages, prev + 1))}
            >
              NEXT
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
        <span>TOTAL_POSITIONS: {totalPositions}</span>
        <span className={formatSignedClass(netPnl)}>NET_PNL: {formatUsdSigned(netPnl)}</span>
      </div>
    </div>
  )
}

function formatUsd(value?: number | null) {
  if (value === undefined || value === null) return "--"
  return `$${value.toFixed(2)}`
}

function formatUsdSigned(value?: number | null) {
  if (value === undefined || value === null) return "--"
  const prefix = value >= 0 ? "+" : ""
  return `${prefix}$${Math.abs(value).toFixed(2)}`
}

function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "--"
  return `${value.toFixed(2)}%`
}

function formatPercentSigned(value?: number | null) {
  if (value === undefined || value === null) return "--"
  const prefix = value >= 0 ? "+" : ""
  return `${prefix}${Math.abs(value).toFixed(2)}%`
}

function formatSignedClass(value?: number | string | null) {
  const numeric = parseSignedNumber(value)
  if (numeric === null) return "text-muted-foreground"
  return numeric >= 0 ? "text-[color:var(--terminal-green-bright)]" : "text-destructive"
}

function formatRealizedClass(value?: number | string | null) {
  const numeric = parseSignedNumber(value)
  if (numeric === null) return "text-muted-foreground"
  return numeric > 0
    ? "text-[color:var(--terminal-green-bright)]"
    : numeric < 0
      ? "text-destructive"
      : "text-muted-foreground"
}

function formatAddress(address: string) {
  if (!address) return "0x"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatDate(ms: number) {
  if (!Number.isFinite(ms)) return "--"
  const date = new Date(ms)
  return date.toISOString().slice(0, 10)
}

function parseSignedNumber(value?: number | string | null): number | null {
  if (value === undefined || value === null) return null
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  const cleaned = value.replace(/[^0-9.+-]/g, "")
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}
