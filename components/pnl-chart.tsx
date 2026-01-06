"use client"

import { useMemo, useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { BlinkingLabel } from "./blinking-label"
import { LiveDataTicker } from "./live-data-ticker"

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

function AnimatedDot(props: { cx?: number; cy?: number; stroke?: string }) {
  const { cx, cy, stroke } = props
  if (!cx || !cy) return null

  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={stroke} opacity={0.2} className="oscilloscope-pulse" />
      <circle cx={cx} cy={cy} r={4} fill={stroke} opacity={0.4} className="oscilloscope-pulse-delay" />
      <circle cx={cx} cy={cy} r={2} fill={stroke} />
    </g>
  )
}

export function PnlChart() {
  const [chartMode, setChartMode] = useState<"PNL" | "ACC_VALUE">("PNL")
  const [timePeriod, setTimePeriod] = useState<"7D" | "30D" | "ALL">("30D")
  const [animationKey, setAnimationKey] = useState(0)

  const days = timePeriod === "7D" ? 7 : timePeriod === "30D" ? 30 : 90

  const pnlData = useMemo(() => generatePnlData(days), [days])
  const accValueData = useMemo(() => generateAccValueData(days), [days])

  const data = chartMode === "PNL" ? pnlData : accValueData
  const minValue = Math.min(...data.map((d) => d.value))
  const maxValue = Math.max(...data.map((d) => d.value))

  const strokeColor = chartMode === "PNL" ? "#00ff41" : "#00d4ff"
  const gradientId = chartMode === "PNL" ? "pnlGradient" : "accGradient"

  useEffect(() => {
    setAnimationKey((k) => k + 1)
  }, [chartMode, timePeriod])

  return (
    <div className="terminal-border p-3 chart-container">
      <div className="mb-3 pb-2 border-b border-border">
        <LiveDataTicker />
      </div>

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

      <div className="mb-2 flex items-center gap-2">
        <BlinkingLabel text={chartMode === "PNL" ? "PNL_CHART" : "ACCOUNT_VALUE_CHART"} />
        <span className="signal-dot" />
        <span className="text-[10px] text-muted-foreground signal-text">LIVE</span>
      </div>

      <div className="h-40 md:h-48 chart-glow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart key={animationKey} data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="50%" stopColor={strokeColor} stopOpacity={0.1} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
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
                boxShadow: `0 0 15px ${strokeColor}40`,
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
              activeDot={<AnimatedDot stroke={strokeColor} />}
              filter="url(#glow)"
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-grid-overlay" />
    </div>
  )
}
