'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '../Popover'
import type { DatePickerProps, DateRangePickerProps } from './DatePicker.types'

// ─── Single Date Picker ────────────────────────────────────────────────────────

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Pick a date',
      disabled,
      iconPosition = 'left',
      className,
    },
    ref,
  ) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base layout — matches Figma: h-9, w-60, px-3, py-2, gap-2
              'inline-flex h-9 w-[240px] items-center gap-2 whitespace-nowrap rounded-md border border-border bg-background',
              'px-3 py-2 text-sm shadow-xs transition-colors',
              // States
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:shadow-focus-default',
              'disabled:pointer-events-none disabled:opacity-50',
              // Placeholder colour when no value
              !value && 'text-muted-foreground',
              // Icon-right: push icon to end
              iconPosition === 'right' && 'justify-between',
              iconPosition === 'left' && 'justify-start text-left font-normal',
              className,
            )}
          >
            {iconPosition === 'left' && (
              <CalendarIcon className="size-4 shrink-0 opacity-70" />
            )}
            <span className="flex-1 overflow-hidden text-ellipsis text-left">
              {value ? format(value, 'PPP') : placeholder}
            </span>
            {iconPosition === 'right' && (
              <CalendarIcon className="size-4 shrink-0 opacity-70" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Dynamically import Calendar to keep bundle light */}
          <DatePickerCalendar value={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    )
  },
)
DatePicker.displayName = 'DatePicker'

// ─── Inline calendar sub-component ────────────────────────────────────────────
// Lazy-requires react-day-picker so the types file stays minimal.

function DatePickerCalendar({
  value,
  onChange,
}: {
  value?: Date
  onChange?: (date?: Date) => void
}) {
  // Dynamic import avoids SSR issues with react-day-picker v9
  const [DayPicker, setDayPicker] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    import('react-day-picker').then((m) => setDayPicker(() => m.DayPicker))
  }, [])

  if (!DayPicker) return null

  return (
    <DayPicker
      mode="single"
      selected={value}
      onSelect={onChange}
      className="p-3"
    />
  )
}

// ─── Date Range Picker ─────────────────────────────────────────────────────────

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Pick a date range',
      disabled,
      className,
    },
    ref,
  ) => {
    const label = React.useMemo(() => {
      if (!value?.from) return placeholder
      if (!value.to) return format(value.from, 'PPP')
      return `${format(value.from, 'LLL dd, y')} – ${format(value.to, 'LLL dd, y')}`
    }, [value, placeholder])

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            disabled={disabled}
            className={cn(
              'inline-flex h-9 w-[300px] items-center gap-2 rounded-md border border-border bg-background',
              'px-3 py-2 text-sm shadow-xs transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:shadow-focus-default',
              'disabled:pointer-events-none disabled:opacity-50',
              !value?.from && 'text-muted-foreground',
              'justify-start text-left font-normal',
              className,
            )}
          >
            <CalendarIcon className="size-4 shrink-0 opacity-70" />
            <span className="flex-1 overflow-hidden text-ellipsis">{label}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DateRangeCalendar value={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    )
  },
)
DateRangePicker.displayName = 'DateRangePicker'

function DateRangeCalendar({
  value,
  onChange,
}: {
  value?: { from?: Date; to?: Date }
  onChange?: (range?: { from?: Date; to?: Date }) => void
}) {
  const [DayPicker, setDayPicker] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    import('react-day-picker').then((m) => setDayPicker(() => m.DayPicker))
  }, [])

  if (!DayPicker) return null

  return (
    <DayPicker
      mode="range"
      selected={value as any}
      onSelect={onChange as any}
      numberOfMonths={2}
      className="p-3"
    />
  )
}

export { DatePicker, DateRangePicker }
export default DatePicker
