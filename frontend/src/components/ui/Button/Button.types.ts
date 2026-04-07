import * as React from 'react'
import { type VariantProps } from '@/lib/utils'
import { buttonVariants } from '.'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a spinning LoaderCircle icon before the button label */
  isLoading?: boolean
}
