"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Printer } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/Breadcrumb"
import { Button } from "@/components/ui/Button"
import { H1 } from "@/components/ui/Typography"
import { IntakeProgressSidebar } from "@/components/features/intake/IntakeProgressSidebar"
import { IntakeFormTabs } from "@/components/features/intake/IntakeFormTabs"

export default function PatientIntakePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-full">
      {/* Header - render_sequence[0] */}
      <header className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href="/patients">Patients</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Intake</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Patient Intake Form</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <H1>Patient Intake Form</H1>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="secondary">
            <Printer className="w-4 h-4 mr-1.5" />
            Print
          </Button>
          <Button
            onClick={() => {
              router.push("/patients")
            }}
          >
            Save &amp; Schedule
          </Button>
        </div>
      </header>

      {/* Main content area - render_sequence[1] */}
      <div className="flex flex-row gap-6 p-6 flex-1">
        <IntakeProgressSidebar />
        <div className="flex-1 flex flex-col">
          <IntakeFormTabs />
        </div>
      </div>

      {/* Bottom action bar - render_sequence[2] */}
      <div className="flex flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <Button variant="secondary">Save as Draft</Button>
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              router.push("/patients")
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              router.push("/patients")
            }}
          >
            Save &amp; Schedule Evaluation
          </Button>
        </div>
      </div>
    </div>
  )
}
