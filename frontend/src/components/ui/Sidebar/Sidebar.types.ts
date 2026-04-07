import * as React from 'react'

// ─── Context ──────────────────────────────────────────────────────────────────

export interface SidebarContextValue {
  /** Whether the sidebar is expanded (true) or collapsed to icon rail (false) */
  open: boolean
  /** Toggle or explicitly set open state */
  setOpen: (open: boolean) => void
  /** Toggles open ↔ collapsed */
  toggleSidebar: () => void
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface SidebarProviderProps {
  children: React.ReactNode
  /** Initial open state — defaults to true (expanded) */
  defaultOpen?: boolean
  /** Controlled open state */
  open?: boolean
  /** Called when the open state changes (controlled mode) */
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'left' */
  side?: 'left' | 'right'
  className?: string
}

// ─── Structure ────────────────────────────────────────────────────────────────

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional visible group label — hidden in collapsed state.
   * Renders as a SidebarGroupLabel internally.
   */
  label?: string
}

// ─── SidebarGroupLabel ────────────────────────────────────────────────────────
// Figma: text-xs font-medium text-muted-foreground uppercase tracking-widest px-2 py-1.5

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * When true the label is rendered as a collapsible toggle (chevron appended).
   * @default false
   */
  collapsible?: boolean
  /** Whether the associated collapsible group is open */
  open?: boolean
  /** Called when the collapsible toggle is clicked */
  onToggle?: () => void
}

// ─── SidebarGroupAction ───────────────────────────────────────────────────────
// Small icon-button positioned absolutely in the group header row (e.g. "+" add)

export interface SidebarGroupActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for screen-readers */
  label?: string
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}
export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

// ─── SidebarMenuSub ───────────────────────────────────────────────────────────
// Indented sub-list rendered inside a collapsible/tree menu item.
// Figma variants: indent | border | default

export type SidebarMenuSubStyle = 'indent' | 'border' | 'default'

export interface SidebarMenuSubProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Visual indentation / decoration style.
   * - indent  — plain left padding (Figma: Type=Indent)
   * - border  — left border accent line (Figma: Type=Border)
   * - default — no decoration (Figma: Type=Default)
   * @default 'indent'
   */
  subStyle?: SidebarMenuSubStyle
}

// ─── SidebarMenuSubItem ───────────────────────────────────────────────────────
// Figma: h-7 px-2 text-sm, states: default / hover / active / focused

export interface SidebarMenuSubItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export interface SidebarMenuSubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether this sub-item is the active route */
  isActive?: boolean
  /** Icon element at 16×16 */
  icon?: React.ReactNode
  /** Checkbox variant for tree+checkbox sub-items */
  withCheckbox?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Render as child element (Radix Slot) */
  asChild?: boolean
}

// ─── SidebarMenuButton ────────────────────────────────────────────────────────

export type SidebarMenuButtonVariant =
  | 'simple'
  | 'collapsible'
  | 'dropdown'
  | 'tree'
  | 'tree+checkbox'
  | 'badge'
  | 'checkbox'
  | 'big-icon'

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual/behavioral variant — maps directly to Figma Type= variants */
  variant?: SidebarMenuButtonVariant
  /** Whether this item is the currently active route */
  isActive?: boolean
  /** Icon element rendered at 16×16 inside a SidebarMediaAsset slot */
  icon?: React.ReactNode
  /** Badge content — rendered only in badge variant */
  badge?: React.ReactNode
  /** Checkbox checked state — used in checkbox / tree+checkbox variants */
  checked?: boolean
  /** Called when checkbox changes */
  onCheckedChange?: (checked: boolean) => void
  /** Sub-menu items — used in collapsible / tree / tree+checkbox variants */
  subItems?: React.ReactNode
  /** Whether the collapsible sub-menu is open (controlled) */
  subOpen?: boolean
  /** Tooltip label shown in collapsed icon-rail state */
  tooltip?: string
  /** Use Radix Slot — render as child element */
  asChild?: boolean
}

// ─── Media Asset (icon or avatar in menu buttons) ─────────────────────────────
// Figma: Type=Icon  → 16×16 icon wrapper
//        Type=Avatar → 32×32 rounded-full Avatar

export interface SidebarMediaAssetProps {
  /**
   * Render as avatar (shows image/fallback) — otherwise renders as icon wrapper.
   * Figma: Icon=16×16, Avatar=32×32
   * @default 'icon'
   */
  type?: 'icon' | 'avatar'
  /** Avatar image src */
  src?: string
  /** Avatar alt / fallback initials */
  alt?: string
  /** Icon element (16×16) */
  icon?: React.ReactNode
  className?: string
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default 'icon-sm' renders as a 32×32 ghost icon button */
  size?: 'icon-sm' | 'icon'
}

// ─── Inset ────────────────────────────────────────────────────────────────────

export interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {}
