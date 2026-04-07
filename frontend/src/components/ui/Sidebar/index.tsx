'use client'

// Figma file key: U03lZ9ambE98Q3Obgkjs27
// Nodes: 5198:982 (component specs), 5198:1787 (Sidebar 01 full layout), 5143:200
//
// Layout:
//   --sidebar-width: 216px          (expanded)
//   --sidebar-width-collapsed: 40px (icon-rail)
//   transition-[width] duration-200
//
// SidebarMenuButton (Figma: Sidebar / SidebarMenuButton):
//   h-8 px-2 rounded-md text-sm flex items-center gap-2
//   default:  text-sidebar-foreground
//   hover:    bg-accent
//   active:   bg-accent text-foreground font-medium
//   focused:  focus-visible:shadow-focus-default
//
// SidebarMediaAsset (Figma: Sidebar / MediaAsset):
//   Type=Icon   → 16×16 inline-flex wrapper
//   Type=Avatar → 32×32 rounded-full Avatar
//
// SidebarGroupLabel (Figma: Sidebar / SidebarGroupLabel):
//   text-xs font-medium text-muted-foreground uppercase tracking-widest px-2 py-1.5
//
// SidebarMenuSub (Figma: Sidebar / SidebarMenuSub):
//   subStyle: indent | border | default

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Collapsible, CollapsibleContent } from '@/components/ui/Collapsible'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import type {
  SidebarContextValue,
  SidebarProviderProps,
  SidebarProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarGroupActionProps,
  SidebarMenuProps,
  SidebarMenuItemProps,
  SidebarMenuButtonProps,
  SidebarMenuSubProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubButtonProps,
  SidebarMediaAssetProps,
  SidebarTriggerProps,
  SidebarInsetProps,
} from './Sidebar.types'

// ─── CSS variables injected at provider level ──────────────────────────────────
const SIDEBAR_WIDTH = '216px'
const SIDEBAR_WIDTH_COLLAPSED = '40px'

// ─── Context ──────────────────────────────────────────────────────────────────

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebar must be used within a <SidebarProvider>')
  }
  return ctx
}

// ─── SidebarProvider ──────────────────────────────────────────────────────────

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      children,
      defaultOpen = true,
      open: controlledOpen,
      onOpenChange,
      className,
      style,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const setOpen = React.useCallback(
      (value: boolean) => {
        if (isControlled) {
          onOpenChange?.(value)
        } else {
          setInternalOpen(value)
        }
      },
      [isControlled, onOpenChange],
    )

    const toggleSidebar = React.useCallback(() => setOpen(!open), [open, setOpen])

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({ open, setOpen, toggleSidebar }),
      [open, setOpen, toggleSidebar],
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            ref={ref}
            data-sidebar-provider=""
            className={cn('flex min-h-svh w-full', className)}
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-collapsed': SIDEBAR_WIDTH_COLLAPSED,
                ...style,
              } as React.CSSProperties
            }
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  },
)
SidebarProvider.displayName = 'SidebarProvider'

