import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CheckboxProps } from './Checkbox.types'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // 16×16px, rounded-sm (6px), white bg, 1px border-border, xs drop shadow
      'relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-border bg-background shadow-xs transition-colors',
      // focus ring: 0 0 0 3px rgba(163,163,163,0.5)
      'focus-visible:outline-none focus-visible:shadow-focus-default',
      // disabled: 50% opacity, no pointer events
      'disabled:cursor-not-allowed disabled:opacity-50',
      // checked: primary bg + border, primary-foreground icon
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
      // indeterminate: same as checked
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {props.checked === 'indeterminate' ? (
        <Minus className="size-3" strokeWidth={3} />
      ) : (
        <Check className="size-3" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
export default Checkbox
