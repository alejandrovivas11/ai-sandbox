import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cn, cva } from '@/lib/utils'
import type { ToggleProps } from './Toggle.types'

export const toggleVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
    'focus-visible:shadow-focus-default',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'hover:bg-muted hover:text-muted-foreground',
          'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        ].join(' '),
        outline: [
          'border border-input',
          'hover:bg-accent hover:text-accent-foreground',
          'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        ].join(' '),
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
))
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
export default Toggle
