import * as React from 'react'
import { cn, cva } from '@/lib/utils'
import type { BadgeProps } from './Badge.types'

// Figma node: 300:1086 — Badge component
//
// Sizing:  px-2 (8px) / py-0.5 (2px)  |  text-xs (12px/16px)  |  rounded-full
// Icons:   12×12px, optional left/right slot
//
// Variants & states
// ─────────────────────────────────────────────────────────────────────────────
// default      bg-primary (#171717)    text-primary-foreground (#fafafa)
//              hover: lighten +20% white overlay  → bg-[#3d3d3d] approx
//              focus: shadow-focus-default
//
// secondary    bg-secondary (#f5f5f5)  text-secondary-foreground (#171717)
//              hover: darken +10% black overlay   → bg-[#dcdcdc] approx
//              focus: shadow-focus-default
//
// outline      bg-background (white)   text-foreground (#0a0a0a)   border-border
//              hover: darken +10% black overlay on white → bg-[#e6e6e6] approx
//              focus: shadow-focus-default
//
// destructive  bg-destructive (#dc2626) text-white
//              hover: darken +20% black overlay   → bg-[#af1e1e] approx
//              focus: shadow-focus-destructive
//
// verified     bg-blue-500 (#3b82f6)   text-white   font-semibold
//              hover: darken +20% black overlay   → bg-[#2f68c5] approx
//              focus: shadow-focus-default

export const badgeVariants = cva(
  // Base: layout, shape, typography
  [
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
    'text-xs font-medium leading-4 whitespace-nowrap',
    'border border-transparent transition-colors',
    'focus:outline-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'hover:bg-[#3d3d3d]',
          'focus:shadow-focus-default',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-[#dcdcdc]',
          'focus:shadow-focus-default',
        ],
        outline: [
          'bg-background text-foreground border-border',
          'hover:bg-[#e6e6e6] hover:border-border',
          'focus:shadow-focus-default',
        ],
        destructive: [
          'bg-destructive text-white',
          'hover:bg-[#af1e1e]',
          'focus:shadow-focus-destructive',
        ],
        verified: [
          'bg-blue-500 text-white font-semibold',
          'hover:bg-[#2f68c5]',
          'focus:shadow-focus-default',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

// ─── BadgeCheck icon (12×12) — matches Figma "Icon / BadgeCheck" ──────────────
function BadgeCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <path
        d="M5.25 1.5a.75.75 0 0 1 1.5 0 .75.75 0 0 0 .984.716.75.75 0 0 1 .975 1.3.75.75 0 0 0 0 .968.75.75 0 0 1-.975 1.3.75.75 0 0 0-.984.716.75.75 0 0 1-1.5 0 .75.75 0 0 0-.984-.716.75.75 0 0 1-.975-1.3.75.75 0 0 0 0-.968.75.75 0 0 1 .975-1.3.75.75 0 0 0 .984-.716Z"
        fill="currentColor"
      />
      <path
        d="m4.5 6 1 1 2-2"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {/* Left icon slot — 12×12px */}
        {leftIcon && (
          <span className="inline-flex shrink-0 size-3" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Verified variant always shows BadgeCheck icon */}
        {variant === 'verified' && !leftIcon && (
          <BadgeCheckIcon />
        )}

        {children}

        {/* Right icon slot — 12×12px */}
        {rightIcon && (
          <span className="inline-flex shrink-0 size-3" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </span>
    )
  },
)
Badge.displayName = 'Badge'

export { Badge }
export default Badge
