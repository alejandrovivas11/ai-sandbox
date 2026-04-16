import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import type { TreatmentPlan } from "@/types/patient-detail"

interface TreatmentPlanSummaryProps {
  plan: TreatmentPlan
}

export function TreatmentPlanSummary({ plan }: TreatmentPlanSummaryProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Treatment Plan Summary</h2>
          <Button variant="secondary" size="sm">Edit Plan</Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Treatment Domains</span>
            <span className="text-sm font-medium text-gray-900">{plan.domains}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Frequency</span>
            <span className="text-sm font-medium text-gray-900">{plan.frequency}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Certification Period</span>
            <span className="text-sm font-medium text-gray-900">{plan.certificationPeriod}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">CPT Codes</span>
            <span className="text-sm font-medium text-gray-900">{plan.cptCodes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
