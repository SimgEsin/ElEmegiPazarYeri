import apiClient from "@/lib/axios"
import type { ProductDetails, ProductListItem, ProductStatus, SalesMode } from "@/lib/api/types"

export type ProductListFilters = {
  categoryId?: string
  categorySlug?: string
  artisanId?: string
  search?: string
  status?: ProductStatus
}

export async function getProducts(
  filters: ProductListFilters = {},
  options?: { signal?: AbortSignal },
): Promise<ProductListItem[]> {
  const response = await apiClient.get<ProductListItem[]>("/products", {
    params: filters,
    signal: options?.signal,
  })
  return response.data
}

export async function getProductById(id: string): Promise<ProductDetails> {
  const response = await apiClient.get<ProductDetails>(`/products/${id}`)
  return response.data
}

export async function getProductBySlug(slug: string): Promise<ProductDetails | null> {
  const response = await apiClient.get<ProductDetails>(`/products/slug/${slug}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
  })
  return response.status === 404 ? null : response.data
}

export type CreateProductPayload = {
  name: string
  categoryId: string
  price: number
  status?: ProductStatus
  salesMode?: SalesMode
  slug?: string
  summary?: string
  storyTitle?: string
  storyContentHtml?: string
  material?: string
  technique?: string
  productionDurationText?: string
  deliveryInfoText?: string
  stock?: number
  heightText?: string
  widthText?: string
  weightText?: string
  isSoldOut?: boolean
}

export async function createProduct(payload: CreateProductPayload): Promise<string> {
  // POST binds CreateProductCommand(CreateProductDto Product) -> wrap in `product`.
  const response = await apiClient.post<string>("/products", { product: payload })
  return response.data
}

export async function updateProduct(id: string, payload: CreateProductPayload): Promise<void> {
  // PUT binds UpdateProductDto directly -> send flat.
  await apiClient.put(`/products/${id}`, payload)
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`)
}
