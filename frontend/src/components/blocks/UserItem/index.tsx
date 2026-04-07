import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'

export interface UserItemProps {
  name: string
  email?: string
  value?: string
  avatarSrc?: string
  /** Custom right slot — replaces value if provided */
  action?: React.ReactNode
  className?: string
}

const UserItem = React.forwardRef<HTMLDivElement, UserItemProps>(
  ({ name, email, value, avatarSrc, action, className }, ref) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4 w-full min-w-0', className)}
      >
        <Avatar size="12" className="shrink-0">
          {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
          <AvatarFallback size="12">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{name}</p>
          {email && (
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          )}
        </div>

        {action ?? (
          value && (
            <p className="shrink-0 text-base font-medium text-foreground">{value}</p>
          )
        )}
      </div>
    )
  },
)
UserItem.displayName = 'UserItem'

export { UserItem }
export default UserItem
