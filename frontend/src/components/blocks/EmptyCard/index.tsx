import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'

export interface EmptyCardProps {
  icon: React.ReactNode
  title: string
  description?: string
  onClick?: () => void
  href?: string
  iconPosition?: 'left' | 'top'
  className?: string
}

const EmptyCard = React.forwardRef<HTMLDivElement, EmptyCardProps>(
  ({ icon, title, description, onClick, href, iconPosition = 'left', className }, ref) => {
    const isInteractive = !!(onClick || href)

    const inner = (
      <CardContent
        className={cn(
          'flex gap-4 py-4',
          iconPosition === 'top' ? 'flex-col' : 'flex-row items-center',
          isInteractive && 'cursor-pointer select-none',
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg bg-muted text-foreground',
            iconPosition === 'left' ? 'size-10' : 'size-12',
          )}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground leading-5 line-clamp-2">{description}</p>
          )}
        </div>

        {/* Arrow */}
        {isInteractive && (
          <ArrowRight
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/card:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </CardContent>
    )

    if (href) {
      return (
        <Card ref={ref} className={cn('group/card gap-0 py-0 hover:shadow-md transition-shadow', className)}>
          <a href={href} className="block focus-visible:outline-none focus-visible:shadow-focus-default rounded-xl">
            {inner}
          </a>
        </Card>
      )
    }

    if (onClick) {
      return (
        <Card
          ref={ref}
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => e.key === 'Enter' && onClick()}
          className={cn('group/card gap-0 py-0 hover:shadow-md transition-shadow cursor-pointer focus-visible:outline-none focus-visible:shadow-focus-default', className)}
        >
          {inner}
        </Card>
      )
    }

    return (
      <Card ref={ref} className={cn('gap-0 py-0', className)}>
        {inner}
      </Card>
    )
  },
)
EmptyCard.displayName = 'EmptyCard'

export { EmptyCard }
export default EmptyCard
