import { LayoutDashboard } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<LayoutDashboard className="size-6" />}
        title="Dashboard"
        description="Home dashboard coming soon"
      />
    </div>
  )
}
