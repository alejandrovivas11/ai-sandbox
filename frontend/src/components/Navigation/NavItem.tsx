"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

export function NavItem({ href, icon, label, isActive = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-accent text-foreground font-medium"
          : "text-muted-foreground"
      )}
    >
      <span className="inline-flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  )
}
