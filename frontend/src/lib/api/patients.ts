import type { Patient, Therapist } from "@/types/patient"

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    dateOfBirth: "03/15/1985",
    status: "active",
    phone: "(555) 123-4567",
    insurance: "BlueCross BlueShield",
    therapist: "Dr. Smith",
    mrn: "MRN-001",
  },
  {
    id: "2",
    name: "Michael Chen",
    dateOfBirth: "07/22/1992",
    status: "active",
    phone: "(555) 987-6543",
    insurance: "Aetna",
    therapist: "Dr. Jones",
    mrn: "MRN-002",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    dateOfBirth: "12/08/1978",
    status: "inactive",
    phone: "(555) 456-7890",
    insurance: "UnitedHealthcare",
    therapist: "Dr. Wilson",
    mrn: "MRN-003",
  },
  {
    id: "4",
    name: "David Thompson",
    dateOfBirth: "05/14/1990",
    status: "active",
    phone: "(555) 321-9876",
    insurance: "Cigna",
    therapist: "Dr. Smith",
    mrn: "MRN-004",
  },
  {
    id: "5",
    name: "Lisa Williams",
    dateOfBirth: "09/30/1987",
    status: "discharged",
    phone: "(555) 654-3210",
    insurance: "Humana",
    therapist: "Dr. Jones",
    mrn: "MRN-005",
  },
]

const MOCK_THERAPISTS: Therapist[] = [
  { id: "dr_smith", name: "Dr. Smith" },
  { id: "dr_jones", name: "Dr. Jones" },
  { id: "dr_wilson", name: "Dr. Wilson" },
]

export async function getPatients(): Promise<Patient[]> {
  return MOCK_PATIENTS
}

export async function getTherapists(): Promise<Therapist[]> {
  return MOCK_THERAPISTS
}

export function filterPatients(
  patients: Patient[],
  search: string,
  statusFilter: string,
  therapistFilter: string
): Patient[] {
  return patients.filter((patient) => {
    const matchesSearch =
      !search ||
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.dateOfBirth.includes(search) ||
      patient.mrn.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search)

    const matchesStatus = !statusFilter || patient.status === statusFilter

    const matchesTherapist =
      !therapistFilter || patient.therapist === therapistFilter

    return matchesSearch && matchesStatus && matchesTherapist
  })
}
