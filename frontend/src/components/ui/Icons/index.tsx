/**
 * Custom icon components for the 3Y design system.
 *
 * Covers:
 *  - MatchingStatus   — 16×16 scheduling/availability status indicators
 *  - Icon3YAi         — 3Y AI brand icon (hex crystal, 24 / 32 px)
 *  - FilledColorSquare — 8×8 solid colour swatch dot
 *  - IconLine         — 16×16 solid separator line
 *  - IconDashedLine   — 16×16 dashed separator line
 *  - IconDashboard, IconList, IconChartBar, IconCirclePlus, IconBrightness
 *    — custom 16×16 utility icons not present in lucide-react
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Matching Status ──────────────────────────────────────────────────────────

export type MatchingStatusValue =
  | 'Completed'
  | 'Active'
  | 'Scheduled'
  | 'Cancelled'
  | 'Tentative Proposed'
  | 'Tentative Confirmed'
  | 'Available'
  | 'Blocked'

export interface MatchingStatusProps {
  status: MatchingStatusValue
  className?: string
}

const STATUS_COLORS: Record<MatchingStatusValue, string> = {
  Completed: 'text-green-600',
  Active: 'text-blue-600',
  Scheduled: 'text-violet-600',
  Cancelled: 'text-red-500',
  'Tentative Proposed': 'text-amber-500',
  'Tentative Confirmed': 'text-amber-600',
  Available: 'text-emerald-500',
  Blocked: 'text-neutral-400',
}

function MatchingStatus({ status, className }: MatchingStatusProps) {
  const colorClass = STATUS_COLORS[status]

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-label={status}
      role="img"
      className={cn('shrink-0', colorClass, className)}
    >
      {status === 'Completed' && (
        <>
          <rect x="1" y="1" width="14" height="14" rx="3" fill="currentColor" />
          <path
            d="M4.5 8.25L6.75 10.5L11.5 5.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {status === 'Active' && (
        <circle cx="8" cy="8" r="7" fill="currentColor" />
      )}
      {status === 'Scheduled' && (
        <>
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 5V8.25L10.25 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {status === 'Cancelled' && (
        <>
          <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      {status === 'Tentative Proposed' && (
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      )}
      {status === 'Tentative Confirmed' && (
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      )}
      {status === 'Available' && (
        <circle
          cx="8"
          cy="8"
          r="6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      )}
      {status === 'Blocked' && (
        <>
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M4.5 11.5L11.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}

// ─── 3Y AI Icon ───────────────────────────────────────────────────────────────

export interface Icon3YAiProps {
  /** Render variant. Default = outline only */
  variant?: 'default' | 'filled' | 'filled-stroke'
  size?: 24 | 32
  className?: string
}

function Icon3YAi({ variant = 'default', size = 24, className }: Icon3YAiProps) {
  const id = React.useId()
  const gradId = `3yai-grad-${id}`

  // Hexagonal crystal paths — front face + side face for 3D effect
  const scale = size / 24
  const pts = (coords: [number, number][]) =>
    coords.map(([x, y]) => `${x * scale},${y * scale}`).join(' ')

  // Main hexagon (front face)
  const hex: [number, number][] = [
    [12, 2], [20.66, 7], [20.66, 17], [12, 22], [3.34, 17], [3.34, 7],
  ]
  // Right face (shading)
  const rightFace: [number, number][] = [
    [12, 2], [20.66, 7], [20.66, 17], [12, 22],
  ]

  const isFilled = variant === 'filled' || variant === 'filled-stroke'
  const hasStroke = variant === 'filled-stroke' || variant === 'default'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label="3Y AI"
      role="img"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <polygon
        points={pts(hex)}
        fill={isFilled ? `url(#${gradId})` : 'none'}
        stroke={hasStroke ? (isFilled ? 'rgba(0,0,0,0.15)' : 'currentColor') : 'none'}
        strokeWidth={isFilled ? 0.5 : 1.5}
        strokeLinejoin="round"
      />
      {isFilled && (
        <polygon
          points={pts(rightFace)}
          fill="rgba(0,0,0,0.12)"
        />
      )}
    </svg>
  )
}

// ─── Filled Colour Square ─────────────────────────────────────────────────────

export interface FilledColorSquareProps {
  color?: string
  className?: string
}

function FilledColorSquare({ color = 'currentColor', className }: FilledColorSquareProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <rect x="4" y="4" width="8" height="8" rx="1.5" fill={color} />
    </svg>
  )
}

// ─── Line / Dashed Line ───────────────────────────────────────────────────────

export interface IconLineProps {
  dashed?: boolean
  className?: string
}

function IconLine({ dashed = false, className }: IconLineProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0 text-border', className)}
    >
      <line
        x1="8"
        y1="1"
        x2="8"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={dashed ? '3 2' : undefined}
      />
    </svg>
  )
}

function IconDashedLine({ className }: { className?: string }) {
  return <IconLine dashed className={className} />
}

// ─── Custom Utility Icons (16 × 16) ──────────────────────────────────────────

type SvgIconProps = { className?: string }

/** 4-quadrant dashboard / overview icon */
function IconDashboard({ className }: SvgIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('shrink-0', className)}>
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.25" fill="currentColor" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.25" fill="currentColor" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.25" fill="currentColor" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1.25" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

/** Horizontal list / menu icon */
function IconList({ className }: SvgIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('shrink-0', className)}>
      <rect x="1.5" y="3.5" width="2" height="2" rx="1" fill="currentColor" />
      <line x1="5.5" y1="4.5" x2="14.5" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="1.5" y="7" width="2" height="2" rx="1" fill="currentColor" />
      <line x1="5.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="1.5" y="10.5" width="2" height="2" rx="1" fill="currentColor" />
      <line x1="5.5" y1="11.5" x2="14.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** Bar chart / analytics icon */
function IconChartBar({ className }: SvgIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('shrink-0', className)}>
      <rect x="1.5" y="8" width="3" height="6.5" rx="0.75" fill="currentColor" opacity="0.5" />
      <rect x="6.5" y="4.5" width="3" height="10" rx="0.75" fill="currentColor" opacity="0.75" />
      <rect x="11.5" y="1.5" width="3" height="13" rx="0.75" fill="currentColor" />
    </svg>
  )
}

/** Circle with a plus (+) inside */
function IconCirclePlus({ className }: SvgIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('shrink-0', className)}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** Brightness / sun icon */
function IconBrightness({ className }: SvgIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('shrink-0', className)}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.4 3.4L4.4 4.4M11.6 11.6L12.6 12.6M12.6 3.4L11.6 4.4M4.4 11.6L3.4 12.6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  MatchingStatus,
  Icon3YAi,
  FilledColorSquare,
  IconLine,
  IconDashedLine,
  IconDashboard,
  IconList,
  IconChartBar,
  IconCirclePlus,
  IconBrightness,
}