// ─── Sidebar (root panel) ─────────────────────────────────────────────────────

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ side = 'left', className, children, ...props }, ref) => {
    const { open } = useSidebar()

    return (
      <aside
        ref={ref}
        data-sidebar=""
        data-side={side}
        data-state={open ? 'expanded' : 'collapsed'}
        className={cn(
          // Base — Figma: bg-sidebar (--base/sidebar: #fafafa)
          'relative flex h-svh flex-col overflow-hidden bg-sidebar',
          'border-r border-border',
          // Figma: smooth width transition duration-200
          'transition-[width] duration-200 ease-in-out',
          // Width driven by CSS custom properties
          open
            ? 'w-[--sidebar-width]'
            : 'w-[--sidebar-width-collapsed]',
          // Right-side sidebar flips border
          side === 'right' && 'border-r-0 border-l',
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    )
  },
)
Sidebar.displayName = 'Sidebar'

// ─── SidebarHeader ────────────────────────────────────────────────────────────
// Figma: SidebarHeader — flex-col gap-2 p-2

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar-header=""
      className={cn('flex flex-col gap-2 p-2 shrink-0', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
SidebarHeader.displayName = 'SidebarHeader'

// ─── SidebarContent ───────────────────────────────────────────────────────────
// Figma: SidebarContent — flex-1 overflow-y-auto overflow-x-hidden

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar-content=""
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
SidebarContent.displayName = 'SidebarContent'

// ─── SidebarFooter ────────────────────────────────────────────────────────────

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar-footer=""
      className={cn('flex flex-col gap-2 p-2 shrink-0', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
SidebarFooter.displayName = 'SidebarFooter'

// ─── SidebarGroupLabel ────────────────────────────────────────────────────────
// Figma: Sidebar / SidebarGroupLabel
//   text-xs font-medium text-muted-foreground uppercase tracking-widest px-2 py-1.5
//   Variants: Default | Collapsible | Action (sm/xs text size)

const SidebarGroupLabel = React.forwardRef<HTMLParagraphElement, SidebarGroupLabelProps>(
  ({ collapsible = false, open = false, onToggle, className, children, ...props }, ref) => {
    if (collapsible) {
      return (
        <Button
          variant="ghost"
          onClick={onToggle}
          data-sidebar-group-label=""
          data-collapsible="true"
          data-state={open ? 'open' : 'closed'}
          className={cn(
            'flex h-8 w-full justify-between px-2',
            'text-xs font-medium text-muted-foreground uppercase tracking-widest',
            className,
          )}
        >
          <span className="flex-1 truncate text-left">{children}</span>
          <ChevronRight
            className={cn(
              'ml-auto size-3.5 shrink-0 transition-transform duration-200',
              open && 'rotate-90',
            )}
            aria-hidden="true"
          />
        </Button>
      )
    }

    return (
      <p
        ref={ref}
        data-sidebar-group-label=""
        className={cn(
          'flex h-8 items-center px-2 py-1.5',
          'text-xs font-medium text-muted-foreground uppercase tracking-widest',
          'truncate',
          className,
        )}
        {...props}
      >
        {children}
      </p>
    )
  },
)
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

// ─── SidebarGroupAction ───────────────────────────────────────────────────────
// Figma: Sidebar / SidebarGroupAction — 20×20 icon button, absolute top-right of group header

const SidebarGroupAction = React.forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
  ({ label, className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="icon-sm"
      data-sidebar-group-action=""
      aria-label={label}
      className={cn('absolute right-2 top-1.5 size-5 text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Button>
  ),
)
SidebarGroupAction.displayName = 'SidebarGroupAction'

// ─── SidebarGroup ─────────────────────────────────────────────────────────────
// Figma: Sidebar / SidebarGroup — px-5 py-2 flex-col

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ label, className, children, ...props }, ref) => {
    const { open: sidebarOpen } = useSidebar()

    return (
      <div
        ref={ref}
        data-sidebar-group=""
        className={cn('relative flex flex-col px-2 py-2', className)}
        {...props}
      >
        {label && sidebarOpen && (
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
        )}
        {children}
      </div>
    )
  },
)
SidebarGroup.displayName = 'SidebarGroup'

// ─── SidebarMenu ─────────────────────────────────────────────────────────────

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, children, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar-menu=""
      className={cn('flex flex-col gap-0.5', className)}
      {...props}
    >
      {children}
    </ul>
  ),
)
SidebarMenu.displayName = 'SidebarMenu'

// ─── SidebarMenuItem ──────────────────────────────────────────────────────────

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, children, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar-menu-item=""
      className={cn('list-none', className)}
      {...props}
    >
      {children}
    </li>
  ),
)
SidebarMenuItem.displayName = 'SidebarMenuItem'

// ─── SidebarMenuSub ───────────────────────────────────────────────────────────
// Figma: Sidebar / SidebarMenuSub
//   Type=Indent  → pl-6, no decoration
//   Type=Border  → pl-6, left border accent
//   Type=Default → pl-4, no decoration

