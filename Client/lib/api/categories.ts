import apiClient from "@/lib/axios"
import type { Category } from "@/lib/api/types"

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>("/categories")
  return response.data
}

export async function getCategoryById(id: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${id}`)
  return response.data
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const response = await apiClient.get<Category>(`/categories/slug/${slug}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
  })
  return response.status === 404 ? null : response.data
}
