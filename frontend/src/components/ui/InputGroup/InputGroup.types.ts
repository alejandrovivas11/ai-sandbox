import * as React from 'react'

// ---------------------------------------------------------------------------
// Addon slot types — describes what can appear inside an inline addon slot
// ---------------------------------------------------------------------------

/**
 * An inline addon rendered flush inside the input border.
 * Accepts any renderable content: an icon, a text label, a Kbd sequence, a
 * spinner, a small Button, etc.
 */
export interface InputGroupAddonInlineProps {
  /** Content to render inside the addon. */
  children: React.ReactNode
  /** Additional class names forwarded to the addon wrapper. */
  className?: string
}

/**
 * A block addon rendered below (or above) the input field, sharing its full
 * width.  Typically used for character counts, helper actions, or status text.
 */
export interface InputGroupAddonBlockProps {
  /** Slot for content that should sit at the start (left) of the block. */
  start?: React.ReactNode
  /** Slot for content that should sit at the end (right) of the block. */
  end?: React.ReactNode
  /** Additional class names forwarded to the block wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// InputGroup root
// ---------------------------------------------------------------------------

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Inline addon rendered at the start (left) of the input.
   * Accepts any React node: an icon, text prefix, Kbd, spinner, etc.
   */
  leadingAddon?: React.ReactNode

  /**
   * Inline addon rendered at the end (right) of the input.
   * Accepts any React node: an icon, text suffix, Kbd, button, etc.
   */
  trailingAddon?: React.ReactNode

  /**
   * Block addon rendered below the input, spanning its full width.
   * Typically contains character count, helper links, or action buttons.
   * Pass an object with optional `start` and `end` slots.
   */
  blockAddon?: InputGroupAddonBlockProps

  /**
   * When true, applies destructive border colour and focus ring to the
   * wrapped Input (forwarded via the `error` prop).
   */
  error?: boolean

  /** Forwarded to the underlying Input element. */
  disabled?: boolean

  /** Forwarded to the underlying Input element. */
  placeholder?: string

  /** Forwarded to the underlying Input element. */
  value?: string | number | readonly string[]

  /** Forwarded to the underlying Input element. */
  defaultValue?: string | number | readonly string[]

  /** Forwarded to the underlying Input element. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>

  /** Forwarded to the underlying Input element as `type`. */
  type?: React.HTMLInputTypeAttribute

  /** Forwarded to the underlying Input element. */
  name?: string

  /** Forwarded to the underlying Input element. */
  id?: string

  /** Forwarded to the underlying Input element. */
  required?: boolean

  /** Forwarded to the underlying Input element. */
  autoComplete?: string

  /** Forwarded to the underlying Input element. */
  autoFocus?: boolean

  /** Ref forwarded to the underlying <input> element. */
  inputRef?: React.Ref<HTMLInputElement>
}
