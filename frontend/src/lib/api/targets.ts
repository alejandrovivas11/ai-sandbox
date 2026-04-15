import { Target } from '@/types/target'
import { Target as MoveTarget, Program } from '@/types/targets'

const MOCK_TARGETS: Target[] = [
  {
    id: '1',
    name: 'Enterprise Security Assessment',
    status: 'Active',
    progress: 85,
    category: 'Security',
    author: 'John Smith',
    timestamp: '2024-01-15 14:30',
    selected: false,
  },
  {
    id: '2',
    name: 'Network Infrastructure Review',
    status: 'In Progress',
    progress: 42,
    category: 'Infrastructure',
    author: 'Sarah Johnson',
    timestamp: '2024-01-14 09:15',
    selected: false,
  },
  {
    id: '3',
    name: 'Application Vulnerability Scan',
    status: 'Failed',
    progress: 12,
    category: 'Application',
    author: 'Mike Chen',
    timestamp: '2024-01-13 16:45',
    selected: false,
  },
  {
    id: '4',
    name: 'Compliance Audit Preparation',
    status: 'Scheduled',
    progress: 0,
    category: 'Compliance',
    author: 'Lisa Brown',
    timestamp: '2024-01-12 11:20',
    selected: false,
  },
  {
    id: '5',
    name: 'Data Privacy Impact Assessment',
    status: 'Completed',
    progress: 100,
    category: 'Privacy',
    author: 'David Wilson',
    timestamp: '2024-01-11 13:10',
    selected: false,
  },
]

export async function getTargets(): Promise<MoveTarget[]> {
  return MOCK_TARGETS.map((t) => ({
    ...t,
    status: t.status as MoveTarget['status'],
    program: t.category,
  }))
}

export async function getDestinationPrograms(): Promise<Program[]> {
  return [
    {
      id: 'prog-1',
      name: 'Security Program',
      phases: [
        { id: 'phase-1', name: 'Assessment' },
        { id: 'phase-2', name: 'Remediation' },
      ],
    },
    {
      id: 'prog-2',
      name: 'Compliance Program',
      phases: [
        { id: 'phase-3', name: 'Audit' },
        { id: 'phase-4', name: 'Certification' },
      ],
    },
  ]
}

export async function bulkChangeStatus(
  targetIds: string[],
  _newStatus: string
): Promise<void> {
  console.log('Bulk change status:', targetIds, _newStatus)
}

export async function bulkMoveTargets(
  targetIds: string[],
  _destination: string
): Promise<void> {
  console.log('Bulk move targets:', targetIds, _destination)
}
