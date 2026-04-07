import * as React from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn, cva } from '@/lib/utils'
import type { SpinnerProps } from './Spinner.types'

export const spinnerVariants = cva('animate-spin text-current', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      default: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <LoaderCircle className={cn(spinnerVariants({ size }))} />
    </span>
  ),
)
Spinner.displayName = 'Spinner'

export { Spinner }
export default Spinner
