'use client'

import * as React from 'react'
import { Drawer as VaulDrawer } from 'vaul'
import { cn } from '@/lib/utils'
import type {
  DrawerProps,
  DrawerTriggerProps,
  DrawerPortalProps,
  DrawerOverlayProps,
  DrawerContentProps,
  DrawerHandleProps,
  DrawerHeaderProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerCloseProps,
} from './Drawer.types'

// ─── Root ─────────────────────────────────────────────────────────────────────

const Drawer = ({ shouldScaleBackground = true, ...props }: DrawerProps) => (
  <VaulDrawer.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = 'Drawer'

// ─── Trigger ──────────────────────────────────────────────────────────────────

const DrawerTrigger = VaulDrawer.Trigger

// ─── Portal ───────────────────────────────────────────────────────────────────

const DrawerPortal = VaulDrawer.Portal

// ─── Close ────────────────────────────────────────────────────────────────────

const DrawerClose = VaulDrawer.Close

// ─── Overlay ─────────────────────────────────────────────────────────────────
// Figma: fixed inset-0, semi-transparent black bg

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <VaulDrawer.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/50', className)}
    {...props}
  />
))
DrawerOverlay.displayName = 'DrawerOverlay'

// ─── Content ─────────────────────────────────────────────────────────────────
// Figma bottom drawer: rounded-tl-[10px] rounded-tr-[10px], white bg, border-top + sides
// Figma side drawer:   full-height panel, border-l, rounded-tr-lg + rounded-br-lg

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Content>,
  DrawerContentProps
>(({ className, children, side = 'bottom', ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <VaulDrawer.Content
      ref={ref}
      className={cn(
        'fixed z-50 flex flex-col bg-background',
        'border-border',
        // Bottom drawer (mobile / Figma sm breakpoint)
        side === 'bottom' && [
          'bottom-0 left-0 right-0',
          'rounded-t-lg border-t border-l border-r',
          'max-h-[85vh]',
        ],
        // Top drawer
        side === 'top' && [
          'top-0 left-0 right-0',
          'rounded-b-lg border-b border-l border-r',
          'max-h-[85vh]',
        ],
        // Right side drawer (desktop / Figma md breakpoint)
        side === 'right' && [
          'right-0 top-0 bottom-0',
          'rounded-l-lg border-l',
          'w-[min(420px,85vw)]',
        ],
        // Left side drawer
        side === 'left' && [
          'left-0 top-0 bottom-0',
          'rounded-r-lg border-r',
          'w-[min(420px,85vw)]',
        ],
        className,
      )}
      {...props}
    >
      {/* Drag handle — only shown for bottom/top drawers */}
      {(side === 'bottom' || side === 'top') && (
        <div className="mx-auto mt-4 h-2 w-[120px] shrink-0 rounded-full bg-muted" />
      )}
      {children}
    </VaulDrawer.Content>
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

// ─── Header ───────────────────────────────────────────────────────────────────
// Figma: flex-col, gap-[6px], p-4, items-start

const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => (
  <div
    className={cn('flex flex-col gap-1.5 p-4 text-left', className)}
    {...props}
  />
)
DrawerHeader.displayName = 'DrawerHeader'

// ─── Footer ───────────────────────────────────────────────────────────────────
// Figma: flex-col, gap-2, p-4 (stacked buttons — full-width on mobile)

const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => (
  <div
    className={cn('flex flex-col gap-2 p-4', className)}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

// ─── Title ────────────────────────────────────────────────────────────────────
// Figma: text-lg / font-semibold / leading-none

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <VaulDrawer.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none', className)}
    {...props}
  />
))
DrawerTitle.displayName = 'DrawerTitle'

// ─── Description ─────────────────────────────────────────────────────────────
// Figma: text-sm / normal / muted-foreground

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <VaulDrawer.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-normal', className)}
    {...props}
  />
))
DrawerDescription.displayName = 'DrawerDescription'

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
export default Drawer
