"use client"

import { useMemo, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { BlinkingLabel } from "./blinking-label"

function generatePnlData(days: number) {
  const points = []
  let value = 0
  for (let i = 0; i < days; i++) {
    value += (Math.random() - 0.45) * 500
    points.push({
      day: i + 1,
      value: Math.round(value),
      label: days <= 7 ? `D${i + 1}` : days <= 30 ? `${i + 1}` : `W${Math.floor(i / 7) + 1}`,
    })
  }
  return points
}

function generateAccValueData(days: number) {
  const points = []
  let value = 10000
  for (let i = 0; i < days; i++) {
    value += (Math.random() - 0.4) * 300
    value = Math.max(value, 8000)
    points.push({
      day: i + 1,
      value: Math.round(value),
      label: days <= 7 ? `D${i + 1}` : days <= 30 ? `${i + 1}` : `W${Math.floor(i / 7) + 1}`,
    })
  }
  return points
}

export function PnlChart() {
  const [chartMode, setChartMode] = useState<"PNL" | "ACC_VALUE">("PNL")
  const [timePeriod, setTimePeriod] = useState<"7D" | "30D" | "ALL">("30D")

  const days = timePeriod === "7D" ? 7 : timePeriod === "30D" ? 30 : 90

  const pnlData = useMemo(() => generatePnlData(days), [days])
  const accValueData = useMemo(() => generateAccValueData(days), [days])

  const data = chartMode === "PNL" ? pnlData : accValueData
  const minValue = Math.min(...data.map((d) => d.value))
  const maxValue = Math.max(...data.map((d) => d.value))

  const strokeColor = chartMode === "PNL" ? "#00ff41" : "#00d4ff"
  const gradientId = chartMode === "PNL" ? "pnlGradient" : "accGradient"

  return (
    <div className="terminal-border p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setChartMode("PNL")}
            className={`px-2 py-1 transition-all ${
              chartMode === "PNL"
                ? "terminal-button bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30"
            }`}
          >
            [PNL]
          </button>
          <span className="text-muted-foreground">/</span>
          <button
            onClick={() => setChartMode("ACC_VALUE")}
            className={`px-2 py-1 transition-all ${
              chartMode === "ACC_VALUE"
                ? "terminal-button bg-[#00d4ff] text-primary-foreground"
                : "text-muted-foreground hover:text-[#00d4ff] border border-transparent hover:border-[#00d4ff]/30"
            }`}
          >
            [ACC_VALUE]
          </button>
        </div>
        <div className="flex gap-2 text-xs">
          {(["7D", "30D", "ALL"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-2 py-1 transition-all ${
                timePeriod === period
                  ? "terminal-button bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <BlinkingLabel text={chartMode === "PNL" ? "PNL_CHART" : "ACCOUNT_VALUE_CHART"} />
      </div>

      <div className="h-40 md:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: strokeColor, fontSize: 10 }}
              axisLine={{ stroke: `${strokeColor}40` }}
              tickLine={{ stroke: `${strokeColor}40` }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minValue * 0.95, maxValue * 1.05]}
              tick={{ fill: strokeColor, fontSize: 10 }}
              axisLine={{ stroke: `${strokeColor}40` }}
              tickLine={{ stroke: `${strokeColor}40` }}
              tickFormatter={(val) =>
                chartMode === "PNL" ? `${val >= 0 ? "+" : ""}$${val}` : `$${(val / 1000).toFixed(1)}k`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: `1px solid ${strokeColor}`,
                color: strokeColor,
                fontSize: 12,
                fontFamily: "monospace",
              }}
              formatter={(value: number) => [
                chartMode === "PNL"
                  ? `${value >= 0 ? "+" : ""}$${value.toLocaleString()}`
                  : `$${value.toLocaleString()}`,
                chartMode === "PNL" ? "PNL" : "VALUE",
              ]}
              labelFormatter={(label) => `DAY: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: strokeColor, stroke: "#0a0a0a", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
