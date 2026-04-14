import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'

export interface MessageBubbleProps {
  author: 'me' | 'other'
  content: string
  senderName?: string
  senderAvatar?: string
  timestamp: string
  className?: string
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ author, content, senderName, senderAvatar, timestamp, className }, ref) => {
    const isMe = author === 'me'

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full gap-2',
          isMe ? 'flex-row-reverse items-end' : 'flex-row items-end',
          className,
        )}
      >
        {/* Avatar — only for 'other' */}
        {!isMe && (
          <Avatar size="8" className="shrink-0 mb-4">
            {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName ?? 'User'} />}
            <AvatarFallback size="8">
              {(senderName ?? 'U').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Bubble + meta */}
        <div
          className={cn(
            'flex flex-col gap-1 max-w-[70%]',
            isMe ? 'items-end' : 'items-start',
          )}
        >
          {/* Sender name — only for 'other' */}
          {!isMe && senderName && (
            <span className="text-xs font-medium text-foreground px-1">{senderName}</span>
          )}

          {/* Bubble */}
          <div
            className={cn(
              'rounded-2xl px-3.5 py-2.5 text-sm leading-5',
              isMe
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : 'bg-muted text-foreground rounded-bl-sm',
            )}
          >
            {content}
          </div>

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground px-1">{timestamp}</span>
        </div>
      </div>
    )
  },
)
MessageBubble.displayName = 'MessageBubble'

export { MessageBubble }
export default MessageBubble
