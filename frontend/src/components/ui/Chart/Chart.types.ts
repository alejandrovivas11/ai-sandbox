export type ChartColorValue = string

export interface ChartConfigEntry {
  label: string
  color?: ChartColorValue
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Maps series keys to their label and color configuration.
 * Colors are injected as CSS variables: `--color-<key>`.
 *
 * @example
 * const config: ChartConfig = {
 *   desktop: { label: 'Desktop', color: '#171717' },
 *   mobile:  { label: 'Mobile',  color: '#737373' },
 * }
 */
export type ChartConfig = Record<string, ChartConfigEntry>

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Series config — drives CSS variable injection and legend/tooltip labels. */
  config: ChartConfig
  children: React.ReactNode
}

export interface ChartTooltipContentProps {
  /** Whether to show the colour swatch next to each item. Default: true */
  indicator?: 'line' | 'dot' | 'dashed'
  /** Whether to show the series label. Default: true */
  hideLabel?: boolean
  /** Whether to hide the colour indicator. Default: false */
  hideIndicator?: boolean
  /** Recharts tooltip payload */
  payload?: Array<{
    name?: string
    value?: number | string
    dataKey?: string
    color?: string
    payload?: Record<string, unknown>
  }>
  /** Recharts tooltip label (x-axis value) */
  label?: string
  /** The chart config to resolve labels and colors */
  config?: ChartConfig
  /** Optional unit suffix appended to each value */
  unit?: string
  /** Key in each payload item to use as the formatted label */
  labelKey?: string
  /** Optional formatter function */
  formatter?: (value: number | string, name: string) => string
  nameKey?: string
}

export interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Recharts legend payload */
  payload?: Array<{
    value?: string
    dataKey?: string
    color?: string
    type?: string
  }>
  /** The chart config to resolve labels and colors */
  config?: ChartConfig
  /** Hide swatch icon. Default: false */
  hideIcon?: boolean
  nameKey?: string
  verticalAlign?: 'top' | 'bottom' | 'middle'
}
