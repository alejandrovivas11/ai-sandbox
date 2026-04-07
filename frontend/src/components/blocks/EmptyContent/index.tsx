import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export interface EmptyContentProps {
  icon: React.ReactNode
  title: string
  description?: string
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
  layout?: 'desktop' | 'mobile' | 'auto'
  className?: string
}

const EmptyContent = React.forwardRef<HTMLDivElement, EmptyContentProps>(
  (
    {
      icon,
      title,
      description,
      primaryAction,
      secondaryAction,
      layout = 'auto',
      className,
    },
    ref,
  ) => {
    const hasActions = primaryAction || secondaryAction
    const isHorizontal = layout === 'desktop' || (layout === 'auto')
    const isMobile = layout === 'mobile'

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-4 text-center px-6 py-12', className)}
      >
        {/* Icon */}
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-foreground">
          {icon}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 max-w-sm">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground leading-5">{description}</p>
          )}
        </div>

        {/* Actions */}
        {hasActions && (
          <div
            className={cn(
              'flex gap-2',
              isMobile ? 'flex-col w-full max-w-xs' : 'flex-row items-center',
              layout === 'auto' && 'flex-row items-center',
            )}
          >
            {primaryAction && (
              <Button
                variant="default"
                size="sm"
                onClick={primaryAction.onClick}
                className={isMobile ? 'w-full' : ''}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={secondaryAction.onClick}
                className={isMobile ? 'w-full' : ''}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  },
)
EmptyContent.displayName = 'EmptyContent'

export { EmptyContent }
export default EmptyContent
