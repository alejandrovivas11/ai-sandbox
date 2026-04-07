'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type {
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from './Dialog.types'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// ─── Overlay ─────────────────────────────────────────────────────────────────
// Figma: fixed inset-0, semi-transparent black backdrop

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// ─── Content ──────────────────────────────────────────────────────────────────
// Figma lg: w-[425px], max-w-[425px], p-6, rounded-lg, shadow-lg, gap-4
// Figma sm: narrower but same pattern — we expose a `size` prop for variants

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size = 'default', ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Positioning
        'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
        // Layout — flex-col to stack Header / content / Footer
        'flex w-full flex-col gap-4',
        // Visual — matches Figma: border, bg, p-6, rounded-lg, shadow-lg
        'border border-border bg-background p-6 rounded-lg shadow-lg',
        // Animation
        'duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        // Sizes
        size === 'sm' && 'max-w-sm',
        size === 'default' && 'max-w-[425px]',
        size === 'lg' && 'max-w-2xl',
        size === 'full' && 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
        className,
      )}
      {...props}
    >
      {children}
      {/* Close button — Figma: absolute top-[15px] right-[15px], 16×16, opacity-70 */}
      <DialogPrimitive.Close asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-4 top-4"
          aria-label="Close"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// ─── Header ───────────────────────────────────────────────────────────────────
// Figma: flex-col, gap-[6px] (gap-1.5), items-start, w-full
// Title: text-lg / semibold / leading-none
// Description: text-sm / normal / muted-foreground

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div
    className={cn('flex flex-col gap-1.5 text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

// ─── Footer ───────────────────────────────────────────────────────────────────
// Figma: flex row, gap-2, items-center, justify-end

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn('flex flex-row items-center justify-end gap-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

// ─── Title ────────────────────────────────────────────────────────────────────
// Figma: text-lg / font-semibold / leading-none

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// ─── Description ─────────────────────────────────────────────────────────────
// Figma: text-sm / normal / muted-foreground / leading-normal

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-normal', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
export default Dialog
