import * as React from 'react'

export type ItemVariant = 'default' | 'outline' | 'muted'
export type ItemSize = 'default' | 'small'

export interface ItemProps {
  /** Title text for the item. */
  title?: React.ReactNode
  /** Secondary subtext displayed inline after the title. */
  titleSubtext?: React.ReactNode
  /** Optional badge element displayed inline after the title. */
  badge?: React.ReactNode
  /** Description / supporting text below the title. */
  description?: React.ReactNode
  /**
   * Media slot — typically a 32×32 icon box or an Avatar.
   * When provided it renders a styled 32×32 container with
   * rounded-sm, bg-muted, and border-border.
   */
  media?: React.ReactNode
  /**
   * Actions slot — typically a Button or icon button rendered on the
   * right side of the item, vertically centred.
   */
  actions?: React.ReactNode
  /**
   * Visual variant:
   * - "default"  — no border, transparent background
   * - "outline"  — border border-border
   * - "muted"    — bg-muted/50 background, no border
   */
  variant?: ItemVariant
  /**
   * Size:
   * - "default" — p-4 (16px all sides), gap-4
   * - "small"   — px-4 py-3 (16/12px), gap-2.5
   */
  size?: ItemSize
  /** Additional class names for the outer wrapper. */
  className?: string
}
