'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import type { ComboboxProps } from './Combobox.types'

/**
 * Combobox — a searchable select built from Popover + Command.
 *
 * Figma: Combobox / Command Menu - Simple (node 17379:199778)
 *
 * Trigger:
 *   - h-9 (36px), w-full, rounded-md, border border-input, bg-background
 *   - px-4 py-2, shadow-xs
 *   - text-sm; selected value in foreground, placeholder in muted-foreground
 *   - ChevronsUpDown icon (size-4, opacity-50) on the right
 *
 * Dropdown (PopoverContent):
 *   - w-[var(--radix-popover-trigger-width)] so it matches the trigger width
 *   - rounded-md, border, md-shadow, p-0 (Command owns its own padding)
 *
 * Command search bar:
 *   - h-12, border-b, search icon left, text-sm placeholder muted
 *
 * Items:
 *   - rounded-sm, px-2 py-3, hover → accent bg
 *   - selected: Check icon (size-4) shown on the right, ml-auto
 */
const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      value,
      onValueChange,
      options = [],
      placeholder = 'Select…',
      searchPlaceholder = 'Search…',
      emptyText = 'No results found.',
      disabled = false,
      className,
      align = 'start',
      contentClassName,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false)

    const selectedOption = options.find((opt) => opt.value === value)

    const handleSelect = (selectedValue: string) => {
      // Toggle off if same value selected again
      onValueChange?.(selectedValue === value ? '' : selectedValue)
      setOpen(false)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* Trigger button — matches Figma Combobox default state */}
          <button
            ref={ref}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            className={cn(
              // Layout
              'flex h-9 w-full items-center justify-between gap-2',
              // Appearance
              'rounded-md border border-input bg-background shadow-xs',
              // Spacing
              'px-4 py-2',
              // Typography
              'text-sm',
              // States
              'transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:shadow-focus-default',
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Open state keeps the hover look
              open && 'bg-accent text-accent-foreground',
              className,
            )}
          >
            <span
              className={cn(
                'flex-1 truncate text-left',
                !selectedOption && 'text-muted-foreground',
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        {/* Dropdown — matches Figma Command Menu - Simple */}
        <PopoverContent
          align={align}
          sideOffset={4}
          className={cn(
            // Reset PopoverContent defaults (it has p-4 and w-72)
            'w-[var(--radix-popover-trigger-width)] p-0',
            // Use md shadow to match Figma
            'shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]',
            contentClassName,
          )}
        >
          <Command
            // Remove the default shadow from Command since PopoverContent owns it
            className="rounded-md border-0 shadow-none"
          >
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={handleSelect}
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                    {value === option.value && (
                      <Check className="ml-auto size-4 shrink-0" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)
Combobox.displayName = 'Combobox'

export { Combobox }
export default Combobox
