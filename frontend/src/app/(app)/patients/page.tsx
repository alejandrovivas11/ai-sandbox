import { CircleUserRound } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function PatientsPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<CircleUserRound className="size-6" />}
        title="Patients"
        description="Patient registry and records"
      />
    </div>
  )
}
