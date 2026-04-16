import type { Patient } from "@/types/patient"

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Emma Thompson",
    dateOfBirth: "03/15/2018",
    primaryDiagnosis: "Articulation/Phonology",
    provider: "Dr. Sarah Johnson, CCC-SLP",
    insurance: "Blue Cross Blue Shield",
    authStatus: "Authorized",
    nextAppointment: "12/18/2024 2:00 PM",
    status: "Active Treatment",
    mrn: "MRN-10001",
    phone: "(555) 123-4567",
  },
  {
    id: "2",
    name: "Mason Rodriguez",
    dateOfBirth: "07/22/2016",
    primaryDiagnosis: "Expressive Language",
    provider: "Dr. Michael Chen, CCC-SLP",
    insurance: "Medicaid",
    authStatus: "Pending",
    nextAppointment: "12/19/2024 10:00 AM",
    status: "Active Treatment",
    mrn: "MRN-10002",
    phone: "(555) 234-5678",
  },
  {
    id: "3",
    name: "Sophia Kim",
    dateOfBirth: "11/08/2019",
    primaryDiagnosis: "Fluency",
    provider: "Lisa Rodriguez, CF-SLP",
    insurance: "Aetna",
    authStatus: "Authorized",
    nextAppointment: "12/20/2024 3:30 PM",
    status: "Maintenance",
    mrn: "MRN-10003",
    phone: "(555) 345-6789",
  },
  {
    id: "4",
    name: "Ethan Williams",
    dateOfBirth: "04/12/2017",
    primaryDiagnosis: "Receptive Language",
    provider: "Jennifer Kim, SLPA",
    insurance: "UnitedHealthcare",
    authStatus: "Expired",
    nextAppointment: "\u2014",
    status: "Discharged",
    mrn: "MRN-10004",
    phone: "(555) 456-7890",
  },
  {
    id: "5",
    name: "Ava Davis",
    dateOfBirth: "09/30/2020",
    primaryDiagnosis: "Social Communication/Pragmatics",
    provider: "Dr. Sarah Johnson, CCC-SLP",
    insurance: "Cigna",
    authStatus: "Review Required",
    nextAppointment: "12/21/2024 1:15 PM",
    status: "Waitlist",
    mrn: "MRN-10005",
    phone: "(555) 567-8901",
  },
  {
    id: "6",
    name: "Liam Chen",
    dateOfBirth: "01/05/2015",
    primaryDiagnosis: "Cognitive-Communication",
    provider: "Dr. Michael Chen, CCC-SLP",
    insurance: "Blue Cross Blue Shield",
    authStatus: "Authorized",
    nextAppointment: "12/22/2024 9:00 AM",
    status: "Active Treatment",
    mrn: "MRN-10006",
    phone: "(555) 678-9012",
  },
  {
    id: "7",
    name: "Olivia Martinez",
    dateOfBirth: "06/18/2021",
    primaryDiagnosis: "Voice/Resonance",
    provider: "Lisa Rodriguez, CF-SLP",
    insurance: "Aetna",
    authStatus: "Pending",
    nextAppointment: "12/23/2024 11:30 AM",
    status: "Active Treatment",
    mrn: "MRN-10007",
    phone: "(555) 789-0123",
  },
  {
    id: "8",
    name: "Noah Patel",
    dateOfBirth: "03/27/2018",
    primaryDiagnosis: "AAC/Alternative Communication",
    provider: "Jennifer Kim, SLPA",
    insurance: "Medicaid",
    authStatus: "Authorized",
    nextAppointment: "12/24/2024 2:30 PM",
    status: "Follow-up",
    mrn: "MRN-10008",
    phone: "(555) 890-1234",
  },
  {
    id: "9",
    name: "Isabella Wright",
    dateOfBirth: "10/14/2016",
    primaryDiagnosis: "Hearing/Auditory Processing",
    provider: "Dr. Sarah Johnson, CCC-SLP",
    insurance: "UnitedHealthcare",
    authStatus: "Authorized",
    nextAppointment: "12/26/2024 10:00 AM",
    status: "Active Treatment",
    mrn: "MRN-10009",
    phone: "(555) 901-2345",
  },
  {
    id: "10",
    name: "James Cooper",
    dateOfBirth: "08/02/2019",
    primaryDiagnosis: "Swallowing/Dysphagia",
    provider: "Dr. Michael Chen, CCC-SLP",
    insurance: "Cigna",
    authStatus: "Review Required",
    nextAppointment: "12/27/2024 4:00 PM",
    status: "Maintenance",
    mrn: "MRN-10010",
    phone: "(555) 012-3456",
  },
]

export async function getPatients(): Promise<Patient[]> {
  return MOCK_PATIENTS
}

export function filterPatients(
  patients: Patient[],
  search: string,
  statusFilter: string,
  providerFilter: string
): Patient[] {
  return patients.filter((patient) => {
    const matchesSearch =
      !search ||
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.dateOfBirth.includes(search) ||
      patient.mrn.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search)

    const matchesStatus = !statusFilter || patient.status === statusFilter
    const matchesProvider = !providerFilter || patient.provider === providerFilter

    return matchesSearch && matchesStatus && matchesProvider
  })
}
