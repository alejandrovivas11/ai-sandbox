'use client'

import { Bell, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/Sidebar'
import { Separator } from '@/components/ui/Separator'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-foreground px-6">
      <SidebarTrigger className="text-background hover:bg-background/10 hover:text-background" />
      <Separator orientation="vertical" className="h-6 bg-background/20" />

      <div className="flex flex-1 items-center">
        <div className="relative max-w-md w-full">
          <Input
            placeholder="Search..."
            leadingIcon={<Search className="size-4" />}
            className="border-background/20 bg-background/10 text-background placeholder:text-background/50 focus-visible:shadow-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-background hover:bg-background/10 hover:text-background">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-green-500" />
        </Button>
        <Separator orientation="vertical" className="h-6 bg-background/20" />
        <div className="flex items-center gap-3">
          <Avatar size="8">
            <AvatarImage src="" alt="Sarah Johnson" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none text-background">Sarah Johnson</span>
            <span className="text-xs font-normal leading-none text-background/60 mt-0.5">PsychCare Associates</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