const SidebarMenuSub = React.forwardRef<HTMLUListElement, SidebarMenuSubProps>(
  ({ subStyle = 'indent', className, children, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar-menu-sub=""
      data-sub-style={subStyle}
      className={cn(
        'flex flex-col gap-0.5 pt-0.5',
        subStyle === 'indent' && 'pl-6',
        subStyle === 'border' && 'pl-6 border-l-2 border-accent ml-2',
        subStyle === 'default' && 'pl-4',
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  ),
)
SidebarMenuSub.displayName = 'SidebarMenuSub'

// ─── SidebarMenuSubItem ───────────────────────────────────────────────────────

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, SidebarMenuSubItemProps>(
  ({ className, children, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar-menu-sub-item=""
      className={cn('list-none', className)}
      {...props}
    >
      {children}
    </li>
  ),
)
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

// ─── SidebarMenuSubButton ─────────────────────────────────────────────────────
// Figma: Sidebar / SidebarMenuSubItem
//   h-7 px-2 rounded-md text-sm
//   default / hover / active / focused states

const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  (
    {
      isActive = false,
      icon,
      withCheckbox = false,
      checked,
      onCheckedChange,
      asChild = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        data-sidebar-menu-sub-button=""
        data-active={isActive || undefined}
        className={cn(
          // Figma: h-7 px-2 rounded-md text-sm flex items-center gap-2
          'flex w-full items-center gap-2 rounded-md px-2',
          'h-7 text-sm text-foreground',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:shadow-focus-default',
          'disabled:pointer-events-none disabled:opacity-50',
          'hover:bg-accent hover:text-accent-foreground',
          isActive && 'bg-accent text-foreground font-medium',
          className,
        )}
        type="button"
        {...props}
      >
        {withCheckbox && (
          <Checkbox
            checked={checked}
            onCheckedChange={(val) => onCheckedChange?.(!!val)}
            className="shrink-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
        {icon && !withCheckbox && (
          <span className="inline-flex shrink-0 size-4 items-center justify-center text-current" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="flex-1 truncate text-left leading-none">{children}</span>
      </Comp>
    )
  },
)
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

// ─── SidebarMediaAsset ────────────────────────────────────────────────────────
// Figma: Sidebar / MediaAsset
//   Type=Icon   → size-4 (16×16) inline-flex wrapper — for icon slot in menu buttons
//   Type=Avatar → size-8 (32×32) rounded-full Avatar  — for avatar slot in header/footer

const SidebarMediaAsset = React.forwardRef<HTMLSpanElement, SidebarMediaAssetProps>(
  ({ type = 'icon', src, alt = '', icon, className }, ref) => {
    if (type === 'avatar') {
      return (
        <Avatar size="8" className={cn('shrink-0', className)}>
          {src && <AvatarImage src={src} alt={alt} />}
          <AvatarFallback size="8">{alt.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    }

    // type === 'icon' — 16×16 wrapper
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex shrink-0 size-4 items-center justify-center text-current',
          className,
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
    )
  },
)
SidebarMediaAsset.displayName = 'SidebarMediaAsset'

// ─── SidebarMenuButton ────────────────────────────────────────────────────────
// Figma: Sidebar / SidebarMenuButton
//
// Variants (Figma Type=):
//   simple        — icon + label
//   collapsible   — icon + label + ChevronRight, toggles sub-menu
//   dropdown      — icon + label + ChevronRight (external popover)
//   tree          — icon + label + ChevronRight, toggles SidebarMenuSub
//   tree+checkbox — Checkbox + icon + label + ChevronRight + SidebarMenuSub
//   badge         — icon + label + Badge
//   checkbox      — Checkbox + label
//   big-icon      — large centred icon (collapsed-only hero style)
//
// States (Figma State=):
//   default  — text-foreground
//   hover    — bg-accent
//   active   — bg-accent text-foreground font-medium
//   focused  — focus-visible:shadow-focus-default
//
// Collapsed (icon rail):
//   label, badge, chevron hidden — tooltip shown via Radix Tooltip

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      variant = 'simple',
      isActive = false,
      icon,
      badge,
      checked,
      onCheckedChange,
      subItems,
      subOpen: controlledSubOpen,
      tooltip,
      asChild = false,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { open: sidebarOpen } = useSidebar()
    const [internalSubOpen, setInternalSubOpen] = React.useState(false)

    const isTreeVariant = variant === 'collapsible' || variant === 'tree' || variant === 'tree+checkbox'
    const hasSubMenu = isTreeVariant && !!subItems
    const subOpen = controlledSubOpen !== undefined ? controlledSubOpen : internalSubOpen

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hasSubMenu) {
        setInternalSubOpen((prev) => !prev)
      }
      onClick?.(e)
    }

    const Comp = asChild ? Slot : 'button'

    const buttonContent = (
      <Comp
        ref={ref}
        data-sidebar-menu-button=""
        data-variant={variant}
        data-active={isActive || undefined}
        data-state={hasSubMenu ? (subOpen ? 'open' : 'closed') : undefined}
        className={cn(
          // Base — Figma: h-8 px-2 rounded-md text-sm flex items-center gap-2
          'group/button relative flex w-full items-center gap-2 rounded-md px-2',
          'h-8 text-sm text-foreground',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:shadow-focus-default',
          'disabled:pointer-events-none disabled:opacity-50',
          // Hover state — Figma: bg-accent
          'hover:bg-accent hover:text-accent-foreground',
          // Active state — Figma: bg-accent text-foreground font-medium
          isActive && 'bg-accent text-foreground font-medium',
          // big-icon: collapsed centred icon — no horizontal padding, justify-center
          variant === 'big-icon' && 'h-12 justify-center px-0',
          className,
        )}
        type="button"
        onClick={handleClick}
        {...props}
      >
        {/* ── tree+checkbox / checkbox — Checkbox slot ──────────────────── */}
        {(variant === 'checkbox' || variant === 'tree+checkbox') && (
          <Checkbox
            checked={checked}
            onCheckedChange={(val) => onCheckedChange?.(!!val)}
            className="shrink-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}

        {/* ── Icon slot (icon via SidebarMediaAsset) ─────────────────────── */}
        {variant !== 'checkbox' && variant !== 'big-icon' && icon && (
          <SidebarMediaAsset type="icon" icon={icon} />
        )}

        {/* ── big-icon: large centred icon always visible ────────────────── */}
        {variant === 'big-icon' && icon && (
          <span className="inline-flex size-5 items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* ── Label — hidden when sidebar is collapsed (icon rail) ─────────── */}
        {variant !== 'big-icon' && sidebarOpen && (
          <span className="flex-1 truncate text-left leading-none">
            {children}
          </span>
        )}

        {/* ── Badge slot — badge variant only, hidden when collapsed ───────── */}
        {variant === 'badge' && sidebarOpen && badge && (
          <span className="ml-auto shrink-0">
            {React.isValidElement(badge) ? (
              badge
            ) : (
              <Badge variant="secondary">{badge}</Badge>
            )}
          </span>
        )}

        {/* ── Chevron — collapsible / dropdown / tree / tree+checkbox ─────── */}
        {(variant === 'collapsible' || variant === 'dropdown' || variant === 'tree' || variant === 'tree+checkbox') && sidebarOpen && (
          <ChevronRight
            className={cn(
              'ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200',
              hasSubMenu && subOpen && 'rotate-90',
            )}
            aria-hidden="true"
          />
        )}
      </Comp>
    )

    // ── Sub-menu panel (collapsible / tree / tree+checkbox) ─────────────────────
    const withSubMenu = hasSubMenu ? (
      <Collapsible open={subOpen} data-sidebar-collapsible="">
        {buttonContent}
        <CollapsibleContent>
          <div className="pt-0.5">{subItems}</div>
        </CollapsibleContent>
      </Collapsible>
    ) : buttonContent

    // ── Tooltip — shown only when sidebar is collapsed (icon rail) ──────────────
    if (!sidebarOpen && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {withSubMenu}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      )
    }

    return withSubMenu
  },
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

// ─── SidebarTrigger ───────────────────────────────────────────────────────────
// Figma: Sidebar / Header Button — 28×28 ghost icon button

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ size = 'icon-sm', className, onClick, ...props }, ref) => {
    const { toggleSidebar, open } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        data-sidebar-trigger=""
        data-state={open ? 'expanded' : 'collapsed'}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        className={cn('shrink-0', className)}
        onClick={(e) => {
          toggleSidebar()
          onClick?.(e)
        }}
        {...props}
      >
        <PanelLeft className="size-4" aria-hidden="true" />
      </Button>
    )
  },
)
SidebarTrigger.displayName = 'SidebarTrigger'

// ─── SidebarInset ─────────────────────────────────────────────────────────────
// Main content area that automatically shifts as sidebar expands / collapses

const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, children, ...props }, ref) => (
    <main
      ref={ref}
      data-sidebar-inset=""
      className={cn('relative flex min-h-svh flex-1 flex-col overflow-hidden', className)}
      {...props}
    >
      {children}
    </main>
  ),
)
SidebarInset.displayName = 'SidebarInset'

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  // Context
  SidebarProvider,
  // Root + structure
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  // Group
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  // Menu
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  // Sub-menu
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  // Media
  SidebarMediaAsset,
  // Controls
  SidebarTrigger,
  SidebarInset,
}

export default Sidebar
