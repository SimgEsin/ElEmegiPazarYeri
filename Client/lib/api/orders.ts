import apiClient from "@/lib/axios"
import type { ArtisanOrder, Order, OrderStatus } from "@/lib/api/types"

export async function checkout(): Promise<string> {
  const response = await apiClient.post<string>("/orders/checkout", {})
  return response.data
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>("/orders/me")
  return response.data
}

export async function requestOrderCancellation(orderId: string, reason: string): Promise<void> {
  await apiClient.post(`/orders/${orderId}/cancellation-request`, { reason })
}

export async function getArtisanOrders(): Promise<ArtisanOrder[]> {
  const response = await apiClient.get<ArtisanOrder[]>("/orders/artisan")
  return response.data
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await apiClient.put(`/orders/${orderId}/status`, { status })
}
