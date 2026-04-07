import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NotificationBadgeProps {
  count: number
  max?: number
  className?: string
}

const NotificationBadge = React.forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  ({ count, max = 99, className }, ref) => {
    const display = count > max ? `${max}+` : String(count)

    return (
      <span
        ref={ref}
        aria-label={`${count} notification${count !== 1 ? 's' : ''}`}
        className={cn(
          'inline-flex size-6 items-center justify-center rounded-full',
          'bg-primary text-primary-foreground',
          'text-xs font-semibold leading-4 text-center',
          className,
        )}
      >
        {display}
      </span>
    )
  },
)
NotificationBadge.displayName = 'NotificationBadge'

export { NotificationBadge }
export default NotificationBadge
