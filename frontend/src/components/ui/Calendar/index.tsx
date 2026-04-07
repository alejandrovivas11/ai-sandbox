'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../Button'
import type { CalendarProps } from './Calendar.types'

// ---------------------------------------------------------------------------
// Token constants (from design spec)
// ---------------------------------------------------------------------------
// Container:  bg-background border border-border rounded-lg shadow-sm p-3
// Day cell:   size-8 (32 × 32 px), rounded-md
// Selected:   bg-primary text-primary-foreground rounded-md
// Today:      bg-accent text-accent-foreground rounded-md
// Outside:    text-muted-foreground
// Disabled:   text-muted-foreground opacity-50 pointer-events-none
// Range:      start/end get bg-primary + rounded pill on joining side only;
//             middle days get bg-accent text-accent-foreground, square
// Caption:    text-sm font-medium text-foreground
// Day header: text-xs text-muted-foreground, size-8 centered
// Nav button: size-8 inline-flex items-center justify-center rounded-md
//             hover:bg-accent hover:text-accent-foreground
// ---------------------------------------------------------------------------

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          // Container — matches Figma: bg-white border rounded-lg shadow-sm p-3
          'bg-background border border-border rounded-lg shadow-sm p-3',
          className,
        )}
        classNames={{
          // ── Layout ──────────────────────────────────────────────────────
          months: 'flex gap-4',
          month: 'flex flex-col gap-4',
          month_caption: 'flex h-8 items-center justify-center relative',
          caption_label: 'text-sm font-medium text-foreground',

          // ── Navigation ──────────────────────────────────────────────────
          nav: 'absolute inset-x-0 top-0 h-8 flex items-center justify-between pointer-events-none',
          button_previous: cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'size-8 pointer-events-auto',
          ),
          button_next: cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'size-8 pointer-events-auto',
          ),

          // ── Grid / weeks ────────────────────────────────────────────────
          month_grid: 'w-full',
          weekdays: 'flex',
          weekday:
            'size-8 flex items-center justify-center text-xs text-muted-foreground font-normal select-none',
          week: 'flex mt-2',

          // ── Day cells ───────────────────────────────────────────────────
          day: cn(
            // Base day cell — no bg, no rounding applied here; state modifiers below add those
            'relative size-8 flex items-center justify-center p-0 text-sm font-normal',
            'focus-within:relative focus-within:z-20',
          ),
          day_button: cn(
            // The inner <button> that the user actually clicks
            'size-8 flex items-center justify-center rounded-md text-sm font-normal',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:shadow-focus-default',
            'disabled:pointer-events-none disabled:opacity-50',
          ),

          // ── State modifiers ─────────────────────────────────────────────
          selected:
            '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary/90 [&>button]:hover:text-primary-foreground',
          today:
            '[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:hover:bg-accent/80',
          outside:
            'text-muted-foreground opacity-50 [&>button]:text-muted-foreground',
          disabled:
            'text-muted-foreground opacity-50 [&>button]:pointer-events-none',
          hidden: 'invisible',

          // ── Range selection ─────────────────────────────────────────────
          // react-day-picker v9 uses these modifier class names for range:
          range_start: cn(
            // The selected start-cap: inner button is filled primary, outer
            // wrapper gets accent bg only on the right half (→ left-rounded pill)
            'bg-accent rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:rounded-md',
          ),
          range_end: cn(
            // End-cap: accent on the left half
            'bg-accent rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:rounded-md',
          ),
          range_middle: cn(
            // Middle days: full accent strip, square edges, dark text
            'bg-accent rounded-none [&>button]:bg-transparent [&>button]:text-accent-foreground [&>button]:hover:bg-accent/80',
          ),

          // ── Week numbers (if enabled) ────────────────────────────────────
          week_number:
            'size-8 flex items-center justify-center text-xs text-muted-foreground select-none',

          ...classNames,
        }}
        components={{
          Chevron: ({ orientation: chevronOrientation }) =>
            chevronOrientation === 'left' ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            ),
        }}
        {...props}
      />
    )
}

Calendar.displayName = 'Calendar'

export { Calendar }
export default Calendar
