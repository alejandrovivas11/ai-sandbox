// ─── Primitives ───────────────────────────────────────────────────────────────
export { Button, buttonVariants } from './Button'
export { Badge, badgeVariants } from './Badge'
export { Avatar, AvatarImage, AvatarFallback } from './Avatar'
export { Input } from './Input'
export { Label } from './Label'
export { Textarea } from './Textarea'
export { Checkbox } from './Checkbox'
export { Switch } from './Switch'
export { RadioGroup, RadioGroupItem } from './RadioGroup'
export { Slider } from './Slider'
export { Progress } from './Progress'
export { Toggle, toggleVariants } from './Toggle'
export { ToggleGroup, ToggleGroupItem } from './ToggleGroup'
export { Separator } from './Separator'
export { Spinner } from './Spinner'
export { Skeleton } from './Skeleton'
export { Kbd, KbdGroup } from './Kbd'

// ─── Composites ───────────────────────────────────────────────────────────────
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card'

export { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription, AlertAction } from './Alert'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table'

export { ScrollArea, ScrollBar } from './ScrollArea'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './Breadcrumb'

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './Pagination'

export {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
  InlineCode,
} from './Typography'

// ─── Overlays & Dialogs ───────────────────────────────────────────────────────
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
} from './Dialog'

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog'

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './Sheet'

// ─── Navigation & Menus ───────────────────────────────────────────────────────
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './DropdownMenu'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from './ContextMenu'

// ─── Floating / Overlay UI ────────────────────────────────────────────────────
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './Popover'
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './Tooltip'
export { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

// ─── Form Controls ────────────────────────────────────────────────────────────
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './Select'

export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion'

export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible'

// ─── Rich Controls ────────────────────────────────────────────────────────────
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './Command'

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from './InputOTP'

export { DatePicker } from './DatePicker'

export { ButtonGroup } from './ButtonGroup'

export { Calendar } from './Calendar'

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './Chart'
export type { ChartConfig } from './Chart'

export { Combobox } from './Combobox'

export { DataTable, createSelectionColumn } from './DataTable'

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
} from './Drawer'

// ─── Brand & Icons ────────────────────────────────────────────────────────────
export { Logo } from './Logo'
export type { LogoProps } from './Logo'

export {
  MatchingStatus,
  Icon3YAi,
  FilledColorSquare,
  IconLine,
  IconDashedLine,
  IconDashboard,
  IconList,
  IconChartBar,
  IconCirclePlus,
  IconBrightness,
} from './Icons'
export type { MatchingStatusValue, MatchingStatusProps, Icon3YAiProps, FilledColorSquareProps, IconLineProps } from './Icons'

export { SocialIcon } from './SocialIcon'
export type { SocialIconName, SocialIconVariant, SocialIconProps } from './SocialIcon'

// ─── New Components (batch 2) ──────────────────────────────────────────────
export { Empty } from './Empty'

export { Field } from './Field'

export { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage } from './Form'

export { InputGroup, InputGroupAddonInline, InputGroupAddonBlock } from './InputGroup'

export { Item } from './Item'

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from './Menubar'

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from './NavigationMenu'

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMediaAsset,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from './Sidebar'
