'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/Sidebar'
import { Badge } from '@/components/ui/Badge'
import { Topbar } from '@/components/shell/Topbar'

/**
 * NAV_ITEMS — uses real Figma SVG icons from /icons/
 * Reference: aba-test/all-targets/layout.tsx primaryNavItems
 */
const NAV_ITEMS = [
  { label: '3Y AI', href: '/', iconSrc: '/icons/3y-ai-filled-stroke.svg' },
  { label: 'Home', href: '/', iconSrc: '/icons/home.svg' },
  { label: 'Calendar', href: '/calendar', iconSrc: '/icons/calendar.svg' },
  { label: 'Patients', href: '/patients', iconSrc: '/icons/circleuserround.svg' },
  { label: 'Notes', href: '/notes', iconSrc: '/icons/files.svg' },
  { label: 'Messages', href: '/messages', iconSrc: '/icons/mail.svg', badge: '23' },
  { label: 'Members', href: '/members', iconSrc: '/icons/contactround.svg' },
  { label: 'Payments', href: '/payments', iconSrc: '/icons/banknote.svg' },
  { label: 'Online Presence', href: '/online-presence', iconSrc: '/icons/globe.svg' },
]

function isActiveRoute(pathname: string, href: string, label: string): boolean {
  if (label === '3Y AI') return false
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Full-width dark topbar */}
      <Topbar />

      {/* Body: sidebar + content with rounded top corners */}
      <div className="flex flex-row flex-1 min-h-0 overflow-hidden bg-[#171717]">
        <SidebarProvider
          className="!min-h-0 flex-none"
          style={{ '--sidebar-width': '256px' } as React.CSSProperties}
        >
          <Sidebar className="!h-full bg-[#171717] border-r border-neutral-200">
            <SidebarContent className="pt-[12px] pr-[12px] pb-[12px] pl-[12px] bg-[#FFFFFF] rounded-tl-[20px]">
              <SidebarGroup className="p-0">
                <SidebarMenu className="gap-[8px]">
                  {NAV_ITEMS.map((item) => {
                    const active = isActiveRoute(pathname, item.href, item.label)
                    return (
                      <SidebarMenuItem key={item.label}>
                        <Link href={item.href}>
                          <SidebarMenuButton
                            icon={<Image src={item.iconSrc} alt={item.label} width={16} height={16} />}
                            tooltip={item.label}
                            isActive={active}
                            variant={item.badge ? 'badge' : 'simple'}
                            badge={item.badge ? <Badge variant="secondary">{item.badge}</Badge> : undefined}
                            className={
                              active
                                ? 'bg-[#E5E5E5] text-[#171717] font-[500] rounded-[8px] pt-[12px] pr-[8px] pb-[12px] pl-[8px]'
                                : 'rounded-[8px] pt-[12px] pr-[8px] pb-[12px] pl-[8px] text-neutral-700 hover:bg-neutral-100'
                            }
                          >
                            {item.label}
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-neutral-200 pt-[12px] pr-[12px] pb-[12px] pl-[12px] bg-[#FFFFFF]">
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/settings">
                    <SidebarMenuButton
                      icon={<Image src="/icons/settings.svg" alt="Settings" width={16} height={16} />}
                      tooltip="Settings"
                      isActive={pathname.startsWith('/settings')}
                      className="rounded-[8px] pt-[12px] pr-[8px] pb-[12px] pl-[8px] text-neutral-700 hover:bg-neutral-100"
                    >
                      Settings
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="flex-1 overflow-y-auto bg-[#FFFFFF] rounded-tr-[20px]">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
