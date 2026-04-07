import * as React from 'react'
import { cn, cva } from '@/lib/utils'
import type { AlertProps, AlertTitleProps, AlertDescriptionProps, AlertActionProps } from './Alert.types'

export const alertVariants = cva(
  'relative w-full flex items-start gap-2 rounded-lg border border-border bg-card py-3 px-4',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        destructive: 'text-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  ),
)
Alert.displayName = 'Alert'

// Wraps icon — shrinks to icon size, optically aligns with first line of text
const AlertIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('shrink-0 mt-px [&>svg]:size-4', className)}
      {...props}
    />
  ),
)
AlertIcon.displayName = 'AlertIcon'

// Wraps title + description in a flex-col stack
const AlertContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-1 flex-col gap-1', className)} {...props} />
  ),
)
AlertContent.displayName = 'AlertContent'

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('text-sm font-medium leading-none tracking-tight', className)}
      {...props}
    />
  ),
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm text-muted-foreground [.destructive_&]:text-destructive [&_p]:leading-relaxed', className)}
      {...props}
    />
  ),
)
AlertDescription.displayName = 'AlertDescription'

// Optional trailing action button (e.g. "Undo")
const AlertAction = React.forwardRef<HTMLButtonElement, AlertActionProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'ml-auto shrink-0 inline-flex items-center justify-center h-6 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent',
        className,
      )}
      {...props}
    />
  ),
)
AlertAction.displayName = 'AlertAction'

export { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription, AlertAction }
export default Alert
