import apiClient from "@/lib/axios"
import type { Notification } from "@/lib/api/types"

export async function getNotifications(): Promise<Notification[]> {
  const response = await apiClient.get<Notification[]>("/notifications")
  return response.data
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.put(`/notifications/${id}/read`, {})
}
