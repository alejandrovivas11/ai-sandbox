"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { ObjectiveGoalsTable } from "./ObjectiveGoalsTable"
import { TelehealthSection } from "./TelehealthSection"
import { getPatient } from "@/lib/api/session-notes"
import {
  SERVICE_TYPE_OPTIONS,
  CPT_CODE_OPTIONS,
  SUPERVISING_SLP_OPTIONS,
  SERVICE_DELIVERY_MODE_OPTIONS,
} from "@/lib/constants/slp-options"
import type { SessionNoteData, ObjectiveGoal, TelehealthData } from "@/types/session-note"

interface SessionNoteFormProps {
  formData: SessionNoteData
  updateField: <K extends keyof SessionNoteData>(field: K, value: SessionNoteData[K]) => void
  updateGoal: (index: number, field: keyof ObjectiveGoal, value: string) => void
  updateTelehealth: <K extends keyof TelehealthData>(field: K, value: TelehealthData[K]) => void
  isTelehealth: boolean
}

export function SessionNoteForm({
  formData,
  updateField,
  updateGoal,
  updateTelehealth,
  isTelehealth,
}: SessionNoteFormProps) {
  const patient = getPatient()

  return (
    <div className="flex flex-col gap-6">
      {/* Patient Info Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-row items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900">{patient.name}</h3>
              <p className="text-sm text-neutral-600">DOB: {patient.dateOfBirth}</p>
              <p className="text-sm text-neutral-600">
                Primary Diagnosis: {patient.primaryDiagnosis}
              </p>
            </div>
            <Badge className="bg-indigo-600 text-white">{patient.specialty}</Badge>
            <p className="text-sm text-neutral-600">
              Authorization: {patient.authorizationVisitsRemaining} visits remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Session Metadata Card */}
      <Card>
        <CardContent className="p-5 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-gray-900">Session Metadata</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Session Date</Label>
              <Input
                type="date"
                value={formData.sessionDate}
                onChange={(e) => updateField("sessionDate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>End Time</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Duration</Label>
              <Input value={formData.duration} readOnly />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(v) => updateField("serviceType", v)}
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {SERVICE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>CPT Code</Label>
              <Select
                value={formData.cptCode}
                onValueChange={(v) => updateField("cptCode", v)}
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {CPT_CODE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Clinician</Label>
              <Input
                value={formData.clinician}
                onChange={(e) => updateField("clinician", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Supervising SLP</Label>
              <Select
                value={formData.supervisingSLP}
                onValueChange={(v) => updateField("supervisingSLP", v)}
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {SUPERVISING_SLP_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Service Delivery Mode</Label>
              <Select
                value={formData.serviceDeliveryMode}
                onValueChange={(v) => updateField("serviceDeliveryMode", v)}
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {SERVICE_DELIVERY_MODE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjective Card */}
      <Card>
        <CardContent className="p-5 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-gray-900">Subjective</h4>
          <div className="flex flex-col gap-1.5">
            <Label>Patient/Caregiver Report</Label>
            <Textarea
              placeholder="Document patient/caregiver report on communication function and home practice adherence..."
              value={formData.subjective}
              onChange={(e) => updateField("subjective", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Objective Card */}
      <Card>
        <CardContent className="p-5 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-gray-900">Objective</h4>
          <ObjectiveGoalsTable
            goals={formData.objectiveGoals}
            onUpdateGoal={updateGoal}
          />
          <div className="flex flex-col gap-1.5">
            <Label>Stimuli/Materials Used</Label>
            <Textarea
              placeholder="Document materials, stimuli, and activities used during session..."
              value={formData.stimuliMaterials}
              onChange={(e) => updateField("stimuliMaterials", e.target.value)}
              rows={2}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Patient Engagement</Label>
            <Textarea
              placeholder="Document patient's attention, cooperation, and engagement during session..."
              value={formData.patientEngagement}
              onChange={(e) => updateField("patientEngagement", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Assessment Card */}
      <Card>
        <CardContent className="p-5 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-gray-900">Assessment</h4>
          <div className="flex flex-col gap-1.5">
            <Label>Clinical Interpretation</Label>
            <Textarea
              placeholder="Document clinical interpretation, progress summary, and skilled care justification..."
              value={formData.assessment}
              onChange={(e) => updateField("assessment", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Plan Card */}
      <Card>
        <CardContent className="p-5 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-gray-900">Plan</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Next Session Focus</Label>
              <Textarea
                placeholder="Describe focus areas for next session..."
                value={formData.nextSessionFocus}
                onChange={(e) => updateField("nextSessionFocus", e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Cueing Adjustments</Label>
              <Textarea
                placeholder="Document any changes to cueing strategies..."
                value={formData.cueingAdjustments}
                onChange={(e) => updateField("cueingAdjustments", e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Home Program Updates</Label>
              <Textarea
                placeholder="Document home program recommendations..."
                value={formData.homeProgramUpdates}
                onChange={(e) => updateField("homeProgramUpdates", e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Referral Recommendations</Label>
              <Textarea
                placeholder="Document any referral recommendations..."
                value={formData.referralRecommendations}
                onChange={(e) => updateField("referralRecommendations", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Frequency/Duration Recommendations</Label>
            <Input
              placeholder="Recommended frequency and duration..."
              value={formData.frequencyDurationRecommendations}
              onChange={(e) =>
                updateField("frequencyDurationRecommendations", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Telehealth Card (conditional) */}
      {isTelehealth && (
        <TelehealthSection
          data={
            formData.telehealth ?? {
              platform: "",
              connectionQuality: "",
              patientLocation: "",
              providerLocation: "",
              clinicalObservations: "",
              consentConfirmed: false,
            }
          }
          onUpdate={updateTelehealth}
        />
      )}
    </div>
  )
}
