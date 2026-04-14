import { type VariantProps } from '@/lib/utils'
import { toggleVariants } from '../Toggle'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'

// Radix ToggleGroup.Root is a union of single | multiple, both require `type`.
// We re-express it here to keep our wrapper typed correctly.
export type ToggleGroupProps = (
  | (ToggleGroupPrimitive.ToggleGroupSingleProps & { type: 'single' })
  | (ToggleGroupPrimitive.ToggleGroupMultipleProps & { type: 'multiple' })
) &
  VariantProps<typeof toggleVariants> & {
    className?: string
    orientation?: 'horizontal' | 'vertical'
  }

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {
  className?: string
}
