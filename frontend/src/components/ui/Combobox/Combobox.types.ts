import type * as PopoverPrimitive from '@radix-ui/react-popover'
import type * as React from 'react'

export interface ComboboxOption {
  /** The value stored/emitted when this option is selected */
  value: string
  /** The label shown in the list and trigger button */
  label: string
  /** Optionally disable this option */
  disabled?: boolean
}

export interface ComboboxProps {
  /** Currently selected value (controlled) */
  value?: string
  /** Called when the user picks an option */
  onValueChange?: (value: string) => void
  /** The list of options to display */
  options?: ComboboxOption[]
  /** Placeholder shown in the trigger when nothing is selected */
  placeholder?: string
  /** Placeholder shown inside the search input */
  searchPlaceholder?: string
  /** Text shown when no options match the search query */
  emptyText?: string
  /** Disable the entire combobox */
  disabled?: boolean
  /** Extra class names for the trigger button */
  className?: string
  /** Alignment of the popover relative to the trigger */
  align?: PopoverPrimitive.PopoverContentProps['align']
  /** Width of the dropdown — defaults to the trigger width */
  contentClassName?: string
}
