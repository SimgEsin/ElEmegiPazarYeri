import apiClient from "@/lib/axios"

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
