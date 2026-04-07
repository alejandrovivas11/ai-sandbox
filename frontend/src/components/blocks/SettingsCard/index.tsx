import * as React from 'react'
import { cn } from '@/lib/utils'
import { Legend } from '@/components/blocks/Legend'

export interface SettingsCardProps {
  legend: string
  children: React.ReactNode
  className?: string
}

/**
 * A bordered card with a floating "legend" label at the top-left edge —
 * visually like an HTML <fieldset> but built with div + absolute positioning.
 */
const SettingsCard = React.forwardRef<HTMLDivElement, SettingsCardProps>(
  ({ legend, children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-lg border border-border bg-background p-4',
        className,
      )}
    >
      {/* Floating legend label */}
      <div className="absolute left-3 -top-[9px]">
        <Legend>{legend}</Legend>
      </div>

      {/* Content slot */}
      <div className="pt-1">{children}</div>
    </div>
  ),
)
SettingsCard.displayName = 'SettingsCard'

export { SettingsCard }
export default SettingsCard
