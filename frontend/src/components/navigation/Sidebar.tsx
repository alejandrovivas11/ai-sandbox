"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/Sidebar"
import {
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  CreditCard,
  FileText,
  Settings,
  Building2,
} from "lucide-react"

const clinicalItems = [
  { label: "Staff", href: "/staff", icon: Users },
  { label: "Scheduling", href: "/scheduling", icon: Calendar },
  { label: "Credentialing", href: "/credentialing", icon: ClipboardList },
]

const businessOpsItems = [
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Payroll", href: "/payroll", icon: CreditCard },
  { label: "Billing", href: "/billing", icon: FileText },
]

const adminItems = [
  { label: "Organization", href: "/organization", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
            3Y
          </div>
          <span className="text-sm font-semibold">3Y Health</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Clinical</SidebarGroupLabel>
          <SidebarMenu>
            {clinicalItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Business Ops</SidebarGroupLabel>
          <SidebarMenu>
            {businessOpsItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarMenu>
            {adminItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
