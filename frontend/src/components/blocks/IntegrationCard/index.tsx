import * as React from 'react'
import { ExternalLink, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export interface IntegrationCardProps {
  logo: React.ReactNode
  title: string
  description: string
  active: boolean
  onActiveChange: (value: boolean) => void
  onSettings?: () => void
  href?: string
  className?: string
}

const IntegrationCard = React.forwardRef<HTMLDivElement, IntegrationCardProps>(
  ({ logo, title, description, active, onActiveChange, onSettings, href, className }, ref) => (
    <Card ref={ref} className={cn('gap-4 py-4', className)}>
      <CardContent className="flex flex-col gap-3">
        {/* Header row: logo + optional external link */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-lg text-2xl',
              active ? 'opacity-100' : 'opacity-40 grayscale',
            )}
          >
            {logo}
          </div>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${title} in new tab`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>

        {/* Title + description */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold leading-none text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground leading-5">{description}</p>
        </div>

        {/* Footer row: settings button + toggle */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onSettings}
            aria-label={`${title} settings`}
          >
            <Settings className="size-3.5" aria-hidden="true" />
            Settings
          </Button>
          <Switch
            checked={active}
            onCheckedChange={onActiveChange}
            aria-label={`Toggle ${title}`}
          />
        </div>
      </CardContent>
    </Card>
  ),
)
IntegrationCard.displayName = 'IntegrationCard'

export { IntegrationCard }
export default IntegrationCard
