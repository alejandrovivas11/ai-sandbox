'use client'

// Figma node: 18672:2962 — Empty component
//
// Layout:   flex-col, gap-6 (24px), items-center, w-[308px]
// Header:   media icon (size-10, rounded-lg, bg-muted) + title (text-lg/medium) + description (text-sm/normal)
// Content:  one of several action slot layouts below the header copy
//
// Media types (Figma "Empty / Media"):
//   icon         — 40×40 muted rounded square with a centred 24px icon
//   avatar       — 48×48 Avatar component
//   avatar-group — 128×48 AvatarGroup row
//
// Content types (Figma "Empty / Content"):
//   button                — single primary Button
//   2-buttons-vertical    — primary + ghost/link Button stacked
//   2-buttons-horizontal  — two Buttons side by side
//   3-buttons             — primary + two secondary Buttons stacked
//   input-description     — an input slot + muted helper text
//   none                  — no action block

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { EmptyProps } from './Empty.types'

// ─── EmptyMedia ───────────────────────────────────────────────────────────────
// Renders the 40×40 rounded muted square that wraps the icon.
// For avatar / avatar-group types the caller passes the pre-built media node.

function EmptyMedia({
  icon,
  media,
  mediaType = 'icon',
  className,
}: {
  icon?: React.ReactNode
  media?: React.ReactNode
  mediaType?: EmptyProps['mediaType']
  className?: string
}) {
  if (mediaType === 'avatar' || mediaType === 'avatar-group') {
    return (
      <div className={cn('flex shrink-0 items-center justify-center', className)}>
        {media}
      </div>
    )
  }

  // Default: icon inside muted rounded square
  return (
    <div
      className={cn(
        'flex shrink-0 size-10 items-center justify-center rounded-lg bg-muted',
        className,
      )}
    >
      {/* Icon slot — 24×24, inherits text-foreground color */}
      <span className="size-6 flex items-center justify-center [&>svg]:size-6">
        {icon}
      </span>
    </div>
  )
}

// ─── Empty ───────────────────────────────────────────────────────────────────

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      icon,
      mediaType = 'icon',
      media,
      showMedia = true,
      title = 'No results yet',
      showTitle = true,
      description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit interdum hendrerit ex vitae sodales.',
      showDescription = true,
      contentType = '2-buttons-vertical',
      primaryAction,
      secondaryAction,
      tertiaryAction,
      inputSlot,
      inputDescription,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-[308px] flex-col items-center gap-6',
          className,
        )}
        {...props}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex w-full flex-col items-center gap-4">
          {showMedia && (
            <EmptyMedia icon={icon} media={media} mediaType={mediaType} />
          )}

          {/* Title + description */}
          <div className="flex w-full flex-col items-center gap-2 text-center">
            {showTitle && (
              <p className="text-lg font-medium leading-7 text-foreground">
                {title}
              </p>
            )}
            {showDescription && (
              <p className="text-sm font-normal leading-[1.625] text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* ── Content / Actions ──────────────────────────────────────────── */}
        {contentType !== 'none' && (
          <EmptyContent
            contentType={contentType}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            tertiaryAction={tertiaryAction}
            inputSlot={inputSlot}
            inputDescription={inputDescription}
          />
        )}

        {/* Arbitrary children (escape hatch) */}
        {children}
      </div>
    )
  },
)
Empty.displayName = 'Empty'

// ─── EmptyContent (internal) ─────────────────────────────────────────────────
// Chooses between the five Figma-defined action layouts.

function EmptyContent({
  contentType,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  inputSlot,
  inputDescription,
}: Pick<
  EmptyProps,
  | 'contentType'
  | 'primaryAction'
  | 'secondaryAction'
  | 'tertiaryAction'
  | 'inputSlot'
  | 'inputDescription'
>) {
  switch (contentType) {
    // ── Single primary button ─────────────────────────────────────────────
    case 'button':
      return (
        <div className="flex w-full items-center justify-center">
          {primaryAction}
        </div>
      )

    // ── Primary + ghost/link button stacked (Figma default) ──────────────
    case '2-buttons-vertical':
      return (
        <div className="flex w-full flex-col items-center gap-4">
          {primaryAction}
          {secondaryAction}
        </div>
      )

    // ── Two buttons side by side ──────────────────────────────────────────
    case '2-buttons-horizontal':
      return (
        <div className="flex w-full items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )

    // ── Primary + two stacked secondaries ─────────────────────────────────
    case '3-buttons':
      return (
        <div className="flex w-full flex-col items-center gap-4">
          {primaryAction}
          <div className="flex w-full flex-col items-center gap-2">
            {secondaryAction}
            {tertiaryAction}
          </div>
        </div>
      )

    // ── Input + helper description ────────────────────────────────────────
    case 'input-description':
      return (
        <div className="flex w-full flex-col items-center gap-2">
          {inputSlot}
          {inputDescription && (
            <p className="text-xs text-muted-foreground">{inputDescription}</p>
          )}
        </div>
      )

    default:
      return null
  }
}

export { Empty }
export default Empty
