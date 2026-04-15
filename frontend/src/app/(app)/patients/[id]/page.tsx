"use client"

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/Breadcrumb"
import { Badge } from "@/components/ui/Badge"
import {
  Card,
  CardContent,
} from "@/components/ui/Card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import { usePatientChart } from "@/hooks/usePatientChart"
import { PatientDemographics } from "@/components/features/patient/PatientDemographics"
import { PatientActions } from "@/components/features/patient/PatientActions"

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

  const { patient, diagnoses, assessments, treatmentPlans, sessions, caregiver, homePrograms, referrals } = data

  return (
    <div className="flex flex-col flex-1">
      {/* Section 0: Breadcrumb */}
      <div className="px-6 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{patient.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Section 1: Header */}
      <div className="flex flex-col bg-white border-b px-6 py-6">
        {/* Title + Actions row */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
          <PatientActions />
        </div>

        {/* Demographics */}
        <PatientDemographics patient={patient} />

        {/* Badges */}
        <div className="flex flex-row gap-2 mt-4">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Authorized</Badge>
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Re-eval Due {patient.reEvalDue}</Badge>
        </div>
      </div>

      {/* Section 2: Main grid */}
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Card: Diagnoses */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Diagnoses</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500">ICD-10 Code</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Description</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Provider</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnoses.map((d, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="text-sm text-gray-700">{d.icdCode}</TableCell>
                    <TableCell className="text-sm text-gray-700">{d.description}</TableCell>
                    <TableCell className="text-sm text-gray-700">{d.date}</TableCell>
                    <TableCell className="text-sm text-gray-700">{d.provider}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card: Assessment Summary */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Assessment Summary</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500">Assessment</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Score</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Percentile</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((a, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="text-sm text-gray-700">{a.name}</TableCell>
                    <TableCell className="text-sm text-gray-700">{a.date}</TableCell>
                    <TableCell className="text-sm text-gray-700">{a.score}</TableCell>
                    <TableCell className="text-sm text-gray-700">{a.percentile}</TableCell>
                    <TableCell className="text-sm text-gray-700">{a.severity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card: Treatment Plan */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Treatment Plan</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500">Goal Domain</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Active Goals</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatmentPlans.map((t, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="text-sm text-gray-700">{t.goalDomain}</TableCell>
                    <TableCell className="text-sm text-gray-700">{t.activeGoals}</TableCell>
                    <TableCell className="text-sm text-gray-700">{t.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card: Session History */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Session History</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Type</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Duration</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Clinician</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Goal Areas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="text-sm text-gray-700">{s.date}</TableCell>
                    <TableCell className="text-sm text-gray-700">{s.type}</TableCell>
                    <TableCell className="text-sm text-gray-700">{s.duration}</TableCell>
                    <TableCell className="text-sm text-gray-700">{s.clinician}</TableCell>
                    <TableCell className="text-sm text-gray-700">{s.goalAreas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card: Caregiver & Family Info */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Caregiver &amp; Family Info</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Primary Caregiver</span>
                  <span className="text-sm text-gray-900">{caregiver.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Relationship</span>
                  <span className="text-sm text-gray-900">{caregiver.relationship}</span>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Phone</span>
                  <span className="text-sm text-gray-900">{caregiver.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Email</span>
                  <span className="text-sm text-gray-900">{caregiver.email}</span>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Preferred Language</span>
                  <span className="text-sm text-gray-900">{caregiver.preferredLanguage}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Home Program Participation</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mt-1">{caregiver.homeProgramParticipation}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Home Program */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Home Program</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500">Exercise</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Frequency</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Compliance</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homePrograms.map((h, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="text-sm text-gray-700">{h.exercise}</TableCell>
                    <TableCell className="text-sm text-gray-700">{h.frequency}</TableCell>
                    <TableCell className="text-sm text-gray-700">{h.compliance}</TableCell>
                    <TableCell className="text-sm text-gray-700">{h.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card: Referral Tracking */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Referral Tracking</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500">Source</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Reason</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((r, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="text-sm text-gray-700">{r.source}</TableCell>
                    <TableCell className="text-sm text-gray-700">{r.date}</TableCell>
                    <TableCell className="text-sm text-gray-700">{r.reason}</TableCell>
                    <TableCell className="text-sm text-gray-700">{r.status}</TableCell>
                    <TableCell className="text-sm text-gray-700">{r.followUp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
