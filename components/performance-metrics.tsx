"use client"

import { useEffect, useState } from "react"
import { BlinkingLabel } from "./blinking-label"

type MetricsResponse = {
  tvlUsd: number | null
  tvlChange30dUsd: number | null
  pnlChange30dPct: number | null
  winRatePct: number | null
  maxDrawdownPct: number | null
}

const API_BASE = process.env.NEXT_PUBLIC_VAULT_API_BASE_URL ?? "http://localhost:3000"

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/metrics`)
        if (!response.ok) return
        const payload = (await response.json()) as MetricsResponse
        if (active) setMetrics(payload)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const items = [
    {
      label: "30D_TVL",
      value: formatUsd(metrics?.tvlUsd),
      change:
        metrics?.tvlChange30dUsd === null || metrics?.tvlChange30dUsd === undefined
          ? null
          : formatUsdSigned(metrics?.tvlChange30dUsd),
      changeValue:
        metrics?.tvlChange30dUsd === null || metrics?.tvlChange30dUsd === undefined
          ? null
          : metrics?.tvlChange30dUsd,
    },
    {
      label: "30D_PERFORMANCE",
      value: formatPercentSigned(metrics?.pnlChange30dPct),
      change: null,
      changeValue: null,
    },
    {
      label: "MAX_DRAWDOWN",
      value: formatPercentSigned(metrics?.maxDrawdownPct),
      change: null,
      changeValue: null,
    },
    {
      label: "WIN_RATE",
      value: formatPercent(metrics?.winRatePct),
      change: null,
      changeValue: null,
    },
  ]

  return (
    <div className="terminal-border p-3">
      <BlinkingLabel text="PERFORMANCE_METRICS" />

      <div className="grid grid-cols-2 gap-2 mt-3">
        {items.map((metric) => (
          <div key={metric.label} className="terminal-border p-2">
            <span className="text-xs text-muted-foreground block truncate">{metric.label}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-semibold text-primary">
                {metric.value ?? (loading ? "..." : "--")}
              </span>
              {metric.change && (
                <span className={`text-xs ${formatSignedClass(metric.changeValue)}`}>{metric.change}</span>
              )}
            </div>
          </div>
        ))}
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
  const prefix = value >= 0 ? "+" : "-"
  return `${prefix}$${Math.abs(value).toFixed(2)}`
}

function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "--"
  return `${value.toFixed(2)}%`
}

function formatPercentSigned(value?: number | null) {
  if (value === undefined || value === null) return "--"
  const prefix = value >= 0 ? "+" : "-"
  return `${prefix}${Math.abs(value).toFixed(2)}%`
}

function formatSignedClass(value?: number | null) {
  if (value === undefined || value === null) return "text-muted-foreground"
  return value >= 0 ? "text-[color:var(--terminal-green-bright)]" : "text-destructive"
}
