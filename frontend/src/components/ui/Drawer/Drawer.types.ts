'use client'

import type { ComponentProps } from 'react'
import { Drawer as VaulDrawer } from 'vaul'

export type DrawerProps = ComponentProps<typeof VaulDrawer.Root>
export type DrawerTriggerProps = ComponentProps<typeof VaulDrawer.Trigger>
export type DrawerPortalProps = ComponentProps<typeof VaulDrawer.Portal>
export type DrawerOverlayProps = ComponentProps<typeof VaulDrawer.Overlay>
export type DrawerContentProps = ComponentProps<typeof VaulDrawer.Content> & {
  /**
   * Side the drawer opens from.
   * - `bottom` — sheet that slides up from the bottom edge (default, Figma "sm" breakpoint / mobile)
   * - `right`  — panel that slides in from the right (Figma "md" breakpoint / side drawer)
   * - `left`   — panel that slides in from the left
   * - `top`    — sheet that slides down from the top
   */
  side?: 'bottom' | 'right' | 'left' | 'top'
}
export type DrawerHandleProps = ComponentProps<typeof VaulDrawer.Handle>
export type DrawerTitleProps = ComponentProps<typeof VaulDrawer.Title>
export type DrawerDescriptionProps = ComponentProps<typeof VaulDrawer.Description>
export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>
export type DrawerCloseProps = ComponentProps<typeof VaulDrawer.Close>
