import { Contact } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function MembersPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<Contact className="size-6" />}
        title="Members"
        description="Team members and providers"
      />
    </div>
  )
}
