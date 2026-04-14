import { Calendar } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function CalendarPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<Calendar className="size-6" />}
        title="Calendar"
        description="Schedule and appointments"
      />
    </div>
  )
}
