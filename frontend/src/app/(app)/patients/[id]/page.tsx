"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import { usePatientChart } from "@/hooks/usePatientChart"
import { PatientHeader } from "@/components/features/patient/PatientHeader"
import { DiagnosisTable } from "@/components/features/patient/DiagnosisTable"
import { AssessmentTable } from "@/components/features/patient/AssessmentTable"
import { TreatmentPlanSummary } from "@/components/features/patient/TreatmentPlanSummary"
import { CaregiverTable } from "@/components/features/patient/CaregiverTable"
import { ExerciseTable } from "@/components/features/patient/ExerciseTable"

function statusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "signed":
    case "below threshold":
      return "bg-green-100 text-green-700 hover:bg-green-100"
    case "draft":
    case "pending":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100"
  }
}

export default function PatientDetailPage() {
  const { data, loading, error } = usePatientChart("PAT-2024-0156")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-gray-500">Loading patient data...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-red-600">{error || "Patient not found"}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Render sequence index 0: header */}
      <PatientHeader data={data} />

      {/* Render sequence index 1: main two-column grid */}
      <main className="grid grid-cols-2 gap-6 p-6">
        {/* Left column: clinical data */}
        <div className="flex flex-col gap-6">
          <DiagnosisTable diagnoses={data.diagnoses} />
          <AssessmentTable assessments={data.assessments} />
          <TreatmentPlanSummary plan={data.treatmentPlan} />
          <CaregiverTable caregivers={data.caregivers} />
        </div>

        {/* Right column: operational data */}
        <div className="flex flex-col gap-6">
          <ExerciseTable exercises={data.exercises} />

          {/* Referral Tracking */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-row items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">Referral Tracking</h2>
                <Button variant="secondary" size="sm">+ Add Referral</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-xs font-medium text-gray-500">Provider</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Reason</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.referrals.map((ref) => (
                    <TableRow key={`${ref.provider}-${ref.date}`} className="border-b border-gray-100">
                      <TableCell className="text-sm text-gray-700">{ref.provider}</TableCell>
                      <TableCell className="text-sm text-gray-700">{ref.date}</TableCell>
                      <TableCell className="text-sm text-gray-700">{ref.reason}</TableCell>
                      <TableCell>
                        <Badge className={statusBadgeClass(ref.status)}>{ref.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Authorization Summary */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-row items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">Authorization Summary</h2>
                <Button variant="secondary" size="sm">Request Auth</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-xs font-medium text-gray-500">CPT Code</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Authorized</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Used</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Remaining</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">KX Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.authorizations.map((auth) => (
                    <TableRow key={auth.cptCode} className="border-b border-gray-100">
                      <TableCell className="text-sm text-gray-700">{auth.cptCode}</TableCell>
                      <TableCell className="text-sm text-gray-700">{auth.authorized}</TableCell>
                      <TableCell className="text-sm text-gray-700">{auth.used}</TableCell>
                      <TableCell className="text-sm text-gray-700">{auth.remaining}</TableCell>
                      <TableCell>
                        <Badge className={statusBadgeClass(auth.kxStatus)}>{auth.kxStatus}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-row items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">Upcoming Sessions</h2>
                <Button variant="secondary" size="sm">Schedule Session</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Time</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Type</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Provider</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.upcomingSessions.map((s) => (
                    <TableRow key={`${s.date}-${s.time}`} className="border-b border-gray-100">
                      <TableCell className="text-sm text-gray-700">{s.date}</TableCell>
                      <TableCell className="text-sm text-gray-700">{s.time}</TableCell>
                      <TableCell className="text-sm text-gray-700">{s.type}</TableCell>
                      <TableCell className="text-sm text-gray-700">{s.provider}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Progress Notes */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-row items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">Recent Progress Notes</h2>
                <Button variant="secondary" size="sm">Create Note</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Note Type</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Provider</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.progressNotes.map((note) => (
                    <TableRow key={`${note.date}-${note.noteType}`} className="border-b border-gray-100">
                      <TableCell className="text-sm text-gray-700">{note.date}</TableCell>
                      <TableCell className="text-sm text-gray-700">{note.noteType}</TableCell>
                      <TableCell className="text-sm text-gray-700">{note.provider}</TableCell>
                      <TableCell>
                        <Badge className={statusBadgeClass(note.status)}>{note.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Render sequence index 2: actions */}
      <div className="flex flex-row items-center justify-center gap-3 p-6 border-t border-gray-200 bg-white">
        <Link href="/patients/PAT-2024-0156/evaluation">
          <Button>Start Evaluation</Button>
        </Link>
        <Link href="/patients/PAT-2024-0156/treatment-plan">
          <Button variant="secondary">Create Treatment Plan</Button>
        </Link>
        <Link href="/patients/PAT-2024-0156/session-note">
          <Button variant="secondary">Schedule Session</Button>
        </Link>
        <Button variant="secondary">Edit Patient</Button>
        <Button variant="destructive">Initiate Discharge</Button>
      </div>
    </div>
  )
}
