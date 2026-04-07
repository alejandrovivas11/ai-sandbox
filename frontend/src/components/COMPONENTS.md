# Component Inventory

All 54 UI components in the 3Y Design System. Import everything from `@/components/ui`.

**Figma file:** [`U03lZ9ambE98Q3Obgkjs27`](https://www.figma.com/design/U03lZ9ambE98Q3Obgkjs27/3Y-Design-System)

---

## Primitives

Simple, single-purpose building blocks. No sub-components beyond their Radix primitive wrapper.

| Component | Import | Figma node | Notes |
|---|---|---|---|
| **Avatar** | `Avatar, AvatarImage, AvatarFallback` | `23:994` | Sizes: sm/default/md/lg. Always `rounded-full` |
| **Badge** | `Badge, badgeVariants` | `17318:4790` | Variants: default/secondary/destructive/outline |
| **Button** | `Button, buttonVariants` | `37:931` | Variants: default/secondary/destructive/outline/ghost/link. Sizes: lg/default/sm/icon/icon-sm/icon-lg. `isLoading` prop |
| **Checkbox** | `Checkbox` | `46:112` | 16×16px. States: unchecked/checked/indeterminate/disabled |
| **Input** | `Input` | `65:533` | h-9. `leadingIcon`/`trailingIcon` slots. States: default/filled/focus/disabled/error |
| **Kbd** | `Kbd, KbdGroup` | `18679:17681` | `background`: default/primary. `KbdGroup` type: default/`+ separated` |
| **Label** | `Label` | `18491:22393` | Wraps Radix Label. `font-medium text-sm` |
| **Progress** | `Progress` | `334:6348` | `h-2 rounded-full`. Track: `bg-secondary`. Fill: `bg-primary` |
| **RadioGroup** | `RadioGroup, RadioGroupItem` | `367:3333` | 16px circle. Filled-dot selected state |
| **Separator** | `Separator` | `302:6136` | 1px `bg-border`. Horizontal/vertical |
| **Skeleton** | `Skeleton` | — | Shimmer placeholder. Arbitrary size |
| **Slider** | `Slider` | `302:6082` | `h-2` track, `bg-primary` thumb with `border-2 border-background` |
| **Spinner** | `Spinner` | `18679:25311` | Lucide `LoaderCircle`. Sizes: xs/sm/default/lg/xl |
| **Switch** | `Switch` | `302:6030` | 36×20px track. `bg-input` unchecked, `bg-primary` checked |
| **Textarea** | `Textarea` | `366:211` | `min-h-[80px] resize-y`. Same states as Input |
| **Toggle** | `Toggle, toggleVariants` | `301:4574` | Variants: default/outline. Sizes: sm/default/lg |
| **ToggleGroup** | `ToggleGroup, ToggleGroupItem` | `301:4395` | Propagates variant/size via context. `orientation`: horizontal/vertical |

---

## Composites

Composed from multiple primitives or Radix sub-components. Exported as named sub-component sets.

### Layout & Content

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **Card** | `Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter` | `18491:22192` | `rounded-lg shadow-xs border border-border` |
| **Empty** | `Empty` | `18678:17293` | Media slot (icon/avatar), `contentType` prop for 5 action layouts |
| **Item** | `Item` | `18709:94348` | Variants: default/outline/muted. Sizes: default/small. Media + actions slots |
| **Typography** | `H1, H2, H3, H4, P, Lead, Large, Small, Muted, Blockquote, InlineCode` | `17047:205217` | Semantic text components |

### Feedback

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **Alert** | `Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription, AlertAction` | — | Variants: default/destructive. Flex-row layout |

### Form

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **ButtonGroup** | `ButtonGroup` | — | Groups Buttons with merged borders. `orientation`: horizontal/vertical |
| **Calendar** | `Calendar` | `18491:22264` | react-day-picker v9. Mode: single/multiple/range |
| **Combobox** | `Combobox` | — | Popover + Command pattern. Controlled via `value`/`onValueChange` |
| **DatePicker** | `DatePicker` | — | Button + Popover + Calendar. `iconPosition`: left/right |
| **Field** | `Field` | `18748:157933` | Label + control + hint/error wrapper. `invalid` prop, `description` prop |
| **Form** | `Form, FormField, FormLabel, FormControl, FormDescription, FormMessage` | `477:10193` | Structural wrappers around `<form>`. No controlled-form library |
| **Input Group** | `InputGroup, InputGroupAddonInline, InputGroupAddonBlock` | `18723:14231` | Wraps Input with leading/trailing addons and optional block addon |
| **InputOTP** | `InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator` | `430:17451` | input-otp. Configurable slot count |
| **Select** | `Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton` | `466:4252` | h-9 trigger. Inline item layout with check indicator |

### Navigation

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **Breadcrumb** | `Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis` | — | Semantic nav with separator and ellipsis |
| **Menubar** | `Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarCheckboxItem, MenubarRadioItem, MenubarRadioGroup, MenubarLabel, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubTrigger, MenubarSubContent, MenubarPortal` | `430:17316` | @radix-ui/react-menubar |
| **NavigationMenu** | `NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport` | `466:3596` | @radix-ui/react-navigation-menu. Horizontal top nav with dropdowns |
| **Pagination** | `Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis` | `399:421` | Reuses Button (ghost + primary variants) |
| **Sidebar** | `SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupAction, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarMediaAsset, SidebarTrigger, SidebarInset, useSidebar` | `5198:982` | Collapsible rail. `--sidebar-width`: 216px / 40px. Button variants: simple/collapsible/dropdown/tree/tree+checkbox/badge/checkbox/big-icon |
| **Tabs** | `Tabs, TabsList, TabsTrigger, TabsContent` | `301:5934` | `bg-muted` list, `shadow-xs` active trigger |

### Data Display

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **Chart** | `ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent` | `18491:22276` | Recharts wrapper. Pass `config: ChartConfig` to `ChartContainer` |
| **DataTable** | `DataTable, createSelectionColumn` | — | @tanstack/react-table. Sorting, row selection, pagination built-in |
| **ScrollArea** | `ScrollArea, ScrollBar` | `18597:82883` | 6px scrollbar, transparent track, `rounded-full` thumb |
| **Table** | `Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption` | `430:15410` | `h-10` head, `py-3 px-4` cells |

### Overlays & Dialogs

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **AlertDialog** | `AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel` | — | Action/Cancel use Button component internally |
| **Dialog** | `Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription` | — | Size prop: sm/default/lg/full. Close uses Button |
| **Drawer** | `Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose, DrawerOverlay, DrawerPortal` | — | vaul-based. `direction`: bottom/right/left/top |
| **Sheet** | `Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription` | `424:7191` | Side: top/right/bottom/left. Padding in Header/Footer |

### Floating UI

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **HoverCard** | `HoverCard, HoverCardTrigger, HoverCardContent` | `399:166` | `w-80 rounded-lg shadow-md bg-popover` |
| **Popover** | `Popover, PopoverTrigger, PopoverContent, PopoverAnchor` | `302:8459` | `w-80 rounded-lg shadow-md bg-popover p-4` |
| **Tooltip** | `Tooltip, TooltipTrigger, TooltipContent, TooltipProvider` | `122:10` | `rounded-md border border-border shadow-xs text-sm bg-popover` |

### Rich Controls

| Component | Imports | Figma node | Notes |
|---|---|---|---|
| **Accordion** | `Accordion, AccordionItem, AccordionTrigger, AccordionContent` | — | Types: single/multiple. Chevron animates |
| **Collapsible** | `Collapsible, CollapsibleTrigger, CollapsibleContent` | — | Single collapsible section |
| **Command** | `Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator` | — | cmdk. `h-12` input |
| **ContextMenu** | `ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup` | — | Right-click menu |
| **DropdownMenu** | `DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup` | — | `rounded-md border border-border bg-popover p-1 shadow-xs` |

---

## Import examples

```tsx
// Single component
import { Button } from '@/components/ui/Button'

// Multiple from barrel
import { Button, Input, Label, Badge } from '@/components/ui'

// Type-only import
import type { ChartConfig } from '@/components/ui'

// Hook
import { useSidebar } from '@/components/ui'
```

---

## Primitive vs. Composite

**Primitives** — Use these as leaf nodes inside any layout:

```
Avatar · Badge · Button · Checkbox · Input · Kbd · Label
Progress · RadioGroup · Separator · Skeleton · Slider · Spinner
Switch · Textarea · Toggle · ToggleGroup
```

**Composites** — Built from primitives; follow their sub-component structure:

```
Accordion · Alert · AlertDialog · Breadcrumb · ButtonGroup
Calendar · Card · Chart · Collapsible · Combobox · Command
ContextMenu · DataTable · DatePicker · Dialog · Drawer
DropdownMenu · Empty · Field · Form · HoverCard · InputGroup
InputOTP · Item · Menubar · NavigationMenu · Pagination
Popover · ScrollArea · Select · Sheet · Sidebar · Table
Tabs · Tooltip · Typography
```

---

## Adding to this inventory

When you add a new component, append a row to the relevant table above with:
- Component name (bold)
- Named exports
- Figma node ID (format: `XXXXX:XXXXX`)
- One-line note about key props or design decisions
