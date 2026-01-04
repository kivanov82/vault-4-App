"use client"

export function ActionButtons() {
  const actions = [
    { label: "DEPOSIT", icon: "↓" },
    { label: "WITHDRAW", icon: "↑" },
    { label: "TRANSFER", icon: "⇄" },
    { label: "TRADE", icon: "◊" },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action) => (
        <button key={action.label} className="terminal-button py-2 px-1 text-xs flex flex-col items-center gap-1">
          <span className="text-base">{action.icon}</span>
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}
    </div>
  )
}
