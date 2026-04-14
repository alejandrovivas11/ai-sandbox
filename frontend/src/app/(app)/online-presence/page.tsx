import { Globe } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function OnlinePresencePage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<Globe className="size-6" />}
        title="Online Presence"
        description="Web presence management"
      />
    </div>
  )
}
