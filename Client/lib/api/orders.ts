import apiClient from "@/lib/axios"
import type { Order } from "@/lib/api/types"

export async function checkout(): Promise<string> {
  const response = await apiClient.post<string>("/orders/checkout", {})
  return response.data
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>("/orders/me")
  return response.data
}
