import * as React from 'react'

/** Which media element to render above the text content */
export type EmptyMediaType = 'icon' | 'avatar' | 'avatar-group'

/** Which action block to render below the text content */
export type EmptyContentType =
  | 'button'
  | '2-buttons-vertical'
  | '2-buttons-horizontal'
  | '3-buttons'
  | 'input-description'
  | 'none'

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon or media element rendered in the muted rounded square at the top */
  icon?: React.ReactNode
  /** Controls which media variant is shown (icon | avatar | avatar-group) */
  mediaType?: EmptyMediaType
  /** Avatar element(s) to render when mediaType is 'avatar' or 'avatar-group' */
  media?: React.ReactNode
  /** Whether to show the media slot */
  showMedia?: boolean
  /** Main heading text */
  title?: string
  /** Whether to show the title */
  showTitle?: boolean
  /** Supporting description text */
  description?: string
  /** Whether to show the description */
  showDescription?: boolean
  /** Which action layout to render below the copy */
  contentType?: EmptyContentType
  /** Slot for the primary action button */
  primaryAction?: React.ReactNode
  /** Slot for the secondary action button */
  secondaryAction?: React.ReactNode
  /** Slot for the tertiary action button (used in 3-buttons layout) */
  tertiaryAction?: React.ReactNode
  /** Slot used by 'input-description' layout */
  inputSlot?: React.ReactNode
  /** Extra description shown beneath the input in 'input-description' layout */
  inputDescription?: string
}
