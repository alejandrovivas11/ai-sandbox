"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/Checkbox"
import { Textarea } from "@/components/ui/Textarea"
import { Separator } from "@/components/ui/Separator"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { SignatureField } from "@/components/ui/signature-field"
import { PEDIATRIC_FORM_DATA } from "@/lib/api/intake"

const data = PEDIATRIC_FORM_DATA

export function PediatricIntakeForm() {
  return (
    <form className="flex flex-col gap-6">
      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input defaultValue={data.demographics.firstName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Middle Name</Label>
              <Input defaultValue={data.demographics.middleName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input defaultValue={data.demographics.lastName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                defaultValue={data.demographics.dateOfBirth}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Gender</Label>
              <Select defaultValue={data.demographics.gender}>
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to answer">
                    Prefer not to answer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Primary Language</Label>
              <Select defaultValue={data.demographics.primaryLanguage}>
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Mandarin">Mandarin</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Caregiver Name <span className="text-red-500">*</span>
              </Label>
              <Input defaultValue={data.demographics.caregiverName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Caregiver Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                defaultValue={data.demographics.caregiverPhone}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Caregiver Email</Label>
              <Input
                type="email"
                defaultValue={data.demographics.caregiverEmail}
              />
            </div>
          </div>

          {/* Communication Preferences */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Communication Preferences
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="interpreter-needed"
                  defaultChecked={data.demographics.interpreterNeeded}
                />
                <Label htmlFor="interpreter-needed">Interpreter Needed</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Preferred Communication Mode</Label>
                <Select
                  defaultValue={
                    data.demographics.preferredCommunicationMode
                  }
                >
                  <SelectTrigger className="bg-white border border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Verbal">Verbal</SelectItem>
                    <SelectItem value="Sign Language">Sign Language</SelectItem>
                    <SelectItem value="Augmentative Device">
                      Augmentative Device
                    </SelectItem>
                    <SelectItem value="Written">Written</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance & Referral */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance &amp; Referral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>
                Insurance Provider <span className="text-red-500">*</span>
              </Label>
              <Input defaultValue={data.insurance.insuranceProvider} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Policy Number</Label>
              <Input defaultValue={data.insurance.policyNumber} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Group Number</Label>
              <Input defaultValue={data.insurance.groupNumber} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Referring Physician <span className="text-red-500">*</span>
              </Label>
              <Input defaultValue={data.insurance.referringPhysician} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Physician NPI</Label>
              <Input defaultValue={data.insurance.physicianNpi} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Referral Date</Label>
              <Input
                type="date"
                defaultValue={data.insurance.referralDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Concerns */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Concerns</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Select all areas of concern:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="articulation"
                  defaultChecked={
                    data.communicationConcerns.articulationSpeechSounds
                  }
                />
                <Label htmlFor="articulation">
                  Articulation/Speech Sounds
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="expressive"
                  defaultChecked={
                    data.communicationConcerns.expressiveLanguage
                  }
                />
                <Label htmlFor="expressive">Expressive Language</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="receptive"
                  defaultChecked={
                    data.communicationConcerns.receptiveLanguage
                  }
                />
                <Label htmlFor="receptive">Receptive Language</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="fluency"
                  defaultChecked={
                    data.communicationConcerns.fluencyStuttering
                  }
                />
                <Label htmlFor="fluency">Fluency/Stuttering</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="voice-quality"
                  defaultChecked={data.communicationConcerns.voiceQuality}
                />
                <Label htmlFor="voice-quality">Voice Quality</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="swallowing"
                  defaultChecked={
                    data.communicationConcerns.swallowingFeeding
                  }
                />
                <Label htmlFor="swallowing">Swallowing/Feeding</Label>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Label>Description of Concerns</Label>
              <Textarea
                defaultValue={
                  data.communicationConcerns.descriptionOfConcerns
                }
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developmental Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Developmental Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Age at First Words</Label>
              <Input
                defaultValue={
                  data.developmentalMilestones.ageAtFirstWords
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Age at First Sentences</Label>
              <Input
                defaultValue={
                  data.developmentalMilestones.ageAtFirstSentences
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Birth History</Label>
              <Select
                defaultValue={data.developmentalMilestones.birthHistory}
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Full-term, no complications">
                    Full-term, no complications
                  </SelectItem>
                  <SelectItem value="Premature birth">
                    Premature birth
                  </SelectItem>
                  <SelectItem value="Birth complications">
                    Birth complications
                  </SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Early Feeding History</Label>
              <Select
                defaultValue={
                  data.developmentalMilestones.earlyFeedingHistory
                }
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Breastfed successfully">
                    Breastfed successfully
                  </SelectItem>
                  <SelectItem value="Breastfed with some difficulty">
                    Breastfed with some difficulty
                  </SelectItem>
                  <SelectItem value="Bottle-fed">Bottle-fed</SelectItem>
                  <SelectItem value="Feeding tube">Feeding tube</SelectItem>
                  <SelectItem value="Mixed feeding">Mixed feeding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hearing Status */}
      <Card>
        <CardHeader>
          <CardTitle>Hearing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Recent Hearing Screen</Label>
              <Select defaultValue={data.hearingStatus.recentHearingScreen}>
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Refer">Refer</SelectItem>
                  <SelectItem value="Not completed">Not completed</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Last Hearing Evaluation</Label>
              <Input
                type="date"
                defaultValue={data.hearingStatus.lastHearingEvaluation}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Hearing Devices</Label>
              <Select defaultValue={data.hearingStatus.hearingDevices}>
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Hearing aids">Hearing aids</SelectItem>
                  <SelectItem value="Cochlear implant">
                    Cochlear implant
                  </SelectItem>
                  <SelectItem value="FM system">FM system</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Current Medications</Label>
              <Textarea defaultValue={data.medicalHistory.currentMedications} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Relevant Diagnoses</Label>
              <Textarea
                defaultValue={data.medicalHistory.relevantDiagnoses}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Previous SLP Therapy</Label>
              <Select defaultValue={data.medicalHistory.previousSlpTherapy}>
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screening Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Screening Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-900">
              EAT-10 Swallowing Assessment (for patients with feeding concerns)
            </p>
            <p className="text-sm text-neutral-600 mb-3">
              Score: {data.screeningTools.eat10Score} (
              {data.screeningTools.eat10Interpretation})
            </p>
            <p className="text-sm text-gray-900">
              Pediatric feeding questionnaire completed by caregiver
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Consent & Signatures */}
      <Card>
        <CardHeader>
          <CardTitle>Consent &amp; Signatures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="consent-treatment"
                defaultChecked={data.consent.consentToTreatment}
              />
              <Label htmlFor="consent-treatment">
                Consent to Speech-Language Therapy Treatment{" "}
                <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="hipaa-npp"
                defaultChecked={data.consent.hipaaNpp}
              />
              <Label htmlFor="hipaa-npp">
                HIPAA Notice of Privacy Practices Acknowledgment{" "}
                <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="av-recording"
                defaultChecked={data.consent.audioVideoRecording}
              />
              <Label htmlFor="av-recording">
                Audio/Video Recording Consent
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="telehealth"
                defaultChecked={data.consent.telehealthConsent}
              />
              <Label htmlFor="telehealth">Telehealth Services Consent</Label>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4">
            <SignatureField
              label="Caregiver Signature"
              value={data.consent.caregiverSignature}
              required
            />
            <div className="flex flex-col gap-2">
              <Label>
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                defaultValue={data.consent.signatureDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
