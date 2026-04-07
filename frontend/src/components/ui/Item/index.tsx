'use client'

// Figma node: 18672:6323  (Variant=Default, Size=Default)
// Figma node: 18672:198608 (Variant=Outline, Size=Default)
// Figma node: 18672:198628 (Variant=Muted, Size=Default)
// Figma node: 18672:198687 (Variant=Default, Size=Small)
// Figma node: 18672:198693 (Variant=Outline, Size=Small)
// Figma node: 18672:198699 (Variant=Muted, Size=Small)
//
// Anatomy
// ──────────────────────────────────────────────────────────────────────────────
// [Media]  [ItemContent]          [Actions]
//
// Media:        32×32 container — rounded-sm border border-border bg-muted
//               receives the `media` slot (icon, avatar, image…)
//
// ItemContent:  flex-col gap-1
//   ├─ Title row: title (font-medium text-sm) + optional badge + optional subtext
//   └─ Description: text-sm text-muted-foreground
//
// Actions:      right side, vertically centred, typically an outline Button
//
// Variants
// ──────────────────────────────────────────────────────────────────────────────
// default  → no border, no background  (rounded-md overflow-hidden)
// outline  → border border-border       (rounded-md)
// muted    → bg-muted/50               (rounded-md overflow-hidden)
//
// Sizes
// ──────────────────────────────────────────────────────────────────────────────
// default → p-4 gap-4
// small   → px-4 py-3 gap-2.5

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { ItemProps } from './Item.types'

// ── Outer wrapper variant classes ───────────────────────────────────────────
const variantClasses: Record<NonNullable<ItemProps['variant']>, string> = {
  default: 'rounded-md overflow-hidden',
  outline: 'rounded-md border border-border',
  muted:   'rounded-md overflow-hidden bg-muted/50',
}

// ── Size classes ─────────────────────────────────────────────────────────────
const sizeClasses: Record<NonNullable<ItemProps['size']>, string> = {
  default: 'p-4 gap-4',
  small:   'px-4 py-3 gap-2.5',
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      title,
      titleSubtext,
      badge,
      description,
      media,
      actions,
      variant = 'default',
      size = 'default',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {/* ── Media slot ───────────────────────────────────────────────── */}
        {media && (
          <div
            className={cn(
              'shrink-0 flex items-center justify-center',
              'size-8 rounded-sm border border-border bg-muted',
            )}
            aria-hidden="true"
          >
            {media}
          </div>
        )}

        {/* ── Item content ─────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col gap-1 items-start justify-center">
          {/* Title row */}
          {(title || badge || titleSubtext) && (
            <div className="flex w-full items-center gap-2 shrink-0">
              {title && (
                <p className="shrink-0 text-sm font-medium leading-4 text-foreground whitespace-nowrap">
                  {title}
                </p>
              )}
              {badge && (
                <span className="shrink-0">{badge}</span>
              )}
              {titleSubtext && (
                <p className="shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground leading-none">
                  {titleSubtext}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="w-full overflow-hidden text-ellipsis text-sm leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {/* ── Actions slot ─────────────────────────────────────────────── */}
        {actions && (
          <div className="flex shrink-0 self-stretch items-center justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    )
  },
)
Item.displayName = 'Item'

export { Item }
export default Item
