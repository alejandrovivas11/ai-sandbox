import * as React from 'react'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'
export type ButtonGroupVariant = 'default' | 'secondary' | 'outline'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Layout direction of the button group.
   * @default 'horizontal'
   */
  orientation?: ButtonGroupOrientation
  /**
   * Visual style variant — passed down to child Buttons via context.
   * @default 'default'
   */
  variant?: ButtonGroupVariant
  /**
   * Size passed down to child Buttons via context.
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
}

export interface ButtonGroupContextValue {
  orientation: ButtonGroupOrientation
  variant: ButtonGroupVariant
  size: ButtonGroupProps['size']
}
