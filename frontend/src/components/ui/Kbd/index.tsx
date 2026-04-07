'use client'

// Figma node: 18665:781 — Kbd component
// Figma node: 18665:995 — KbdGroup component
//
// Kbd sizing:  h-5 (20px) · min-w-5 (20px) · px-1 (4px) · rounded-sm (6px)
// Kbd text:    text-xs (12px) · font-medium · leading-4
// Icons:       12×12px optional left / right slot
//
// background variants
//   default  — bg-muted · text-muted-foreground
//   primary  — bg-white/20 · text-white  (for use on dark surfaces)
//
// KbdGroup types
//   default      — Kbds side-by-side, gap-1 (4px)
//   + separated  — Kbds with a muted "+" separator between them

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { KbdProps, KbdGroupProps } from './Kbd.types'

// ─── Kbd ─────────────────────────────────────────────────────────────────────

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  (
    {
      className,
      background = 'default',
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const isPrimary = background === 'primary'

    return (
      <kbd
        ref={ref}
        className={cn(
          // Layout
          'inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-sm px-1',
          // Typography
          'font-mono text-xs font-medium leading-4 whitespace-nowrap',
          // Variants
          isPrimary
            ? 'bg-white/20 text-white'
            : 'bg-muted text-muted-foreground',
          className,
        )}
        {...props}
      >
        {/* Left icon slot — 12×12 */}
        {leftIcon && (
          <span className="inline-flex shrink-0 size-3 items-center justify-center [&>svg]:size-3" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {children}

        {/* Right icon slot — 12×12 */}
        {rightIcon && (
          <span className="inline-flex shrink-0 size-3 items-center justify-center [&>svg]:size-3" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </kbd>
    )
  },
)
Kbd.displayName = 'Kbd'

// ─── KbdGroup ────────────────────────────────────────────────────────────────

const KbdGroup = React.forwardRef<HTMLDivElement, KbdGroupProps>(
  (
    {
      className,
      type = 'default',
      keys = [],
      background = 'default',
      children,
      ...props
    },
    ref,
  ) => {
    const isSeparated = type === '+ separated'

    // Build the key list from `keys` prop, or fall through to `children`
    const keyNodes = keys.length > 0 ? keys : null

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        {...props}
      >
        {keyNodes
          ? keyNodes.map((key, index) => (
              <React.Fragment key={key + index}>
                {isSeparated && index > 0 && (
                  <span className="text-xs font-normal leading-4 text-muted-foreground select-none">
                    +
                  </span>
                )}
                <Kbd background={background}>{key}</Kbd>
              </React.Fragment>
            ))
          : children}
      </div>
    )
  },
)
KbdGroup.displayName = 'KbdGroup'

export { Kbd, KbdGroup }
export default Kbd
