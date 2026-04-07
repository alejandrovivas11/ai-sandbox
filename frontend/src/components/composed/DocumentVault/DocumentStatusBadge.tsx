import { Badge } from '@/components/ui'
import type { DocumentStatus } from '@/types/documents'

interface DocumentStatusBadgeProps {
  status: DocumentStatus
}

const statusConfig: Record<
  DocumentStatus,
  { label: string; className: string; dotColor: string }
> = {
  Active: {
    label: 'Active',
    className: 'bg-[#dcfce7] text-[#16a34a] border-[#16a34a]/20',
    dotColor: '#16a34a',
  },
  'Expiring Soon': {
    label: 'Expiring Soon',
    className: 'bg-[#fef3c7] text-[#d97706] border-[#d97706]/20',
    dotColor: '#d97706',
  },
  Expired: {
    label: 'Expired',
    className: 'bg-[#fee2e2] text-[#dc2626] border-[#ef4444]/20',
    dotColor: '#dc2626',
  },
  Flagged: {
    label: 'Flagged',
    className: 'bg-[#ede9fe] text-[#7c3aed] border-[#8b5cf6]/20',
    dotColor: '#7c3aed',
  },
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.dotColor }}
      />
      {config.label}
    </span>
  )
}
