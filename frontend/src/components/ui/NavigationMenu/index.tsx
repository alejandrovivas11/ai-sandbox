'use client'

import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  NavigationMenuProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
  NavigationMenuIndicatorProps,
  NavigationMenuViewportProps,
} from './NavigationMenu.types'

// ─── Root ─────────────────────────────────────────────────────────────────────
// Figma: horizontal flex row, gap-1, items-center
// Wraps List + Viewport in a relative container so the dropdown positions correctly

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'relative z-10 flex items-center gap-1',
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

// ─── List ─────────────────────────────────────────────────────────────────────
// Figma: flex row, gap-1, items-center

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  NavigationMenuListProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'flex flex-1 list-none items-center gap-1',
      className,
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

// ─── Item ─────────────────────────────────────────────────────────────────────
// Thin pass-through — no extra styling needed at this level

const NavigationMenuItem = NavigationMenuPrimitive.Item

// ─── Trigger ──────────────────────────────────────────────────────────────────
// Figma: h-9, px-4, text-sm, font-medium, rounded-md, gap-1
// Hover: bg-accent
// Open state: bg-accent
// ChevronDown icon: size-3, rotates 180° when open

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      'group inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-4 text-sm font-medium',
      'text-foreground outline-none transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      'disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className="relative size-3 shrink-0 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

// ─── Content ──────────────────────────────────────────────────────────────────
// Figma: rounded-lg, p-4, shadow-xs, border border-border, bg-popover
// Positioned inside the shared Viewport — no Portal needed

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full rounded-lg border border-border bg-popover p-4 text-popover-foreground',
      'shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]',
      // Enter animations
      'data-[motion=from-start]:animate-in data-[motion=from-start]:slide-in-from-left-52',
      'data-[motion=from-end]:animate-in data-[motion=from-end]:slide-in-from-right-52',
      // Exit animations
      'data-[motion=to-start]:animate-out data-[motion=to-start]:slide-out-to-left-52',
      'data-[motion=to-end]:animate-out data-[motion=to-end]:slide-out-to-right-52',
      'md:absolute md:w-auto',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

// ─── Link ─────────────────────────────────────────────────────────────────────
// Figma: h-9, px-4, text-sm, font-medium, rounded-md — used when no dropdown
// Hover: bg-accent
// active (data-[active]): bg-accent/50

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={cn(
      'inline-flex h-9 w-max items-center justify-center rounded-md px-4 text-sm font-medium',
      'text-foreground outline-none transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[active]:bg-accent/50',
      'disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName

// ─── Indicator ────────────────────────────────────────────────────────────────
// Small arrow/chevron shown below the active trigger, pointing down toward viewport

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  NavigationMenuIndicatorProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
      'data-[state=visible]:animate-in data-[state=hidden]:animate-out',
      'data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className,
    )}
    {...props}
  >
    {/* Arrow chevron pointing downward */}
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm border border-border bg-popover shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

// ─── Viewport ─────────────────────────────────────────────────────────────────
// Shared animated container that renders Content panels; sits below the menu bar

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)]',
        'w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground',
        'shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90',
        'md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
export default NavigationMenu
