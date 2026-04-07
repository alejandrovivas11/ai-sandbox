import * as React from 'react'

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  className?: string
}

// ─── FormField ────────────────────────────────────────────────────────────────

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

// ─── FormLabel ────────────────────────────────────────────────────────────────

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Visually marks the label as required */
  required?: boolean
  /** Applies muted/error styling when the field is invalid */
  invalid?: boolean
  className?: string
}

// ─── FormControl ──────────────────────────────────────────────────────────────

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

// ─── FormDescription ──────────────────────────────────────────────────────────

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

// ─── FormMessage ──────────────────────────────────────────────────────────────

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** When true renders with destructive (error) colour */
  error?: boolean
  className?: string
}
