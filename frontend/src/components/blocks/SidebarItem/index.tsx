import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { NotificationBadge } from '@/components/blocks/NotificationBadge'

export interface SidebarItemProps {
  label: string
  icon?: React.ReactNode
  current?: boolean
  badge?: number
  href?: string
  asChild?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
}

function SidebarItem({
  label,
  icon,
  current = false,
  badge,
  href,
  asChild = false,
  onClick,
  className,
  ...props
}: SidebarItemProps) {
  const Comp = asChild ? Slot : href ? 'a' : 'button'

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(href ? { href } : {}) as any}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLAnchorElement>}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        'text-sm font-medium',
        'focus-visible:outline-none focus-visible:shadow-focus-default',
        current
          ? 'bg-muted text-primary'
          : 'text-muted-foreground hover:text-primary hover:bg-muted/50',
        className,
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {icon && (
        <span className="inline-flex shrink-0 size-4 items-center justify-center text-current" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="flex-1 truncate text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <NotificationBadge count={badge} />
      )}
    </Comp>
  )
}

export { SidebarItem }
export default SidebarItem
