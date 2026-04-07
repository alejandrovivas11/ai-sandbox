import * as React from 'react'
import { cn } from '@/lib/utils'
import type { TextareaProps } from './Textarea.types'

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground resize-y',
        'focus:outline-none focus:shadow-focus-default',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus:shadow-focus-destructive',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export { Textarea }
export default Textarea
