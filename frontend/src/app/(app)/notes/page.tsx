import { FileText } from 'lucide-react'
import { EmptyContent } from '@/components/blocks/EmptyContent'

export default function NotesPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyContent
        icon={<FileText className="size-6" />}
        title="Notes"
        description="Clinical documentation"
      />
    </div>
  )
}
