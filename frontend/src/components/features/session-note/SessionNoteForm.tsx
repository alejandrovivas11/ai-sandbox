"use client"

import type { SessionNoteData, GoalData, TelehealthInfo, SignatureInfo } from "@/types/session-note"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

interface SessionNoteFormProps {
  formData: SessionNoteData
  onUpdateField: <K extends keyof SessionNoteData>(field: K, value: SessionNoteData[K]) => void
  onUpdateGoal: (index: number, field: keyof GoalData, value: string) => void
  onUpdateTelehealth: <K extends keyof TelehealthInfo>(field: K, value: TelehealthInfo[K]) => void
  onUpdateSignature: <K extends keyof SignatureInfo>(field: K, value: SignatureInfo[K]) => void
}

function SB({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b pb-6 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">{label}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function FW({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Sel({ value, onValueChange, children, disabled }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="bg-white border border-[#E5E5E5]"><SelectValue /></SelectTrigger>
      <SelectContent className="bg-white">{children}</SelectContent>
    </Select>
  )
}

export function SessionNoteForm({ formData, onUpdateField, onUpdateGoal, onUpdateTelehealth, onUpdateSignature }: SessionNoteFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <form className="flex flex-col">
          <SB label="Session Metadata">
            <div className="grid grid-cols-4 gap-4">
              <FW label="Date of Service"><Input type="date" value={formData.dateOfService} onChange={(e) => onUpdateField("dateOfService", e.target.value)} /></FW>
              <FW label="Start Time"><Input type="text" value={formData.startTime} onChange={(e) => onUpdateField("startTime", e.target.value)} /></FW>
              <FW label="End Time"><Input type="text" value={formData.endTime} onChange={(e) => onUpdateField("endTime", e.target.value)} /></FW>
              <FW label="Duration"><Input type="text" value={formData.duration} readOnly className="bg-gray-50" /></FW>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FW label="Service Type"><Sel value={formData.serviceType} onValueChange={(v) => onUpdateField("serviceType", v)}><SelectItem value="Individual Treatment">Individual Treatment</SelectItem><SelectItem value="Group Treatment">Group Treatment</SelectItem><SelectItem value="Consultation">Consultation</SelectItem><SelectItem value="Evaluation">Evaluation</SelectItem></Sel></FW>
              <FW label="CPT Codes"><Sel value={formData.cptCode} onValueChange={(v) => onUpdateField("cptCode", v)}><SelectItem value="92507">92507 - Speech/Language Treatment</SelectItem><SelectItem value="92508">92508 - Speech/Language Treatment Group</SelectItem><SelectItem value="92521">92521 - Evaluation</SelectItem><SelectItem value="92523">92523 - Evaluation with Hearing Screening</SelectItem></Sel></FW>
              <FW label="Service Delivery Mode"><Sel value={formData.serviceDeliveryMode} onValueChange={(v) => onUpdateField("serviceDeliveryMode", v)}><SelectItem value="In-Person">In-Person</SelectItem><SelectItem value="Telehealth">Telehealth</SelectItem></Sel></FW>
            </div>
          </SB>

          <SB label="Subjective">
            <FW label="Patient/Caregiver Report"><Textarea rows={4} value={formData.patientReport} onChange={(e) => onUpdateField("patientReport", e.target.value)} /></FW>
            <div className="grid grid-cols-2 gap-4">
              <FW label="Caregiver Present"><Sel value={formData.caregiverPresent} onValueChange={(v) => onUpdateField("caregiverPresent", v)}><SelectItem value="No">No</SelectItem><SelectItem value="Yes - Mother">Yes - Mother</SelectItem><SelectItem value="Yes - Father">Yes - Father</SelectItem><SelectItem value="Yes - Guardian">Yes - Guardian</SelectItem><SelectItem value="Yes - Other">Yes - Other</SelectItem></Sel></FW>
              <FW label="Patient Engagement Level"><Sel value={formData.engagementLevel} onValueChange={(v) => onUpdateField("engagementLevel", v)}><SelectItem value="Poor">Poor</SelectItem><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Excellent">Excellent</SelectItem></Sel></FW>
            </div>
          </SB>

          <SB label="Objective">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Goal</TableHead>
                    <TableHead className="font-medium">Target Behavior</TableHead>
                    <TableHead className="font-medium">% Accuracy</TableHead>
                    <TableHead className="font-medium">Cueing Level</TableHead>
                    <TableHead className="font-medium">Trials</TableHead>
                    <TableHead className="font-medium">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.goals.map((goal, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-sm text-gray-700">{goal.goal}</TableCell>
                      <TableCell className="text-sm text-gray-700">{goal.targetBehavior}</TableCell>
                      <TableCell className="text-sm text-gray-700">{goal.accuracy}</TableCell>
                      <TableCell className="text-sm text-gray-700">{goal.cueingLevel}</TableCell>
                      <TableCell className="text-sm text-gray-700">{goal.trials}</TableCell>
                      <TableCell className="text-sm text-gray-700">{goal.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <FW label="Articulation-Specific Data"><Textarea rows={3} value={formData.articulationData} onChange={(e) => onUpdateField("articulationData", e.target.value)} /></FW>
          </SB>
          <SB label="Assessment">
            <FW label="Clinical Assessment"><Textarea rows={4} value={formData.clinicalAssessment} onChange={(e) => onUpdateField("clinicalAssessment", e.target.value)} /></FW>
          </SB>

          <SB label="Plan">
            <FW label="Next Session Focus"><Textarea rows={3} value={formData.nextSessionFocus} onChange={(e) => onUpdateField("nextSessionFocus", e.target.value)} /></FW>
            <div className="grid grid-cols-2 gap-4">
              <FW label="Treatment Modifications"><Input type="text" value={formData.treatmentModifications} onChange={(e) => onUpdateField("treatmentModifications", e.target.value)} /></FW>
              <FW label="Home Program Assigned"><Input type="text" value={formData.homeProgramAssigned} onChange={(e) => onUpdateField("homeProgramAssigned", e.target.value)} /></FW>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FW label="Caregiver Training Provided"><Sel value={formData.caregiverTraining} onValueChange={(v) => onUpdateField("caregiverTraining", v)}><SelectItem value="No">No</SelectItem><SelectItem value="Yes - Basic techniques">Yes - Basic techniques</SelectItem><SelectItem value="Yes - Cueing techniques demonstrated">Yes - Cueing techniques demonstrated</SelectItem><SelectItem value="Yes - Home program review">Yes - Home program review</SelectItem><SelectItem value="Yes - Equipment training">Yes - Equipment training</SelectItem></Sel></FW>
              <FW label="Anticipated Discharge"><Input type="text" value={formData.anticipatedDischarge} onChange={(e) => onUpdateField("anticipatedDischarge", e.target.value)} /></FW>
            </div>
          </SB>

          <SB label="Telehealth Documentation">
            <div className="grid grid-cols-3 gap-4">
              <FW label="Platform"><Sel value={formData.telehealth.platform} onValueChange={(v) => onUpdateTelehealth("platform", v)}><SelectItem value="N/A - In-Person">N/A - In-Person</SelectItem><SelectItem value="Zoom">Zoom</SelectItem><SelectItem value="Teams">Teams</SelectItem><SelectItem value="Doxy.me">Doxy.me</SelectItem><SelectItem value="SimplePractice">SimplePractice</SelectItem><SelectItem value="Other">Other</SelectItem></Sel></FW>
              <FW label="Patient Location"><Input type="text" value={formData.telehealth.patientLocation} onChange={(e) => onUpdateTelehealth("patientLocation", e.target.value)} /></FW>
              <FW label="Provider Location"><Input type="text" value={formData.telehealth.providerLocation} onChange={(e) => onUpdateTelehealth("providerLocation", e.target.value)} /></FW>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FW label="Consent Confirmed"><Sel value={formData.telehealth.consentConfirmed} onValueChange={(v) => onUpdateTelehealth("consentConfirmed", v)}><SelectItem value="N/A">N/A</SelectItem><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></Sel></FW>
              <FW label="Connectivity Quality"><Sel value={formData.telehealth.connectivityQuality} onValueChange={(v) => onUpdateTelehealth("connectivityQuality", v)}><SelectItem value="N/A">N/A</SelectItem><SelectItem value="Excellent">Excellent</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Poor">Poor</SelectItem></Sel></FW>
            </div>
          </SB>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Signature</h3>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <FW label="Provider Signature"><Input type="text" value={formData.signature.providerSignature} readOnly className="bg-gray-50" /></FW>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FW label="Requires Co-signature"><Sel value={formData.signature.requiresCosignature} onValueChange={(v) => onUpdateSignature("requiresCosignature", v)}><SelectItem value="No">No</SelectItem><SelectItem value="Yes - SLPA">Yes - SLPA</SelectItem><SelectItem value="Yes - CF-SLP">Yes - CF-SLP</SelectItem></Sel></FW>
                <FW label="Supervising Provider"><Sel value={formData.signature.supervisingProvider || "__empty__"} onValueChange={(v) => onUpdateSignature("supervisingProvider", v === "__empty__" ? "" : v)} disabled={true}><SelectItem value="__empty__">Select provider</SelectItem><SelectItem value="Dr. Sarah Miller, CCC-SLP">Dr. Sarah Miller, CCC-SLP</SelectItem><SelectItem value="Jennifer Smith, CCC-SLP">Jennifer Smith, CCC-SLP</SelectItem></Sel></FW>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
