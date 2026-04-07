import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface NavbarLinkProps {
  href?: string
  current?: boolean
  style?: 'pill' | 'underline'
  asChild?: boolean
  className?: string
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
}

function NavbarLink({
  href,
  current = false,
  style = 'pill',
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: NavbarLinkProps) {
  const Comp = asChild ? Slot : href ? 'a' : 'button'

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(href ? { href } : {}) as any}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLAnchorElement>}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'inline-flex items-center whitespace-nowrap text-sm transition-colors',
        'focus-visible:outline-none focus-visible:shadow-focus-default',
        // pill style
        style === 'pill' && [
          'h-8 rounded-full px-3',
          current
            ? 'bg-accent text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
        ],
        // underline style
        style === 'underline' && [
          'h-8 px-1 border-b-2',
          current
            ? 'text-foreground font-semibold border-foreground'
            : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/40',
        ],
        className,
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Comp>
  )
}

export { NavbarLink }
export default NavbarLink
