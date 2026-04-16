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
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { H1 } from "@/components/ui/Typography"
import { IntakeFormSections } from "@/components/features/intake/IntakeFormSections"
import { useIntakeForm } from "@/hooks/useIntakeForm"

export default function NewPatientIntakePage() {
  const router = useRouter()
  const { formData, activeTab, setActiveTab, isSaving, handleSaveDraft, handleSubmit } =
    useIntakeForm()

  return (
    <div className="flex flex-col min-h-full">
      {/* render_sequence[0]: Header */}
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
                <BreadcrumbPage>New Intake</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <H1>Patient Intake Form</H1>
        </div>
        <Badge className="bg-indigo-600 text-white">Pediatric</Badge>
      </header>

      {/* render_sequence[1]: Tabs */}
      <div className="px-6 pt-4">
        <Tabs
          defaultValue="pediatric"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="pediatric">Pediatric Intake</TabsTrigger>
            <TabsTrigger value="adult">Adult Intake</TabsTrigger>
          </TabsList>
          <TabsContent value="pediatric">
            {/* render_sequence[2]: Form sections component */}
            <div className="py-4">
              <IntakeFormSections formData={formData} />
            </div>
          </TabsContent>
          <TabsContent value="adult">
            <div className="py-4">
              <IntakeFormSections formData={formData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* render_sequence[3]: Sticky actions */}
      <div className="sticky bottom-0 flex flex-row items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-200">
        <Button variant="ghost">
          <Printer className="w-4 h-4 mr-1.5" />
          Print Intake Form
        </Button>
        <Button
          variant="secondary"
          disabled={isSaving}
          onClick={handleSaveDraft}
        >
          Save as Draft
        </Button>
        <Button
          disabled={isSaving}
          onClick={async () => {
            await handleSubmit()
            router.push("/patients/patient-001")
          }}
        >
          Submit Intake
        </Button>
      </div>
    </div>
  )
}
