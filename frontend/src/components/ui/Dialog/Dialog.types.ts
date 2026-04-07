'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

export type DialogProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
export type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
export type DialogPortalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>
export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
export type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /**
   * Controls the max-width of the dialog panel.
   * - `sm`      — max-w-sm  (~384px)
   * - `default` — max-w-[425px] (Figma "lg" breakpoint, the default)
   * - `lg`      — max-w-2xl (~672px)
   * - `full`    — near full-viewport
   */
  size?: 'sm' | 'default' | 'lg' | 'full'
}

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>
export type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
export type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
