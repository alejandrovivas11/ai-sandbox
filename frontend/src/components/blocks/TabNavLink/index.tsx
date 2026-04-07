import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface TabNavLinkProps {
  children: React.ReactNode
  current?: boolean
  disabled?: boolean
  href?: string
  asChild?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
}

function TabNavLink({
  children,
  current = false,
  disabled = false,
  href,
  asChild = false,
  onClick,
  className,
  ...props
}: TabNavLinkProps) {
  const Comp = asChild ? Slot : href ? 'a' : 'button'

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(href ? { href } : {}) as any}
      {...(!href && !asChild ? { type: 'button' } : {})}
      disabled={disabled}
      aria-current={current ? 'page' : undefined}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLAnchorElement>}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap px-3 pb-2 pt-1 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:shadow-focus-default',
        'disabled:pointer-events-none disabled:opacity-40',
        // Active underline
        current
          ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Comp>
  )
}

export interface TabNavBarProps {
  children: React.ReactNode
  className?: string
}

function TabNavBar({ children, className }: TabNavBarProps) {
  return (
    <div
      role="tablist"
      className={cn('flex items-end gap-1 border-b border-border', className)}
    >
      {children}
    </div>
  )
}

export { TabNavLink, TabNavBar }
export default TabNavLink
