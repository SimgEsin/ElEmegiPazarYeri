import apiClient from "@/lib/axios"
import type { OrderStatus } from "@/lib/api/types"

export type CategoryShare = {
  name: string
  productCount: number
  percentage: number
}

export type AdminAnalytics = {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalArtisans: number
  categoryMix: CategoryShare[]
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const response = await apiClient.get<AdminAnalytics>("/admin/analytics")
  return response.data
}

export type AdminOrder = {
  id: string
  orderNo: string
  customerName: string
  artisanName: string
  productName: string
  quantity: number
  totalPrice: number
  status: OrderStatus
  orderDate: string
  cancellationReason?: string | null
  cancellationRequestedAt?: string | null
}

export async function getAdminOrders(options?: { signal?: AbortSignal }): Promise<AdminOrder[]> {
  const response = await apiClient.get<AdminOrder[]>("/admin/orders", { signal: options?.signal })
  return response.data
}

export async function cancelAdminOrder(orderId: string): Promise<void> {
  await apiClient.post(`/admin/orders/${orderId}/cancel`)
}
