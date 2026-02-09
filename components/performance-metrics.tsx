"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { BlinkingLabel } from "./blinking-label"

type MetricsResponse = {
  tvlUsd: number | null
  tvlChange30dUsd: number | null
  pnlChange30dPct: number | null
  winRatePct: number | null
  maxDrawdownPct: number | null
}

const API_BASE = process.env.NEXT_PUBLIC_VAULT_API_BASE_URL ?? "http://localhost:3000"

function useCountUp(target: number | null, duration = 1200) {
  const [value, setValue] = useState<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (target === null) { setValue(null); return }
    const start = performance.now()
    const from = 0
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (target - from) * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

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
    return () => { active = false }
  }, [])

  const tvl = useCountUp(metrics?.tvlUsd ?? null)
  const pnl30d = useCountUp(metrics?.pnlChange30dPct ?? null)
  const drawdown = useCountUp(metrics?.maxDrawdownPct ?? null)
  const winRate = useCountUp(metrics?.winRatePct ?? null)

  const items = [
    {
      label: "30D_TVL",
      value: formatUsd(tvl),
      change: metrics?.tvlChange30dUsd != null ? formatUsdSigned(metrics.tvlChange30dUsd) : null,
      changeValue: metrics?.tvlChange30dUsd ?? null,
      negative: false,
    },
    {
      label: "30D_PNL",
      value: formatPercentSigned(pnl30d),
      change: null,
      changeValue: null,
      negative: (metrics?.pnlChange30dPct ?? 0) < 0,
    },
    {
      label: "30D_MAX_DRAWDOWN",
      value: formatPercentSigned(drawdown),
      change: null,
      changeValue: null,
      negative: true,
    },
    {
      label: "WIN_RATE",
      value: formatPercent(winRate),
      change: null,
      changeValue: null,
      negative: false,
    },
  ]

  return (
    <div className="terminal-border p-3">
      <BlinkingLabel text="PERFORMANCE_METRICS" prefix="$" color="cyan" />

      <div className="grid grid-cols-2 gap-2 mt-3">
        {items.map((metric) => (
          <div
            key={metric.label}
            className={`terminal-border-inset p-2 metric-card ${metric.negative ? "metric-card-negative" : ""}`}
          >
            <span className="text-[10px] text-[color:var(--terminal-cyan-dim)] block truncate">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-semibold text-primary">
                {metric.value ?? (loading ? "..." : "--")}
              </span>
              {metric.change && (
                <span className={`text-xs ${formatSignedClass(metric.changeValue)}`}>
                  {metric.change}
                </span>
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
  return value >= 0 ? "text-[color:var(--terminal-green)] font-medium" : "text-destructive font-medium"
}
