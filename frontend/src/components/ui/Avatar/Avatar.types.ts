import * as AvatarPrimitive from '@radix-ui/react-avatar'

export type AvatarSize = '5' | '6' | '8' | '10' | '12'

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  /**
   * Size of the avatar.
   * 5=20px | 6=24px | 8=32px | 10=40px | 12=48px
   * @default '12'
   */
  size?: AvatarSize
}

export type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  /** Inherited from parent Avatar — do not pass directly; use `size` on <Avatar>. */
  size?: AvatarSize
}
