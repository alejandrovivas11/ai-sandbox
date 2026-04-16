"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import { Badge } from "@/components/ui/Badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import type { IntakeFormData } from "@/types/intake"

interface IntakeFormSectionsProps {
  formData: IntakeFormData
}

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}

function SelectField({
  label,
  required,
  value,
  options,
  placeholder,
}: {
  label: string
  required?: boolean
  value: string
  options: string[]
  placeholder?: string
}) {
  return (
    <FormField label={label} required={required}>
      <Select defaultValue={value || undefined}>
        <SelectTrigger className="bg-white border border-[#E5E5E5]">
          <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}

export function IntakeFormSections({ formData }: IntakeFormSectionsProps) {
  const { demographics, insurance, communicationConcerns, developmentalMilestones, hearingStatus, medicalHistory, screeningTools, consent } = formData

  return (
    <div className="flex flex-col gap-6">
      {/* Patient Demographics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" required>
              <Input defaultValue={demographics.firstName} />
            </FormField>
            <FormField label="Last Name" required>
              <Input defaultValue={demographics.lastName} />
            </FormField>
            <FormField label="Date of Birth" required>
              <Input type="date" defaultValue={demographics.dateOfBirth} />
            </FormField>
            <SelectField
              label="Gender"
              required
              value={demographics.gender}
              options={["Male", "Female", "Other"]}
            />
            <FormField label="Caregiver Name" required>
              <Input defaultValue={demographics.caregiverName} />
            </FormField>
            <FormField label="Caregiver Phone" required>
              <Input type="tel" defaultValue={demographics.caregiverPhone} />
            </FormField>
            <FormField label="Address" required>
              <Textarea defaultValue="123 Main St, Anytown, ST 12345" />
            </FormField>
            <FormField label="Referring Physician">
              <Input defaultValue={insurance.referringPhysician} />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Primary Insurance" required>
              <Input defaultValue={insurance.insuranceProvider} />
            </FormField>
            <FormField label="Policy Number" required>
              <Input defaultValue={insurance.policyNumber} />
            </FormField>
            <FormField label="Group Number">
              <Input defaultValue={insurance.groupNumber} />
            </FormField>
            <SelectField
              label="Authorization Status"
              value="Pending"
              options={["Approved", "Pending", "Denied", "Not Required"]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication Concerns Card */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Concerns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <FormField label="Primary Communication Concern" required>
              <Textarea defaultValue={communicationConcerns.descriptionOfConcerns} />
            </FormField>
            <SelectField
              label="Concern Onset"
              required
              value="Gradual"
              options={["Sudden", "Gradual", "From Birth", "Unknown"]}
            />
            <SelectField
              label="Speech Intelligibility Rating"
              required
              value="25% - Difficult to understand"
              options={[
                "100% - Always understood",
                "75% - Usually understood",
                "50% - Sometimes understood",
                "25% - Difficult to understand",
                "0% - Rarely understood",
              ]}
            />
            <FormField label="Language Concerns">
              <Textarea defaultValue="Difficulty following multi-step directions, limited expressive vocabulary" />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Swallowing & Feeding Card */}
      <Card>
        <CardHeader>
          <CardTitle>Swallowing &amp; Feeding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Swallowing Difficulties">
              <Textarea defaultValue="Occasional coughing during meals" />
            </FormField>
            <SelectField
              label="Current Diet Texture (IDDSI)"
              value="Level 7 - Regular"
              options={[
                "Level 7 - Regular",
                "Level 6 - Soft & Bite-sized",
                "Level 5 - Minced & Moist",
                "Level 4 - Pureed",
              ]}
            />
            <SelectField
              label="Liquid Consistency (IDDSI)"
              value="Level 0 - Thin"
              options={[
                "Level 0 - Thin",
                "Level 1 - Slightly Thick",
                "Level 2 - Mildly Thick",
                "Level 3 - Moderately Thick",
                "Level 4 - Extremely Thick",
              ]}
            />
            <div className="flex items-center gap-2 pt-6">
              <Checkbox id="aspiration-history" />
              <Label htmlFor="aspiration-history">Aspiration History</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Concerns Card */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Concerns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Voice Quality Description">
              <Textarea />
            </FormField>
            <SelectField
              label="Voice Concern Onset"
              value=""
              options={["Recent", "Gradual", "Chronic", "Intermittent"]}
            />
            <FormField label="Vocal Use Demands">
              <Input />
            </FormField>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox id="reflux-history" />
              <Label htmlFor="reflux-history">Reflux History</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developmental Milestones Card */}
      <Card>
        <CardHeader>
          <CardTitle>Developmental Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Age of First Words">
              <Input defaultValue={developmentalMilestones.ageAtFirstWords} />
            </FormField>
            <FormField label="Age of First Sentences">
              <Input defaultValue={developmentalMilestones.ageAtFirstSentences} />
            </FormField>
            <FormField label="Babbling History">
              <Textarea defaultValue="Limited babbling, late onset around 12 months" />
            </FormField>
            <FormField label="Feeding Milestones">
              <Textarea defaultValue={developmentalMilestones.earlyFeedingHistory} />
            </FormField>
            <FormField label="Motor Milestones">
              <Textarea defaultValue="Walking at 14 months, age-appropriate gross motor" />
            </FormField>
            <FormField label="Pediatrician Concerns">
              <Textarea defaultValue="Recommended speech evaluation due to language delay" />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Hearing Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hearing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Last Audiological Evaluation">
              <Input type="date" defaultValue={hearingStatus.lastHearingEvaluation} />
            </FormField>
            <SelectField
              label="Hearing Status"
              required
              value="Within Normal Limits"
              options={[
                "Within Normal Limits",
                "Mild Loss",
                "Moderate Loss",
                "Severe Loss",
                "Profound Loss",
                "Unknown",
              ]}
            />
            <SelectField
              label="Hearing Aid/CI Use"
              value={hearingStatus.hearingDevices || "None"}
              options={[
                "None",
                "Hearing Aids",
                "Cochlear Implant",
                "Bone Anchored",
                "FM System",
              ]}
            />
            <FormField label="Tympanometry Results">
              <Input defaultValue="Type A bilateral" />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Screening Tools Card */}
      <Card>
        <CardHeader>
          <CardTitle>Screening Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-row items-center gap-2">
              <div className="flex-1">
                <FormField label="EAT-10 Score">
                  <Input type="number" defaultValue="2" />
                </FormField>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 mt-5">
                Low Risk
              </Badge>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="flex-1">
                <FormField label="VHI-10 Score">
                  <Input type="number" defaultValue={screeningTools.vhi10Score || ""} />
                </FormField>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-500 mt-5">
                Not Applicable
              </Badge>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="flex-1">
                <FormField label="OASES Score">
                  <Input type="number" />
                </FormField>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-500 mt-5">
                Not Applicable
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <FormField label="Neurological History">
              <Textarea defaultValue="No significant neurological history" />
            </FormField>
            <FormField label="Head/Neck Surgery">
              <Textarea />
            </FormField>
            <FormField label="Intubation History">
              <Textarea defaultValue="Brief intubation at birth, no complications" />
            </FormField>
            <SelectField
              label="Tracheostomy Status"
              value="Never"
              options={["Never", "Current", "Previous", "Planned"]}
            />
            <FormField label="Current Medications">
              <Textarea defaultValue={medicalHistory.currentMedications || "Children's vitamins"} />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Consent & Authorization Card */}
      <Card>
        <CardHeader>
          <CardTitle>Consent &amp; Authorization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <Checkbox
                id="general-treatment"
                defaultChecked={consent.consentToTreatment}
              />
              <div className="flex flex-col">
                <Label htmlFor="general-treatment">
                  General Treatment Consent
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <span className="text-sm text-neutral-500">
                  I consent to speech-language pathology evaluation and treatment services
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="telehealth"
                defaultChecked={consent.telehealthConsent}
              />
              <div className="flex flex-col">
                <Label htmlFor="telehealth">Telehealth Consent</Label>
                <span className="text-sm text-neutral-500">
                  I consent to receive services via telehealth when appropriate
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="recording"
                defaultChecked={consent.audioVideoRecording}
              />
              <div className="flex flex-col">
                <Label htmlFor="recording">Audio/Video Recording Consent</Label>
                <span className="text-sm text-neutral-500">
                  I consent to audio/video recording for speech sample analysis and training purposes
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="hipaa"
                defaultChecked={consent.hipaaNpp}
              />
              <div className="flex flex-col">
                <Label htmlFor="hipaa">
                  HIPAA Acknowledgment
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <span className="text-sm text-neutral-500">
                  I acknowledge receipt of Notice of Privacy Practices
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="instrumental" />
              <div className="flex flex-col">
                <Label htmlFor="instrumental">Instrumental Assessment Consent</Label>
                <span className="text-sm text-neutral-500">
                  I consent to instrumental swallowing assessments (FEES, MBSS) if recommended
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
