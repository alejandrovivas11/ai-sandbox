"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu"

const ACTIONS = [
  "View Details",
  "Assign CCC-SLP",
  "Set Triage Tier",
  "Request Missing Documents",
  "Schedule Evaluation",
  "Reject Referral",
]

export function ReferralActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {ACTIONS.map((action) => (
          <DropdownMenuItem key={action}>{action}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
