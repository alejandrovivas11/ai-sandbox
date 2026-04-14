import * as React from 'react'

export type FieldOrientation = 'vertical' | 'responsive'
export type FieldDescriptionPlacement = 'under-input' | 'under-label'

export interface FieldProps {
  /** The form control to render inside the field. */
  children: React.ReactNode
  /** Label text shown above the control. */
  label?: React.ReactNode
  /** Hint / description text. */
  description?: React.ReactNode
  /** Where the description is placed relative to the control. */
  descriptionPlacement?: FieldDescriptionPlacement
  /**
   * Marks the field as invalid — turns the label red and passes `error` to the
   * child Input when the child is a plain `<Input>` (via React.cloneElement).
   */
  invalid?: boolean
  /**
   * Optional link rendered top-right of the label row (e.g. "Forgot your
   * password?"). Must be an anchor or a React element.
   */
  link?: React.ReactNode
  /** Layout orientation. Defaults to "vertical". */
  orientation?: FieldOrientation
  /** HTML `id` forwarded to the control; the Label `htmlFor` is derived from it. */
  id?: string
  /** Additional class names for the outer wrapper. */
  className?: string
}
