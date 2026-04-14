import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'
import type { AvatarProps, AvatarImageProps, AvatarFallbackProps } from './Avatar.types'

// Size → Tailwind size class mapping (matches Figma token names)
// 12=48px, 10=40px, 8=32px, 6=24px, 5=20px
const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  '12': 'size-12', // 48px
  '10': 'size-10', // 40px
  '8': 'size-8',  // 32px
  '6': 'size-6',  // 24px
  '5': 'size-5',  // 20px
}

// Fallback text size: sizes 5 → text-xs (12px/16px), all others → text-sm (14px/20px)
const fallbackTextClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  '12': 'text-sm font-normal leading-5',
  '10': 'text-sm font-normal leading-5',
  '8': 'text-sm font-normal leading-5',
  '6': 'text-sm font-normal leading-5',
  '5': 'text-xs font-normal leading-4',
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = '12', ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-size={size}
    className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      sizeClasses[size],
      className,
    )}
    {...props}
  />
))
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
))
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, size = '12', ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full',
      'bg-muted text-foreground',
      fallbackTextClasses[size],
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
export default Avatar
