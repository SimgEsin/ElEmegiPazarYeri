import apiClient from "@/lib/axios"
import type { Favorite } from "@/lib/api/types"

export async function getFavorites(): Promise<Favorite[]> {
  const response = await apiClient.get<Favorite[]>("/favorites")
  return response.data
}

export async function addFavorite(productId: string): Promise<string> {
  // POST binds CreateFavoriteCommand(CreateFavoriteDto Favorite).
  const response = await apiClient.post<string>("/favorites", { favorite: { productId } })
  return response.data
}

export async function removeFavorite(id: string): Promise<void> {
  await apiClient.delete(`/favorites/${id}`)
}
