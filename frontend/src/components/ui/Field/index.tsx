'use client'

// Figma node: 18684:15221 (Field — Orientation=Vertical, Data Invalid=False)
// Figma node: 18692:40259 (Field — Orientation=Vertical, Data Invalid=True)
// Figma node: 18707:231727 (Field — Orientation=Responsive)
//
// Layout
// ──────────────────────────────────────────────────────────────────────────────
// Outer wrapper: flex-col gap-1 (4px)
// Label row:     relative flex items-center justify-between
//   └─ Label text    text-sm font-medium  (red = text-destructive when invalid)
//   └─ Link slot     text-sm text-foreground  (absolute right-0 top-0)
// Control slot:  child passed as children
// Description:   text-sm text-muted-foreground  (gap-0.5 below its sibling)
//
// descriptionPlacement="under-label"  → description sits between label and control
// descriptionPlacement="under-input"  → description sits after the control (default)
//
// orientation="responsive"  → label + control on one line (label shrinks, control grows)

import * as React from 'react'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'
import type { FieldProps } from './Field.types'

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      label,
      description,
      descriptionPlacement = 'under-input',
      invalid = false,
      link,
      orientation = 'vertical',
      id,
      className,
    },
    ref,
  ) => {
    const isResponsive = orientation === 'responsive'

    // ── Description node ────────────────────────────────────────────────────
    const descriptionNode = description ? (
      <p
        className={cn(
          'text-sm leading-5',
          invalid ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        {description}
      </p>
    ) : null

    // ── Label row ───────────────────────────────────────────────────────────
    const labelNode = label ? (
      <div className="relative flex w-full items-center">
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-5',
            invalid && 'text-destructive',
          )}
        >
          {label}
        </Label>
        {link && (
          <span className="absolute right-0 top-0 text-sm leading-5 text-foreground">
            {link}
          </span>
        )}
      </div>
    ) : null

    // ── Responsive orientation ───────────────────────────────────────────────
    if (isResponsive) {
      return (
        <div
          ref={ref}
          className={cn('flex w-full items-center gap-4', className)}
        >
          {labelNode}
          {/* Control takes remaining width */}
          <div className="flex-1 min-w-0">{children}</div>
          {descriptionNode}
        </div>
      )
    }

    // ── Vertical orientation (default) ───────────────────────────────────────
    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col gap-1 items-start', className)}
      >
        {labelNode}

        {/* Description under label (before the control) */}
        {descriptionPlacement === 'under-label' && descriptionNode}

        {/* Form control */}
        {children}

        {/* Description under input (after the control) */}
        {descriptionPlacement === 'under-input' && descriptionNode}
      </div>
    )
  },
)
Field.displayName = 'Field'

export { Field }
export default Field
