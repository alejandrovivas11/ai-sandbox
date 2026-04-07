import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'

export interface MessageCardTag {
  label: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export interface MessageCardProps {
  senderName: string
  senderAvatar?: string
  subject: string
  preview: string
  timestamp: string
  unread?: boolean
  active?: boolean
  tags?: MessageCardTag[]
  onClick?: () => void
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

function MessageCard({
  senderName,
  senderAvatar,
  subject,
  preview,
  timestamp,
  unread = false,
  active = false,
  tags,
  onClick,
  className,
}: MessageCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg px-4 py-3 text-left transition-colors',
        'focus-visible:outline-none focus-visible:shadow-focus-default',
        active ? 'bg-muted' : 'hover:bg-muted/50',
        className,
      )}
    >
      {/* Avatar */}
      <Avatar className="size-9 shrink-0 mt-0.5">
        {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName} />}
        <AvatarFallback className="text-xs">{getInitials(senderName)}</AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Row 1: sender + timestamp + unread dot */}
        <div className="flex items-center justify-between gap-2">
          <span className={cn('truncate text-sm', unread ? 'font-semibold text-foreground' : 'font-medium text-foreground')}>
            {senderName}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{timestamp}</span>
            {unread && (
              <span className="size-2 rounded-full bg-primary" aria-label="Unread" />
            )}
          </div>
        </div>

        {/* Row 2: subject */}
        <p className={cn('truncate text-sm', unread ? 'font-medium text-foreground' : 'text-muted-foreground')}>
          {subject}
        </p>

        {/* Row 3: preview */}
        <p className="truncate text-xs text-muted-foreground">{preview}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag.label} variant={tag.variant ?? 'secondary'} className="text-xs">
                {tag.label}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

export { MessageCard }
export default MessageCard
