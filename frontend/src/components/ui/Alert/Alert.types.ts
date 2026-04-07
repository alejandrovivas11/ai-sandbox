import * as React from 'react'
import { type VariantProps } from '@/lib/utils'
import { alertVariants } from '.'

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface AlertActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
