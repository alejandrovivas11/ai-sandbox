'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import * as React from 'react'

export type AlertDialogProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>
export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
export type AlertDialogPortalProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>
export type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
export type AlertDialogContentProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>
export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
export type AlertDialogActionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
export type AlertDialogCancelProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
