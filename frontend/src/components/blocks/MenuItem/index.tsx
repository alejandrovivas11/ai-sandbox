import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface MenuItemProps {
  label: string
  /** Icon node — only shown when direction='vertical' */
  icon?: React.ReactNode
  direction?: 'horizontal' | 'vertical'
  current?: boolean
  href?: string
  asChild?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
}

function MenuItem({
  label,
  icon,
  direction = 'horizontal',
  current = false,
  href,
  asChild = false,
  onClick,
  className,
  ...props
}: MenuItemProps) {
  const Comp = asChild ? Slot : href ? 'a' : 'button'
  const isVertical = direction === 'vertical'

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(href ? { href } : {}) as any}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLAnchorElement>}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'inline-flex items-center transition-colors focus-visible:outline-none focus-visible:shadow-focus-default',
        isVertical
          ? ['gap-4 px-2.5 py-1', 'text-lg font-medium leading-7']
          : ['py-1', 'text-sm font-medium leading-5'],
        current
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {isVertical && icon && (
        <span className="inline-flex shrink-0 size-5 items-center justify-center text-current" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </Comp>
  )
}

export { MenuItem }
export default MenuItem
