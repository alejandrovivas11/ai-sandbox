import type { Client, ClientStatus } from '@/types/client'

export async function getClient(id: string): Promise<Client> {
  return {
    id,
    name: 'Samantha Green',
    initials: 'SG',
    status: 'Active',
  }
}

export async function updateClientStatus(
  clientId: string,
  newStatus: ClientStatus
): Promise<{ success: boolean }> {
  console.log(`Updating client ${clientId} status to: ${newStatus}`)
  return { success: true }
}
