import apiClient from "@/lib/axios"
import type { Address } from "@/lib/api/types"

export type AddressPayload = {
  label: string
  fullAddress: string
  city: string
  postalCode: string
  isDefault: boolean
}

export async function getAddresses(): Promise<Address[]> {
  const response = await apiClient.get<Address[]>("/addresses")
  return response.data
}

export async function createAddress(payload: AddressPayload): Promise<string> {
  // POST binds CreateAddressCommand(CreateAddressDto Address).
  const response = await apiClient.post<string>("/addresses", { address: payload })
  return response.data
}

export async function updateAddress(id: string, payload: AddressPayload): Promise<void> {
  // PUT binds UpdateAddressDto directly.
  await apiClient.put(`/addresses/${id}`, payload)
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(`/addresses/${id}`)
}
