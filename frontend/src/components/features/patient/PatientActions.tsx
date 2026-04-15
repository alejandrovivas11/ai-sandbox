import { Button } from "@/components/ui/Button"

export function PatientActions() {
  return (
    <div className="flex flex-row gap-2">
      <Button variant="secondary">Edit Patient</Button>
      <Button variant="secondary">Print</Button>
      <Button>New Referral</Button>
    </div>
  )
}
