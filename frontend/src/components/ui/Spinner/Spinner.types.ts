import { type VariantProps } from '@/lib/utils'
import { spinnerVariants } from './index'

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}
