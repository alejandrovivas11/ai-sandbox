'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
} from './Form.types'

// ─── Form ─────────────────────────────────────────────────────────────────────
// Semantic <form> wrapper. Acts as a layout shell — pairs with FormField,
// FormLabel, FormControl, FormDescription, and FormMessage sub-components.

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => (
    <form
      ref={ref}
      className={cn('flex flex-col gap-[var(--spacing-6,1.5rem)]', className)}
      {...props}
    >
      {children}
    </form>
  ),
)
Form.displayName = 'Form'

// ─── FormField ────────────────────────────────────────────────────────────────
// Vertical stack that groups a label, control, description, and message for a
// single field. Mirrors the `gap-[var(--spacing-1,4px)]` spacing from the spec.

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-[var(--spacing-1,0.25rem)] items-start w-full', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
FormField.displayName = 'FormField'

// ─── FormLabel ────────────────────────────────────────────────────────────────
// Thin wrapper around a <label> that inherits the project's label token styles.
// Passes `invalid` through `aria-invalid` so screen readers get the signal.

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, invalid, children, ...props }, ref) => (
    <label
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'text-sm font-medium leading-none',
        'text-foreground',
        invalid && 'text-destructive',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  ),
)
FormLabel.displayName = 'FormLabel'

// ─── FormControl ──────────────────────────────────────────────────────────────
// Neutral passthrough div. Provides a consistent slot for Input, Select,
// Textarea, Switch, etc. so extra wrappers can be avoided in consuming code.

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {children}
    </div>
  ),
)
FormControl.displayName = 'FormControl'

// ─── FormDescription ──────────────────────────────────────────────────────────
// Helper text rendered beneath the control. Uses `muted-foreground` matching the
// `var(--base/muted-foreground)` token seen in the Figma spec.

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm leading-[var(--text-sm-line-height,1.25rem)] text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  ),
)
FormDescription.displayName = 'FormDescription'

// ─── FormMessage ──────────────────────────────────────────────────────────────
// Validation / error message. Defaults to `muted-foreground`; when `error` is
// true switches to `destructive` to match the Input's error border colour.

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, error, children, ...props }, ref) => {
    if (!children) return null
    return (
      <p
        ref={ref}
        role={error ? 'alert' : undefined}
        aria-live={error ? 'polite' : undefined}
        className={cn(
          'text-sm leading-[var(--text-sm-line-height,1.25rem)]',
          error ? 'text-destructive' : 'text-muted-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </p>
    )
  },
)
FormMessage.displayName = 'FormMessage'

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage }
export default Form
