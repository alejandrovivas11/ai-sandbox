'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { InputProps } from './Input.types'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leadingIcon, trailingIcon, ...props }, ref) => {
    // If icon slots are used, render a wrapper that positions icons inside the
    // input visually.  The actual <input> gets adjusted padding so its text
    // does not overlap with the icons.
    if (leadingIcon || trailingIcon) {
      return (
        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            aria-invalid={error || undefined}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:shadow-focus-default',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:shadow-focus-destructive',
              leadingIcon && 'pl-9',
              trailingIcon && 'pr-9',
              className,
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="pointer-events-none absolute right-3 flex items-center text-muted-foreground">
              {trailingIcon}
            </span>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:shadow-focus-default',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:shadow-focus-destructive',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
export default Input
