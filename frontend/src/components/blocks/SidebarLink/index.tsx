import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface SidebarLinkProps {
  children: React.ReactNode
  current?: boolean
  href?: string
  asChild?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
}

function SidebarLink({
  children,
  current = false,
  href,
  asChild = false,
  onClick,
  className,
  ...props
}: SidebarLinkProps) {
  const Comp = asChild ? Slot : href ? 'a' : 'button'

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(href ? { href } : {}) as any}
      {...(!href && !asChild ? { type: 'button' } : {})}
      aria-current={current ? 'page' : undefined}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLAnchorElement>}
      className={cn(
        'flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors',
        'focus-visible:outline-none focus-visible:shadow-focus-default',
        current
          ? 'bg-accent font-medium text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
        className,
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Comp>
  )
}

export { SidebarLink }
export default SidebarLink
