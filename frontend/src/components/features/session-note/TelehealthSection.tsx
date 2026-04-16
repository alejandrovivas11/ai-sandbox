"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import {
  TELEHEALTH_PLATFORM_OPTIONS,
  CONNECTION_QUALITY_OPTIONS,
} from "@/lib/constants/slp-options"
import type { TelehealthData } from "@/types/session-note"

interface TelehealthSectionProps {
  data: TelehealthData
  onUpdate: <K extends keyof TelehealthData>(field: K, value: TelehealthData[K]) => void
}

export function TelehealthSection({ data, onUpdate }: TelehealthSectionProps) {
  return (
    <Card>
      <CardContent className="p-5 flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-gray-900">Telehealth Documentation</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Platform Used</Label>
            <Select
              value={data.platform}
              onValueChange={(v) => onUpdate("platform", v)}
            >
              <SelectTrigger className="bg-white border border-gray-200">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {TELEHEALTH_PLATFORM_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Connection Quality</Label>
            <Select
              value={data.connectionQuality}
              onValueChange={(v) => onUpdate("connectionQuality", v)}
            >
              <SelectTrigger className="bg-white border border-gray-200">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {CONNECTION_QUALITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Patient Location</Label>
            <Input
              placeholder="Where was the patient located?"
              value={data.patientLocation}
              onChange={(e) => onUpdate("patientLocation", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Provider Location</Label>
            <Input
              placeholder="Where was the provider located?"
              value={data.providerLocation}
              onChange={(e) => onUpdate("providerLocation", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Clinical Observations</Label>
          <Textarea
            placeholder="Document any telehealth-specific clinical observations..."
            value={data.clinicalObservations}
            onChange={(e) => onUpdate("clinicalObservations", e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="telehealth-consent"
            checked={!!data.consentConfirmed}
            onCheckedChange={(checked) =>
              onUpdate("consentConfirmed", checked === true)
            }
          />
          <Label htmlFor="telehealth-consent">
            Consent for telehealth services confirmed
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
