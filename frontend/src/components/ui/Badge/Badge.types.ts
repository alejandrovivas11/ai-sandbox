import { type VariantProps } from '@/lib/utils'
import { badgeVariants } from '.'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'verified'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional icon rendered to the left of the label. */
  leftIcon?: React.ReactNode
  /** Optional icon rendered to the right of the label. */
  rightIcon?: React.ReactNode
}
