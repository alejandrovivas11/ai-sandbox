"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import { SOAPNoteForm } from "@/components/features/session-note/SOAPNoteForm"
import { useSessionNoteForm } from "@/hooks/useSessionNote"
import {
  getPatient,
  saveSessionNoteDraft,
  submitSessionNote,
} from "@/lib/api/session-notes"

export default function SessionNotePage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string
  const patient = getPatient()
  const { formData, updateField, updateTelehealth, updateSignature } =
    useSessionNoteForm()

  const handleCancel = () => {
    router.push("/patients/" + patientId)
  }

  const handleSaveDraft = async () => {
    await saveSessionNoteDraft(formData)
    router.push("/patients/" + patientId)
  }

  const handleSignSubmit = async () => {
    await submitSessionNote(formData)
    router.push("/patients/" + patientId)
  }

  return (
    <div className="flex flex-col flex-1 p-6 gap-6">
      {/* render_sequence[0]: Header with breadcrumb and title */}
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={"/patients/" + patientId}>
                {patient.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={"/patients/" + patientId + "/notes"}>
                Progress Notes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Session SOAP Note</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Session SOAP Note</h1>
            <p className="text-sm text-muted-foreground">
              {patient.name} &bull; DOB: {patient.dateOfBirth} &bull; Session:{" "}
              {patient.sessionDate}
            </p>
          </div>
        </div>
      </div>

      {/* render_sequence[1]: Medicare warning card */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="flex flex-row items-center gap-3 p-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="text-sm text-amber-900">
            Medicare therapy cap threshold approaching. KX modifier may be
            required for continued services.
          </span>
        </CardContent>
      </Card>

      {/* render_sequence[2]: Session metadata form */}
      <Card>
        <CardContent className="flex flex-row gap-6 p-5">
          <div className="flex flex-col gap-1.5">
            <Label>Subdomain</Label>
            <Select
              value={formData.subdomain}
              onValueChange={(v) => updateField("subdomain", v)}
            >
              <SelectTrigger className="bg-white border border-[#E5E5E5] w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="articulation">
                  Articulation/Phonology
                </SelectItem>
                <SelectItem value="expressive_language">
                  Expressive Language
                </SelectItem>
                <SelectItem value="receptive_language">
                  Receptive Language
                </SelectItem>
                <SelectItem value="fluency">Fluency</SelectItem>
                <SelectItem value="voice">Voice/Resonance</SelectItem>
                <SelectItem value="swallowing">
                  Swallowing/Dysphagia
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Service Delivery</Label>
            <Select
              value={formData.serviceDelivery}
              onValueChange={(v) => updateField("serviceDelivery", v)}
            >
              <SelectTrigger className="bg-white border border-[#E5E5E5] w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="in_person">In-Person</SelectItem>
                <SelectItem value="telehealth">Telehealth</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>CPT Code</Label>
            <Select
              value={formData.cptCode}
              onValueChange={(v) => updateField("cptCode", v)}
            >
              <SelectTrigger className="bg-white border border-[#E5E5E5] w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="92507">
                  92507 - Speech/Language Therapy
                </SelectItem>
                <SelectItem value="92508">
                  92508 - Speech/Language Re-evaluation
                </SelectItem>
                <SelectItem value="92526">
                  92526 - Oral Function Therapy
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Duration (minutes)</Label>
            <Select
              value={formData.duration}
              onValueChange={(v) => updateField("duration", v)}
            >
              <SelectTrigger className="bg-white border border-[#E5E5E5] w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="45">45</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>ICD-10 Codes</Label>
            <span className="text-sm text-gray-700 py-2">
              {formData.icdCodes}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* render_sequence[3]: SOAP Note Tabs (component) */}
      <SOAPNoteForm
        formData={formData}
        onUpdateField={updateField}
        onUpdateTelehealth={updateTelehealth}
        onUpdateSignature={updateSignature}
      />

      {/* render_sequence[4]: Actions */}
      <div className="flex flex-row justify-between gap-4">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <div className="flex flex-row gap-4">
          <Button variant="secondary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSignSubmit}>Sign &amp; Submit</Button>
        </div>
      </div>
    </div>
  )
}
