import apiClient from "@/lib/axios"
import { calculateReadTimeLabel, createExcerptFromHtml, createSlug } from "@/lib/catalog"
import type { ProductDetailsStory } from "@/lib/api/types"
import type { ProductStory } from "@/app/artisan-panel/panel-types"

export type StoryFeedItem = {
  id: string
  title: string
  contentHtml: string
  imageUrl?: string | null
  productId: string
  productName: string
  productSlug: string
  artisanDisplayName?: string | null
  categoryName?: string | null
  sortOrder: number
  createdAt: string
}

export async function getStoriesFeed(): Promise<StoryFeedItem[]> {
  const response = await apiClient.get<StoryFeedItem[]>("/productstories/feed")
  return response.data
}

// API feed öğesini, mevcut hikaye bileşenlerinin (hero/arşiv/detay) beklediği
// ProductStory şekline çevirir. Tasarım/markup aynı; yalnızca veri kaynağı API.
export function mapStoryFeedToProductStory(item: StoryFeedItem, isFeatured = false): ProductStory {
  const coverImage = item.imageUrl?.trim()
    ? { name: item.title, previewUrl: item.imageUrl, alt: item.title }
    : null

  return {
    id: item.id,
    slug: createSlug(item.title || item.productName),
    title: item.title,
    excerpt: createExcerptFromHtml(item.contentHtml),
    contentHtml: item.contentHtml,
    coverImage,
    storyImages: coverImage ? [coverImage] : [],
    artisanSlug: "",
    artisanName: item.artisanDisplayName ?? "",
    productId: item.productId,
    productName: item.productName,
    productSlug: item.productSlug,
    productPageHref: item.productSlug ? `/products/${item.productSlug}` : null,
    category: item.categoryName ?? "",
    readTime: calculateReadTimeLabel(item.contentHtml),
    isFeatured,
  }
}

// Feed'i çekip ProductStory listesine map'ler. İlk öğe (en yeni) öne çıkarılır.
export async function getMappedStories(): Promise<ProductStory[]> {
  const feed = await getStoriesFeed()
  return feed.map((item, index) => mapStoryFeedToProductStory(item, index === 0))
}

export async function getProductStories(productId?: string): Promise<ProductDetailsStory[]> {
  const params = productId ? { productId } : undefined
  const response = await apiClient.get<ProductDetailsStory[]>("/productstories", { params })
  return response.data
}

export type ProductStoryPayload = {
  productId: string
  title: string
  contentHtml: string
  imageUrl?: string
  sortOrder?: number
}

export async function createProductStory(payload: ProductStoryPayload): Promise<string> {
  // POST binds CreateProductStoryCommand(CreateProductStoryDto ProductStory).
  const response = await apiClient.post<string>("/productstories", { productStory: payload })
  return response.data
}

export async function deleteProductStory(id: string): Promise<void> {
  await apiClient.delete(`/productstories/${id}`)
}
