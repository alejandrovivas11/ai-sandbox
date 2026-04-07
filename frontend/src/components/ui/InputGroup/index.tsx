'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import type { InputGroupProps, InputGroupAddonBlockProps } from './InputGroup.types'

// ---------------------------------------------------------------------------
// InputGroupAddonInline — renders an icon, text, kbd, button, etc. inline
// inside the input's horizontal axis.  It is a simple transparent container;
// callers are responsible for the actual content.
// ---------------------------------------------------------------------------

export function InputGroupAddonInline({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'pointer-events-none flex shrink-0 items-center text-muted-foreground',
        // Allow interactive children (buttons, dropdowns) to receive events
        '[&_button]:pointer-events-auto [&_a]:pointer-events-auto',
        className,
      )}
    >
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// InputGroupAddonBlock — a footer row below the input spanning its full width.
// Splits content into a start (left) slot and an end (right) slot.
// ---------------------------------------------------------------------------

export function InputGroupAddonBlock({ start, end, className }: InputGroupAddonBlockProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 px-3 pt-1.5 pb-2 text-xs text-muted-foreground',
        className,
      )}
    >
      {start && <span className="flex items-center gap-2">{start}</span>}
      {end && <span className="ml-auto flex items-center gap-2">{end}</span>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// InputGroup — wraps Input with optional leading/trailing inline addons and
// an optional block addon (rendered below the input).
//
// Design spec (Figma node 18723:14231):
//   - The outer container shares the same border, background and shadow as the
//     bare Input, so addons appear visually "inside" the field.
//   - Inline addons sit at the left and/or right edge; the Input flex-grows to
//     fill remaining space with its own border removed when addons are present.
//   - A block addon sits flush below the border-box, typically for character
//     counts, status text, or action buttons.
//
// Design tokens used:
//   border-input = #e5e5e5
//   shadow-xs    = 0 1px 2px 0 rgba(0,0,0,0.05)
//   shadow-focus-default     = 0 0 0 3px rgba(163,163,163,0.5)
//   shadow-focus-destructive = 0 0 0 3px rgba(220,38,38,0.2)
// ---------------------------------------------------------------------------

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      leadingAddon,
      trailingAddon,
      blockAddon,
      error,
      disabled,
      placeholder,
      value,
      defaultValue,
      onChange,
      type,
      name,
      id,
      required,
      autoComplete,
      autoFocus,
      inputRef,
      className,
      ...props
    },
    ref,
  ) => {
    const hasInlineAddon = Boolean(leadingAddon || trailingAddon)

    return (
      <div ref={ref} className={cn('flex w-full flex-col', className)} {...props}>
        {/* ── Input row ─────────────────────────────────────────────────────── */}
        {hasInlineAddon ? (
          /*
           * When addons are present we wrap everything in a shared border/shadow
           * container so leading and trailing addons look flush inside the field.
           * The inner <Input> strips its own border and shadow via className.
           */
          <div
            className={cn(
              // Shared container — matches bare Input visual chrome
              'flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs transition-colors',
              // Focus-within mirrors the Input's focus ring
              'focus-within:shadow-focus-default',
              // Error state
              error && 'border-destructive focus-within:shadow-focus-destructive',
              // Disabled
              disabled && 'opacity-50',
            )}
          >
            {leadingAddon && (
              <InputGroupAddonInline>{leadingAddon}</InputGroupAddonInline>
            )}

            {/*
             * The Input renders without its own border/background/shadow so it
             * blends into the shared container.  We also strip its padding-x
             * because the container already provides it.
             */}
            <Input
              ref={inputRef}
              error={error}
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              type={type}
              name={name}
              id={id}
              required={required}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              className={cn(
                // Strip all chrome — the container owns it
                'h-auto flex-1 border-0 bg-transparent p-0 shadow-none',
                // Remove focus ring — the container handles it via focus-within
                'focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none',
              )}
            />

            {trailingAddon && (
              <InputGroupAddonInline>{trailingAddon}</InputGroupAddonInline>
            )}
          </div>
        ) : (
          /* No addons — render a plain Input so it keeps all its own styles */
          <Input
            ref={inputRef}
            error={error}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            type={type}
            name={name}
            id={id}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
          />
        )}

        {/* ── Block addon (below the input) ──────────────────────────────────── */}
        {blockAddon && (
          <InputGroupAddonBlock
            start={blockAddon.start}
            end={blockAddon.end}
            className={blockAddon.className}
          />
        )}
      </div>
    )
  },
)

InputGroup.displayName = 'InputGroup'

export { InputGroup }
export default InputGroup
