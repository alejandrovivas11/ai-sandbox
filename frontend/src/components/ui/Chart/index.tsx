'use client'

import * as React from 'react'
import { Tooltip, Legend } from 'recharts'
import { cn } from '@/lib/utils'
import type {
  ChartConfig,
  ChartContainerProps,
  ChartTooltipContentProps,
  ChartLegendContentProps,
} from './Chart.types'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('useChart must be used inside <ChartContainer>')
  return ctx
}

/** Resolves a series key to its config entry, falling back gracefully. */
function getConfigEntry(config: ChartConfig, key: string | undefined) {
  if (!key) return undefined
  // Try direct key, then try stripping leading/trailing whitespace
  return config[key] ?? config[key.trim()]
}

// ---------------------------------------------------------------------------
// CSS variable injection helpers
// ---------------------------------------------------------------------------

function buildCssVars(config: ChartConfig): React.CSSProperties {
  const vars: Record<string, string> = {}
  for (const [key, entry] of Object.entries(config)) {
    if (entry.color) {
      vars[`--color-${key}`] = entry.color
    }
  }
  return vars as React.CSSProperties
}

// ---------------------------------------------------------------------------
// ChartContainer
// ---------------------------------------------------------------------------

/**
 * Wraps a recharts chart with:
 *  - A React context holding the ChartConfig.
 *  - CSS variables injected as inline styles (`--color-<key>`).
 *  - Responsive sizing via a plain div (recharts components are responsible
 *    for their own ResponsiveContainer usage inside).
 *
 * Design tokens used:
 *  - Background: var(--background, #ffffff)
 *  - Border:     var(--border, #e5e5e5)
 *  - Muted-fg:   var(--muted-foreground, #737373)
 *  - Font size:  12px (text-xs) for axis ticks / legend
 */
const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, style, ...props }, ref) => {
    const cssVars = buildCssVars(config)

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn(
            // Establish a stacking context; children (recharts) fill the space.
            'flex aspect-video justify-center text-xs',
            '[&_.recharts-cartesian-axis-tick_text]:fill-[#737373]',
            '[&_.recharts-cartesian-grid_line[stroke="ccc"]]:stroke-[#e5e5e5]/50',
            '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-[#e5e5e5]',
            '[&_.recharts-dot[stroke="#fff"]]:stroke-transparent',
            '[&_.recharts-layer]:outline-none',
            '[&_.recharts-polar-grid_[stroke="#ccc"]]:stroke-[#e5e5e5]',
            '[&_.recharts-radial-bar-background-sector]:fill-[#f5f5f5]',
            '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[#f5f5f5]',
            '[&_.recharts-reference-line_[stroke="#ccc"]]:stroke-[#e5e5e5]',
            '[&_.recharts-sector[stroke="#fff"]]:stroke-transparent',
            '[&_.recharts-sector]:outline-none',
            '[&_.recharts-surface]:outline-none',
            className,
          )}
          style={{ ...cssVars, ...style }}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = 'ChartContainer'

// ---------------------------------------------------------------------------
// ChartTooltip — re-export of recharts Tooltip for convenience
// ---------------------------------------------------------------------------

const ChartTooltip = Tooltip

// ---------------------------------------------------------------------------
// ChartTooltipContent
// ---------------------------------------------------------------------------

/**
 * Drop-in `content` prop for recharts `<Tooltip>`.
 * Styled to match the design system tooltip (rounded-md, shadow-md, text-xs).
 *
 * Figma spec (node 523:8354):
 *  - bg: white / border: #f2f2f2
 *  - rounded-md (8px), shadow-md
 *  - px-[10px] py-[6px], gap-[8px] between sections
 *  - Header: text-xs / medium / foreground
 *  - Item row: 8px colour swatch (rounded-sm=2px) + label (muted-fg) + value (medium)
 *  - Footer separator + "Total" row when relevant
 */
