"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Home, Users, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavItem } from "@/components/Navigation/NavItem"

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/staff", icon: Users, label: "Staff" },
]

export function NavigationSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={cn(
          "fixed left-4 top-4 z-50 inline-flex items-center justify-center rounded-md p-2",
          "bg-background border border-border shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "lg:hidden"
        )}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        data-state={mobileOpen ? "open" : "closed"}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-border bg-sidebar",
          "transition-transform duration-200 ease-in-out",
          "lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-base font-semibold text-foreground">3Y Health</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "inline-flex items-center justify-center rounded-md p-1",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "lg:hidden"
            )}
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon className="size-5" />}
              label={item.label}
              isActive={
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">3Y Health Platform</p>
        </div>
      </aside>
    </>
  )
}
