'use client'

export interface DatePickerProps {
  /** Controlled selected date */
  value?: Date
  /** Called when the user selects a date */
  onChange?: (date?: Date) => void
  /** Placeholder text shown when no date is selected */
  placeholder?: string
  /** Whether the trigger button is disabled */
  disabled?: boolean
  /**
   * Position of the calendar icon on the trigger button.
   * - `left`  — icon precedes the label (default, matches Figma "Icon Left" variant)
   * - `right` — icon follows the label (matches Figma "Icon Right" variant)
   */
  iconPosition?: 'left' | 'right'
  /** Additional className applied to the trigger button */
  className?: string
}

export interface DateRangePickerProps {
  /** Controlled date range */
  value?: { from?: Date; to?: Date }
  /** Called when the user selects a range */
  onChange?: (range?: { from?: Date; to?: Date }) => void
  /** Placeholder shown when no range is selected */
  placeholder?: string
  /** Whether the trigger button is disabled */
  disabled?: boolean
  /** Additional className applied to the trigger button */
  className?: string
}
