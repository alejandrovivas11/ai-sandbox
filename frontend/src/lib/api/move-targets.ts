import { Target, Program, Client } from "@/types/move-targets"

const mockClient: Client = {
  id: "client-1",
  name: "ABC Corporation",
  organizationName: "ABC Corporation",
}

const mockSourcePrograms: Program[] = [
  { id: "prog-1", name: "Behavioral Program 2024", type: "Behavioral", year: 2024, active: true },
  { id: "prog-2", name: "Social Skills Phase 1", type: "Social", year: 2024, active: true },
  { id: "prog-3", name: "Communication Goals Q1", type: "Communication", year: 2024, active: true },
  { id: "prog-4", name: "Academic Support 2024", type: "Academic", year: 2024, active: true },
  { id: "prog-5", name: "Transition Planning", type: "Transition", year: 2024, active: true },
]

const mockDestinationPrograms: Program[] = [
  { id: "dest-1", name: "Advanced Skills Program 2024", type: "Advanced", year: 2024, active: true },
  { id: "dest-2", name: "Social Skills Phase 2", type: "Social", year: 2024, active: true },
  { id: "dest-3", name: "Communication Goals Q2", type: "Communication", year: 2024, active: true },
  { id: "dest-4", name: "Maintenance Program", type: "Maintenance", year: 2024, active: true },
  { id: "dest-5", name: "Generalization Phase", type: "Generalization", year: 2024, active: true },
]

const mockTargets: Target[] = [
  {
    id: "target-1",
    description: "Increase eye contact during conversations",
    status: "Active",
    category: "Social",
    programId: "prog-1",
    selected: false,
  },
  {
    id: "target-2",
    description: "Follow two-step instructions independently",
    status: "In Progress",
    category: "Behavioral",
    programId: "prog-1",
    selected: true,
  },
  {
    id: "target-3",
    description: "Use appropriate greetings with peers",
    status: "Active",
    category: "Communication",
    programId: "prog-2",
    selected: false,
  },
  {
    id: "target-4",
    description: "Complete academic tasks without prompting",
    status: "Completed",
    category: "Academic",
    programId: "prog-4",
    selected: true,
  },
  {
    id: "target-5",
    description: "Demonstrate problem-solving skills in group activities",
    status: "Draft",
    category: "Social",
    programId: "prog-2",
    selected: false,
  },
]

export async function getClient(): Promise<Client> {
  return mockClient
}

export async function getSourcePrograms(): Promise<Program[]> {
  return mockSourcePrograms
}

export async function getDestinationPrograms(): Promise<Program[]> {
  return mockDestinationPrograms
}

export async function getTargets(): Promise<Target[]> {
  return mockTargets
}

export async function moveTargets(
  targetIds: string[],
  destinationProgramId: string
): Promise<void> {
  // Mock implementation
  console.log("Moving targets", targetIds, "to", destinationProgramId)
}
