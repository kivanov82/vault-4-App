# Agent Notes

## UI behavior
- The CONNECT button in `components/terminal-header.tsx` is intentionally disabled when not connected.
- Tooltip for CONNECT shows only on hover; use cyberpunk terminal styling and keep cursor `not-allowed` when disabled.

## Data logic
- In `components/positions-table.tsx`, SIZE is computed as % of total TVL (prefer `totalInvestedUsd`, fallback to sum of `amountUsd`).
- Positions table is sortable with default descending sort by SIZE.
- VAULT column links to `https://app.hyperliquid.xyz/vaults/{vaultAddress}` (opens in new tab).
- Performance metrics: 30D_PNL and 30D_MAX_DRAWDOWN are calculated pro rata on the backend from vault closure ledger data.
