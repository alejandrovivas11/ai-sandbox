import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders a decorative icon on the left inside the input. */
  leadingIcon?: React.ReactNode
  /** Renders a decorative icon on the right inside the input. */
  trailingIcon?: React.ReactNode
  /** When true, applies destructive border colour and focus ring. */
  error?: boolean
}
