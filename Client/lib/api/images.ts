import apiClient from "@/lib/axios"
import type { ProductDetailsImage, ProductImageType } from "@/lib/api/types"

export async function getProductImages(productId: string): Promise<ProductDetailsImage[]> {
  const response = await apiClient.get<ProductDetailsImage[]>("/productimages", { params: { productId } })
  return response.data
}

export type ProductImagePayload = {
  productId: string
  type?: ProductImageType
  name: string
  url: string
  altText?: string
  sortOrder?: number
}

export async function createProductImage(payload: ProductImagePayload): Promise<string> {
  // POST binds CreateProductImageCommand(CreateProductImageDto ProductImage).
  const response = await apiClient.post<string>("/productimages", { productImage: payload })
  return response.data
}

export async function deleteProductImage(id: string): Promise<void> {
  await apiClient.delete(`/productimages/${id}`)
}
