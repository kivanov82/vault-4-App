"use client"

import { useEffect, useState } from "react"

interface TickerData {
  hlPrice: number
  volume24h: number
  openInterest: number
  fundingRate: number
}

function generateMockData(): TickerData {
  return {
    hlPrice: 12.45 + (Math.random() - 0.5) * 0.3,
    volume24h: 285_000_000 + (Math.random() - 0.5) * 50_000_000,
    openInterest: 1_250_000_000 + (Math.random() - 0.5) * 100_000_000,
    fundingRate: 0.0045 + (Math.random() - 0.5) * 0.002,
  }
}

export function LiveDataTicker() {
  const [data, setData] = useState<TickerData>(generateMockData())
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateMockData()
      // Determine which value changed most significantly
      const changes = [
        { key: "hl", diff: Math.abs(newData.hlPrice - data.hlPrice) / data.hlPrice },
        { key: "vol", diff: Math.abs(newData.volume24h - data.volume24h) / data.volume24h },
        { key: "oi", diff: Math.abs(newData.openInterest - data.openInterest) / data.openInterest },
        { key: "fr", diff: Math.abs(newData.fundingRate - data.fundingRate) / Math.abs(data.fundingRate) },
      ]
      const maxChange = changes.reduce((a, b) => (a.diff > b.diff ? a : b))
      setFlash(maxChange.key)
      setData(newData)
      setTimeout(() => setFlash(null), 200)
    }, 1000)

    return () => clearInterval(interval)
  }, [data])

  return (
    <div className="flex items-center gap-3 text-[10px] overflow-x-auto scrollbar-hide">
      <div className={`flex items-center gap-1 transition-all ${flash === "hl" ? "data-flash" : ""}`}>
        <span className="text-muted-foreground">$HL:</span>
        <span className="text-primary glow-text">${data.hlPrice.toFixed(2)}</span>
      </div>
      <span className="text-muted-foreground">|</span>
      <div className={`flex items-center gap-1 transition-all ${flash === "vol" ? "data-flash" : ""}`}>
        <span className="text-muted-foreground">VOL_24H:</span>
        <span className="text-primary">${(data.volume24h / 1_000_000).toFixed(1)}M</span>
      </div>
      <span className="text-muted-foreground">|</span>
      <div className={`flex items-center gap-1 transition-all ${flash === "oi" ? "data-flash" : ""}`}>
        <span className="text-muted-foreground">OI:</span>
        <span className="text-primary">${(data.openInterest / 1_000_000_000).toFixed(2)}B</span>
      </div>
      <span className="text-muted-foreground">|</span>
      <div className={`flex items-center gap-1 transition-all ${flash === "fr" ? "data-flash" : ""}`}>
        <span className="text-muted-foreground">FR:</span>
        <span className={data.fundingRate >= 0 ? "text-primary" : "text-destructive"}>
          {data.fundingRate >= 0 ? "+" : ""}
          {(data.fundingRate * 100).toFixed(4)}%
        </span>
      </div>
    </div>
  )
}
