import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ListRowProps {
  icon: React.ReactNode
  title: string
  description?: string
  onClick?: () => void
  href?: string
  className?: string
}

function ListRow({ icon, title, description, onClick, href, className }: ListRowProps) {
  const inner = (
    <>
      {/* Icon box */}
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
        {icon}
      </span>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </>
  )

  const baseClass = cn(
    'flex w-full items-center gap-3 border-t border-border py-3 transition-colors',
    'focus-visible:outline-none focus-visible:shadow-focus-default',
    className,
  )

  if (href) {
    return (
      <a href={href} className={cn(baseClass, 'hover:bg-muted/50')}>
        {inner}
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(baseClass, 'hover:bg-muted/50 text-left')}>
        {inner}
      </button>
    )
  }

  return (
    <div className={baseClass}>
      {inner}
    </div>
  )
}

export { ListRow }
export default ListRow
