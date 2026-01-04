"use client"

import { BlinkingLabel } from "./blinking-label"

export function PerformanceMetrics() {
  const metrics = [
    { label: "24H_VOLUME", value: "$47,832.00", change: "+12.4%" },
    { label: "WIN_RATE", value: "67.3%", change: "+2.1%" },
    { label: "MAX_DRAWDOWN", value: "-8.42%", change: null },
    { label: "SHARPE_RATIO", value: "2.14", change: "+0.3" },
  ]

  return (
    <div className="terminal-border p-3">
      <BlinkingLabel text="PERFORMANCE_METRICS" />

      <div className="grid grid-cols-2 gap-2 mt-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="terminal-border p-2">
            <span className="text-xs text-muted-foreground block truncate">{metric.label}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-semibold text-primary">{metric.value}</span>
              {metric.change && (
                <span className={`text-xs ${metric.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>
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
