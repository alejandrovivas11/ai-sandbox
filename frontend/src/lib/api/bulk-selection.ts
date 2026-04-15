import { BulkRecord } from '@/types/bulk-selection'

const MOCK_RECORDS: BulkRecord[] = [
  {
    id: '1',
    name: 'Project Alpha',
    status: 'active',
    date: '2024-01-15',
    type: 'Research',
    assignee: 'John Smith',
  },
  {
    id: '2',
    name: 'Project Beta',
    status: 'pending',
    date: '2024-01-20',
    type: 'Development',
    assignee: 'Jane Doe',
  },
  {
    id: '3',
    name: 'Project Gamma',
    status: 'inactive',
    date: '2024-01-10',
    type: 'Testing',
    assignee: 'Mike Johnson',
  },
  {
    id: '4',
    name: 'Project Delta',
    status: 'active',
    date: '2024-01-25',
    type: 'Design',
    assignee: 'Sarah Wilson',
  },
  {
    id: '5',
    name: 'Project Epsilon',
    status: 'pending',
    date: '2024-01-30',
    type: 'Analysis',
    assignee: 'Tom Brown',
  },
]

export async function getBulkRecords(): Promise<BulkRecord[]> {
  return MOCK_RECORDS
}

export async function bulkDelete(ids: string[]): Promise<void> {
  console.log('Bulk delete:', ids)
}

export async function bulkExport(ids: string[]): Promise<void> {
  console.log('Bulk export:', ids)
}
