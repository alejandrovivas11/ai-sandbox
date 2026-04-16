"use client"

import { useParams } from "next/navigation"
import { FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Separator } from "@/components/ui/Separator"
import { Spinner } from "@/components/ui/Spinner"
import { usePatient } from "@/hooks/usePatient"
import { PatientHeader } from "@/components/features/patient-chart/PatientHeader"
import { SessionHistoryTable } from "@/components/features/patient-chart/SessionHistoryTable"

export default function PatientChartPage() {
  const params = useParams()
  const patientId = params.id as string
  const { data, isLoading, error } = usePatient(patientId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-600">
        Failed to load patient data.
      </div>
    )
  }

  const {
    patient,
    provider,
    referringPhysician,
    diagnoses,
    assessments,
    treatmentPlan,
    sessions,
    authorization,
    caregivers,
    homePrograms,
    documents,
    referralInfo,
  } = data

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Header section - renders INSIDE page, BEFORE main content */}
      <PatientHeader
        patient={patient}
        provider={provider}
        referringPhysician={referringPhysician}
        authorization={authorization}
      />

      {/* Main content area */}
      <main className="flex flex-col gap-6">
        {/* render_sequence[0]: Active Diagnoses + Assessment Summary */}
        <div className="grid grid-cols-2 gap-6">
          {/* Active Diagnoses card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                Active Diagnoses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {diagnoses.map((dx) => (
                  <div
                    key={dx.id}
                    className="flex flex-row justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {dx.code} - {dx.description}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Onset: {dx.onsetDate}
                      </span>
                    </div>
                    <Badge
                      variant="default"
                      className={
                        dx.type === "Primary"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      }
                    >
                      {dx.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Summary card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {assessments.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-row justify-between"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {a.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Standard Score: {a.standardScore} ({a.percentile}
                      {getOrdinalSuffix(a.percentile)} %ile)
                    </span>
                  </div>
                ))}
                <div className="flex flex-row justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Overall Severity
                  </span>
                  <Badge
                    variant="default"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  >
                    Moderate
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* render_sequence[1]: Treatment Plan Summary + Authorization Summary */}
        <div className="grid grid-cols-2 gap-6">
          {/* Treatment Plan Summary card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                Treatment Plan Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <span className="text-sm text-muted-foreground">
                    Plan Certification: {treatmentPlan.certificationDate}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Next Recert: {treatmentPlan.recertDate}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-3">
                  {treatmentPlan.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex flex-row justify-between"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {goal.name}
                      </span>
                      <Badge
                        variant="default"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                      >
                        {goal.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorization Summary card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                Authorization Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Authorization: {authorization.authNumber}
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {authorization.status}
                  </Badge>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-sm text-muted-foreground">
                    Authorized Units: {authorization.authorizedUnits}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Used: {authorization.usedUnits}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-sm text-green-600">
                    Remaining:{" "}
                    {authorization.authorizedUnits - authorization.usedUnits}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Expires: {authorization.expirationDate}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    KX Modifier Status
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {authorization.kxModifierStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* render_sequence[2]: Session History (full-width) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-900">
              Session History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SessionHistoryTable sessions={sessions} />
          </CardContent>
        </Card>

        {/* render_sequence[3]: Caregiver Information + Home Exercise Program */}
        <div className="grid grid-cols-2 gap-6">
          {/* Caregiver Information card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                Caregiver Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {caregivers[0].name} ({caregivers[0].relationship})
                  </span>
                  <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                  >
                    {caregivers[0].type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {caregivers[0].phone} &bull; {caregivers[0].email}
                </span>
                <Separator />
                <div className="flex flex-row justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {caregivers[1].name} ({caregivers[1].relationship})
                  </span>
                  <Badge
                    variant="default"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                  >
                    {caregivers[1].type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {caregivers[1].phone} &bull; {caregivers[1].email}
                </span>
                <div className="flex flex-row justify-between">
                  <span className="text-sm text-muted-foreground">
                    Preferred Language: English
                  </span>
                  <span className="text-sm text-green-600">
                    Involvement: High
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Home Exercise Program card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                Home Exercise Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {homePrograms.map((hp, idx) => (
                  <div key={hp.id} className="flex flex-col gap-3">
                    {idx > 0 && <Separator />}
                    <div className="flex flex-row justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {hp.name}
                      </span>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-700 hover:bg-green-100"
                      >
                        {hp.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Assigned: {hp.assignedDate}
                    </span>
                    <div className="flex flex-row justify-between">
                      <span className="text-sm text-muted-foreground">
                        Frequency: {hp.frequency}
                      </span>
                      <Badge
                        variant="default"
                        className={
                          hp.compliance === "Good Compliance"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {hp.compliance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* render_sequence[4]: Referral Information (full-width) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-900">
              Referral Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  Referring Provider
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {referralInfo.referringProvider}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  Referral Date
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {referralInfo.referralDate}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  Reason for Referral
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {referralInfo.reasonForReferral}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  Status
                </span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-700 hover:bg-green-100"
                >
                  {referralInfo.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* render_sequence[5]: Documents (full-width) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-900">
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="flex flex-row items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-gray-900">
                      {doc.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {doc.uploadDate}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
