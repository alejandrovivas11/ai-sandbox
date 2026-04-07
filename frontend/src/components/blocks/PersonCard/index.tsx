import * as React from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'

export interface PersonCardProps {
  name: string
  description?: string
  avatarSrc?: string
  onAdd?: () => void
  href?: string
  layout?: 'horizontal' | 'vertical'
  className?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function PersonCard({
  name,
  description,
  avatarSrc,
  onAdd,
  href,
  layout = 'horizontal',
  className,
}: PersonCardProps) {
  const cardContent = (
    <CardContent className={cn('flex gap-3 p-4', layout === 'vertical' && 'flex-col items-center text-center')}>
      <Avatar className="size-12 shrink-0">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
        <AvatarFallback className="text-sm">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className={cn('min-w-0 flex-1', layout === 'vertical' && 'flex flex-col items-center')}>
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        {description && (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {onAdd && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onAdd}
          aria-label={`Add ${name}`}
          className="shrink-0 self-center text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-4" />
        </Button>
      )}
    </CardContent>
  )

  if (href) {
    return (
      <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
        <a href={href} className="block focus-visible:outline-none focus-visible:shadow-focus-default rounded-xl">
          {cardContent}
        </a>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {cardContent}
    </Card>
  )
}

export { PersonCard }
export default PersonCard
