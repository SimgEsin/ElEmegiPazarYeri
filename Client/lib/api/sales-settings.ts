import apiClient from "@/lib/axios"
import type { SalesSettings } from "@/lib/api/types"

export type SalesSettingsPayload = {
  companyTitle: string
  taxNumber: string
  taxOffice: string
  accountHolder: string
  iban: string
  bankName: string
  shippingCompany: string
}

export async function getMySalesSettings(): Promise<SalesSettings | null> {
  const response = await apiClient.get<SalesSettings>("/salessettings/me", {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
  })
  return response.status === 404 ? null : response.data
}

export async function upsertSalesSettings(payload: SalesSettingsPayload): Promise<string> {
  const response = await apiClient.put<string>("/salessettings", payload)
  return response.data
}
