import { type VariantProps } from '@/lib/utils'
import { toggleVariants } from '.'
import * as TogglePrimitive from '@radix-ui/react-toggle'

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}
