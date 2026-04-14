import { Settings } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function SettingsPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<Settings className="size-6" />}
        title="Settings"
        description="Practice settings and configuration"
      />
    </div>
  )
}
