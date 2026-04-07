/**
 * 3Y brand logo component.
 *
 * view="icon"  — hexagonal badge only (36×36)
 * view="full"  — badge + wordmark side-by-side (114×36)
 * color="light" — white text + badge (for dark backgrounds)
 * color="dark"  — dark text + badge (for light backgrounds)
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LogoProps {
  view?: 'full' | 'icon'
  color?: 'light' | 'dark'
  className?: string
}

function Logo({ view = 'full', color = 'dark', className }: LogoProps) {
  const isLight = color === 'light'
  const textColor = isLight ? '#ffffff' : '#0a0a0a'
  const subColor = isLight ? 'rgba(255,255,255,0.6)' : '#737373'

  const badge = (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="8" fill="#4f46e5" />
      <text
        x="18"
        y="24"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="14"
        fill="#ffffff"
      >
        3Y
      </text>
    </svg>
  )

  if (view === 'icon') {
    return (
      <span
        className={cn('inline-flex shrink-0', className)}
        role="img"
        aria-label="3Y Health logo"
      >
        {badge}
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center gap-2.5 shrink-0', className)}
      role="img"
      aria-label="3Y Health logo"
    >
      {badge}
      <span className="flex flex-col leading-none">
        <span
          style={{ color: textColor }}
          className="text-sm font-semibold tracking-tight"
        >
          3Y Health
        </span>
        <span
          style={{ color: subColor }}
          className="text-[11px] font-normal mt-0.5"
        >
          Provider360
        </span>
      </span>
    </span>
  )
}

export { Logo }
export default Logo
