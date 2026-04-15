import { Target, Program } from '@/types/targets'

export async function getTargets(): Promise<Target[]> {
  return [
    {
      id: '1',
      name: 'Identify Colors',
      program: 'Early Learning Program',
      status: 'Active',
      selected: false,
    },
    {
      id: '2',
      name: 'Name Body Parts',
      program: 'Early Learning Program',
      status: 'In Progress',
      selected: false,
    },
    {
      id: '3',
      name: 'Count to 10',
      program: 'Early Learning Program',
      status: 'Active',
      selected: false,
    },
    {
      id: '4',
      name: 'Follow Simple Instructions',
      program: 'Early Learning Program',
      status: 'On Hold',
      selected: false,
    },
    {
      id: '5',
      name: 'Match Shapes',
      program: 'Early Learning Program',
      status: 'Active',
      selected: false,
    },
  ]
}

export async function getDestinationPrograms(): Promise<Program[]> {
  return [
    {
      id: 'p1',
      name: 'Early Learning Program',
      phases: [
        { id: 'ph1', name: 'Phase 1', programId: 'p1' },
        { id: 'ph2', name: 'Phase 2', programId: 'p1' },
        { id: 'ph3', name: 'Phase 3', programId: 'p1' },
      ],
    },
    {
      id: 'p2',
      name: 'Language Development Program',
      phases: [
        { id: 'ph4', name: 'Phase 1', programId: 'p2' },
        { id: 'ph5', name: 'Phase 2', programId: 'p2' },
      ],
    },
    {
      id: 'p3',
      name: 'Social Skills Program',
      phases: [
        { id: 'ph6', name: 'Phase 1', programId: 'p3' },
        { id: 'ph7', name: 'Phase 2', programId: 'p3' },
      ],
    },
  ]
}
