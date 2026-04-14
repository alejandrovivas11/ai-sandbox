import { Banknote } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function PaymentsPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<Banknote className="size-6" />}
        title="Payments"
        description="Billing and revenue cycle"
      />
    </div>
  )
}
