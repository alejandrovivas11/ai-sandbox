"use client"

import { useParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { SessionNoteForm } from "@/components/features/session-note/SessionNoteForm"
import { useSessionNote } from "@/hooks/useSessionNote"
import { SLP_SUBDOMAIN_OPTIONS } from "@/lib/constants/slp-options"

export default function SessionNotePage() {
  const params = useParams()
  const patientId = params.id as string
  const { formData, updateField, updateGoal, updateTelehealth, isTelehealth } =
    useSessionNote()

  return (
    <div className="flex flex-col">
      {/* Header - render_sequence[0] */}
      <header className="flex flex-col gap-3 p-6 pb-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/patients">Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/patients/${patientId}`}>Sarah Johnson</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/patients/${patientId}/sessions`}>Session Notes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New SOAP Note</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Session SOAP Note</h1>
          <Select
            value={formData.subdomain}
            onValueChange={(v) => updateField("subdomain", v)}
          >
            <SelectTrigger className="bg-white border border-gray-200 w-[220px]">
              <SelectValue placeholder="SLP Subdomain Template" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {SLP_SUBDOMAIN_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main form content - render_sequence[1] */}
      <div className="p-6">
        <SessionNoteForm
          formData={formData}
          updateField={updateField}
          updateGoal={updateGoal}
          updateTelehealth={updateTelehealth}
          isTelehealth={isTelehealth}
        />
      </div>

      {/* Actions bar - render_sequence[2] */}
      <div className="flex flex-row items-center justify-between bg-white p-6 border-t border-gray-200">
        <div className="flex flex-row gap-3">
          <Button variant="outline">Use Previous as Template</Button>
          <Button variant="outline">Preview Note</Button>
        </div>
        <div className="flex flex-row gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button>Sign &amp; Submit</Button>
        </div>
      </div>
    </div>
  )
}
