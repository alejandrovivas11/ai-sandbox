"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { GoalProgressTable } from "@/components/features/session-note/GoalProgressTable"
import type {
  SessionNoteFormData,
  TelehealthFormData,
  SignatureFormData,
} from "@/types/session-note"

interface SOAPNoteFormProps {
  formData: SessionNoteFormData
  onUpdateField: <K extends keyof SessionNoteFormData>(
    field: K,
    value: SessionNoteFormData[K]
  ) => void
  onUpdateTelehealth: <K extends keyof TelehealthFormData>(
    field: K,
    value: TelehealthFormData[K]
  ) => void
  onUpdateSignature: <K extends keyof SignatureFormData>(
    field: K,
    value: SignatureFormData[K]
  ) => void
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}

function FieldWrapper({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function SOAPNoteForm({
  formData,
  onUpdateField,
  onUpdateTelehealth,
}: SOAPNoteFormProps) {
  return (
    <Tabs defaultValue="expressive_language">
      <TabsList>
        <TabsTrigger value="expressive_language">
          Expressive Language
        </TabsTrigger>
      </TabsList>

      <TabsContent value="expressive_language">
        <form className="flex flex-col gap-6">
          {/* Subjective */}
          <FormSection title="Subjective">
            <FieldWrapper label="Patient/Caregiver Report">
              <Textarea
                rows={4}
                placeholder="Patient/caregiver report, mood, compliance, home program adherence..."
                value={formData.subjective}
                onChange={(e) => onUpdateField("subjective", e.target.value)}
              />
            </FieldWrapper>
          </FormSection>

          {/* Objective */}
          <FormSection title="Objective">
            <GoalProgressTable goals={formData.goals} />
            <FieldWrapper label="Objective Narrative">
              <Textarea
                rows={4}
                placeholder="Specific techniques used, stimuli, clinical observations..."
                value={formData.objectiveNarrative}
                onChange={(e) =>
                  onUpdateField("objectiveNarrative", e.target.value)
                }
              />
            </FieldWrapper>
          </FormSection>

          {/* Assessment */}
          <FormSection title="Assessment">
            <FieldWrapper label="Clinical Interpretation">
              <Textarea
                rows={4}
                placeholder="Skilled care justification, clinical reasoning, progress interpretation..."
                value={formData.assessment}
                onChange={(e) => onUpdateField("assessment", e.target.value)}
              />
            </FieldWrapper>
          </FormSection>

          {/* Plan */}
          <FormSection title="Plan">
            <FieldWrapper label="Next Session Planning">
              <Textarea
                rows={4}
                placeholder="Next session targets, goal modifications, home program updates..."
                value={formData.plan}
                onChange={(e) => onUpdateField("plan", e.target.value)}
              />
            </FieldWrapper>
          </FormSection>

          {/* Home Exercise Program */}
          <FormSection title="Home Exercise Program">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <FieldWrapper label="Instructions Provided">
                  <Textarea
                    rows={3}
                    placeholder="Home practice activities, caregiver instructions..."
                    value={formData.hepInstructions}
                    onChange={(e) =>
                      onUpdateField("hepInstructions", e.target.value)
                    }
                  />
                </FieldWrapper>
              </div>
              <div>
                <FieldWrapper label="HEP Provided">
                  <Button
                    type="button"
                    variant={formData.hepProvided ? "default" : "outline"}
                    onClick={() =>
                      onUpdateField("hepProvided", !formData.hepProvided)
                    }
                  >
                    Yes
                  </Button>
                </FieldWrapper>
              </div>
            </div>
          </FormSection>

          {/* Telehealth Documentation */}
          <FormSection title="Telehealth Documentation">
            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Platform Used">
                <Select
                  value={formData.telehealth.platform || undefined}
                  onValueChange={(v) => onUpdateTelehealth("platform", v)}
                >
                  <SelectTrigger className="bg-white border border-[#E5E5E5]">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="webex">WebEx</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
              <FieldWrapper label="Patient Location">
                <Input
                  placeholder="Patient location during session"
                  value={formData.telehealth.patientLocation}
                  onChange={(e) =>
                    onUpdateTelehealth("patientLocation", e.target.value)
                  }
                />
              </FieldWrapper>
              <FieldWrapper label="Provider Location">
                <Input
                  placeholder="Clinician location during session"
                  value={formData.telehealth.providerLocation}
                  onChange={(e) =>
                    onUpdateTelehealth("providerLocation", e.target.value)
                  }
                />
              </FieldWrapper>
              <FieldWrapper label="Caregiver Present">
                <Button
                  type="button"
                  variant={
                    formData.telehealth.caregiverPresent
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    onUpdateTelehealth(
                      "caregiverPresent",
                      !formData.telehealth.caregiverPresent
                    )
                  }
                >
                  Yes
                </Button>
              </FieldWrapper>
              <FieldWrapper label="Consent Confirmed">
                <Button
                  type="button"
                  variant={
                    formData.telehealth.consentConfirmed
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    onUpdateTelehealth(
                      "consentConfirmed",
                      !formData.telehealth.consentConfirmed
                    )
                  }
                >
                  Yes
                </Button>
              </FieldWrapper>
              <FieldWrapper label="Technology Issues">
                <Input
                  placeholder="Any connectivity or technical problems"
                  value={formData.telehealth.technologyIssues}
                  onChange={(e) =>
                    onUpdateTelehealth("technologyIssues", e.target.value)
                  }
                />
              </FieldWrapper>
            </div>
          </FormSection>

          {/* Provider Signature */}
          <FormSection title="Provider Signature">
            <div className="flex flex-row gap-6 items-end">
              <FieldWrapper label="Treating Provider">
                <span className="text-sm text-gray-700">
                  {formData.signature.treatingProvider}
                </span>
              </FieldWrapper>
              <FieldWrapper label="Supervising SLP">
                <span className="text-sm text-gray-700">
                  {formData.signature.supervisingSLP}
                </span>
              </FieldWrapper>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                Co-signature Required
              </Badge>
            </div>
          </FormSection>
        </form>
      </TabsContent>
    </Tabs>
  )
}
