import { Mail } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function MessagesPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<Mail className="size-6" />}
        title="Messages"
        description="Secure messaging"
      />
    </div>
  )
}
