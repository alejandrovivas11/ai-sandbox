import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LegendProps {
  children: React.ReactNode
  className?: string
}

/**
 * Floating label used as a fieldset legend inside SettingsCard.
 * Sits on top of a border with bg-background to create the "cut-out" effect.
 */
const Legend = React.forwardRef<HTMLSpanElement, LegendProps>(
  ({ children, className }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center bg-background px-1',
        'text-sm font-medium leading-none text-foreground whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  ),
)
Legend.displayName = 'Legend'

export { Legend }
export default Legend