const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      payload,
      label,
      config: configProp,
      hideLabel = false,
      hideIndicator = false,
      indicator = 'dot',
      unit,
      labelKey,
      formatter,
      nameKey,
    },
    ref,
  ) => {
    const { config: ctxConfig } = useChart()
    const config = configProp ?? ctxConfig

    if (!payload?.length) return null

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-md border border-[#f2f2f2] bg-background',
          'px-[10px] py-[6px] text-xs',
          'shadow-[0_4px_6px_0_rgba(0,0,0,0.1),0_2px_4px_0_rgba(0,0,0,0.1)]',
        )}
      >
        {/* Header label */}
        {!hideLabel && label != null && (
          <p className="font-medium leading-4 text-foreground">{label}</p>
        )}

        {/* Item rows */}
        <div className="grid gap-1.5">
          {payload.map((item, i) => {
            const key = nameKey
              ? String((item.payload as Record<string, unknown>)?.[nameKey] ?? item.dataKey ?? item.name ?? 'value')
              : String(item.dataKey ?? item.name ?? 'value')
            const entry = getConfigEntry(config, key)
            const indicatorColor = item.color ?? entry?.color ?? 'var(--color-chart-1)'
            const displayLabel = entry?.label ?? item.name ?? key

            return (
              <div key={i} className="flex w-full flex-wrap items-stretch gap-2">
                {!hideIndicator && (
                  <div
                    className={cn(
                      'shrink-0 self-center',
                      indicator === 'dot' && 'size-2 rounded-[2px]',
                      indicator === 'line' && 'h-px w-3',
                      indicator === 'dashed' && 'h-px w-3 border border-dashed border-current',
                    )}
                    style={{ backgroundColor: indicator !== 'dashed' ? indicatorColor : undefined, borderColor: indicator === 'dashed' ? indicatorColor : undefined }}
                  />
                )}
                <div className="flex flex-1 justify-between gap-2 leading-none">
                  <span className="text-muted-foreground">{displayLabel}</span>
                  {item.value != null && (
                    <span className="font-medium text-foreground">
                      {formatter
                        ? formatter(item.value, key)
                        : `${item.value.toLocaleString()}${unit ?? ''}`}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = 'ChartTooltipContent'

// ---------------------------------------------------------------------------
// ChartLegend — re-export of recharts Legend for convenience
// ---------------------------------------------------------------------------

const ChartLegend = Legend

// ---------------------------------------------------------------------------
// ChartLegendContent
// ---------------------------------------------------------------------------

/**
 * Drop-in `content` prop for recharts `<Legend>`.
 * Styled to match the design system legend.
 *
 * Figma spec (node 449:7484 / 449:7451):
 *  - Horizontal flex-wrap, gap-4
 *  - Item: 8px swatch (rounded-[2px]) + label (text-xs / foreground)
 */
const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ payload, config: configProp, hideIcon = false, nameKey, className, verticalAlign = 'bottom' }, ref) => {
    const { config: ctxConfig } = useChart()
    const config = configProp ?? ctxConfig

    if (!payload?.length) return null

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center justify-center gap-4',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className,
        )}
      >
        {payload.map((item, i) => {
          const key = nameKey
            ? String(item[nameKey as keyof typeof item] ?? item.dataKey ?? item.value ?? 'value')
            : String(item.dataKey ?? item.value ?? 'value')
          const entry = getConfigEntry(config, key)
          const color = item.color ?? entry?.color ?? 'var(--color-chart-1)'
          const label = entry?.label ?? item.value ?? key

          return (
            <div key={i} className="flex items-center gap-1.5">
              {!hideIcon &&
                (entry?.icon ? (
                  <entry.icon className="size-3 shrink-0" />
                ) : (
                  <div
                    className="size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              <span className="text-xs text-foreground">{label}</span>
            </div>
          )
        })}
      </div>
    )
  },
)
ChartLegendContent.displayName = 'ChartLegendContent'

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}

export type { ChartConfig }
