'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Calendar,
  CircleUserRound,
  FileText,
  Mail,
  Contact,
  Banknote,
  Globe,
  Settings,
} from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/Sidebar'
import { Logo } from '@/components/ui/Logo'
import { Badge } from '@/components/ui/Badge'
import { Topbar } from '@/components/shell/Topbar'

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Patients', href: '/patients', icon: CircleUserRound },
  { label: 'Notes', href: '/notes', icon: FileText },
  { label: 'Messages', href: '/messages', icon: Mail, badge: '23' },
  { label: 'Members', href: '/members', icon: Contact },
  { label: 'Payments', href: '/payments', icon: Banknote },
  { label: 'Online Presence', href: '/online-presence', icon: Globe },
]

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar side="left">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="flex items-center gap-2 rounded-md px-2 h-8 text-sm font-semibold hover:bg-accent transition-colors">
                <Logo view="icon" color="dark" />
                <span>3Y AI</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      variant={item.badge ? 'badge' : 'simple'}
                      icon={<item.icon className="size-4" />}
                      isActive={isActiveRoute(pathname, item.href)}
                      tooltip={item.label}
                      badge={item.badge ? <Badge variant="secondary">{item.badge}</Badge> : undefined}
                    >
                      {item.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/settings">
                <SidebarMenuButton
                  variant="simple"
                  icon={<Settings className="size-4" />}
                  isActive={isActiveRoute(pathname, '/settings')}
                  tooltip="Settings"
                >
                  Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Topbar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
