import apiClient from "@/lib/axios"
import type { ProductReview } from "@/lib/api/types"

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const response = await apiClient.get<ProductReview[]>("/productreviews", { params: { productId } })
  return response.data
}

export async function getAllReviews(options?: { signal?: AbortSignal }): Promise<ProductReview[]> {
  const response = await apiClient.get<ProductReview[]>("/productreviews", { signal: options?.signal })
  return response.data
}

export async function createReview(productId: string, rating: number, comment?: string): Promise<string> {
  // POST binds CreateProductReviewCommand(CreateProductReviewDto ProductReview).
  const response = await apiClient.post<string>("/productreviews", {
    productReview: { productId, rating, comment },
  })
  return response.data
}

export async function deleteReview(reviewId: string): Promise<void> {
  await apiClient.delete(`/productreviews/${reviewId}`)
}
