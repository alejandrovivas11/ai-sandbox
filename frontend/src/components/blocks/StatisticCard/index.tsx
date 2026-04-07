import * as React from 'react'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export interface StatisticCardProps {
  header: string
  value: string
  description?: string
  /** Lucide icon node shown top-right */
  icon?: React.ReactNode
  /** Show an info icon next to the header */
  showInfo?: boolean
  /** Trend badge: positive % shows TrendingUp, negative shows TrendingDown */
  trend?: string
  /** Optional sparkline / mini-chart rendered below the text */
  chart?: React.ReactNode
  className?: string
}

const StatisticCard = React.forwardRef<HTMLDivElement, StatisticCardProps>(
  ({ header, value, description, icon, showInfo = false, trend, chart, className }, ref) => {
    const isNegative = trend?.startsWith('-')

    return (
      <Card ref={ref} className={cn('gap-0 py-0 overflow-hidden', className)}>
        <CardContent className="flex flex-col gap-2 pt-4 pb-0">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-foreground">{header}</p>
              {showInfo && (
                <Info className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
              )}
            </div>
            {icon && (
              <span className="text-muted-foreground size-4 inline-flex items-center justify-center shrink-0" aria-hidden="true">
                {icon}
              </span>
            )}
          </div>

          {/* Value + trend badge */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground leading-8">{value}</p>
              {trend && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {isNegative
                    ? <TrendingDown className="size-3" aria-hidden="true" />
                    : <TrendingUp className="size-3" aria-hidden="true" />}
                  {trend}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </CardContent>

        {/* Optional sparkline — renders flush to bottom */}
        {chart && (
          <div className="mt-2 h-[100px] w-full overflow-hidden">
            {chart}
          </div>
        )}
        {!chart && <div className="pb-4" />}
      </Card>
    )
  },
)
StatisticCard.displayName = 'StatisticCard'

export { StatisticCard }
export default StatisticCard
