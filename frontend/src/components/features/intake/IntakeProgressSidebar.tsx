"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import type { IntakeProgressStep } from "@/types/intake"
import { INTAKE_PROGRESS_STEPS } from "@/lib/api/intake"

function getBadgeClass(status: IntakeProgressStep["status"]): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 hover:bg-green-100"
    case "active":
      return "bg-indigo-600 text-white hover:bg-indigo-600"
    case "incomplete":
    default:
      return "bg-gray-100 text-gray-500 hover:bg-gray-100"
  }
}

function getTextClass(status: IntakeProgressStep["status"]): string {
  switch (status) {
    case "completed":
    case "active":
      return "text-neutral-900"
    case "incomplete":
    default:
      return "text-neutral-500"
  }
}

export function IntakeProgressSidebar() {
  return (
    <div className="w-[300px] flex-shrink-0">
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {INTAKE_PROGRESS_STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-row items-center gap-2"
              >
                <Badge className={getBadgeClass(step.status)}>
                  {step.number}
                </Badge>
                <span className={`text-sm ${getTextClass(step.status)}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
