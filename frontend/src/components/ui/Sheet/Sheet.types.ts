'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

export type SheetProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
export type SheetTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
export type SheetPortalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>
export type SheetCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
export type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
export type SheetContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}
export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>
export type SheetTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
export type SheetDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
