import type { CancellationRequest } from "@/lib/order-types"

export type ProductStatus = "Yayında" | "Taslak" | "Stokta Az"

export type ProductSalesMode = "Hazır Eser" | "Siparişe Özel Üretim"

export type ProductImage = {
  name: string
  previewUrl: string
  alt?: string
}

export type OrderStatus = "Hazırlanıyor" | "Kargoya Verildi" | "Teslim Edildi" | "İptal Edildi"

export type ArtisanProduct = {
  id: string
  slug: string
  pageHref: string | null
  artisanSlug: string
  artisanName: string
  name: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  salesMode: ProductSalesMode
  summary: string
  storyTitle: string
  storyContent: string
  storyImages: ProductImage[]
  material: string
  technique: string
  productionDuration: string
  deliveryInfo: string
  dimensions: {
    height: string
    width: string
    weight: string
  }
  heroImage: ProductImage | null
  galleryImages: ProductImage[]
  views: number
  salesCount: number
  revenue: number
}

export type ProductStory = {
  id: string
  slug: string
  title: string
  excerpt: string
  contentHtml: string
  coverImage: ProductImage | null
  storyImages: ProductImage[]
  artisanSlug: string
  artisanName: string
  productId: string
  productName: string
  productSlug: string
  productPageHref: string | null
  category: string
  readTime: string
  isFeatured: boolean
}

export type ArtisanOrder = {
  id: string
  referenceId: string
  customerName: string
  productName: string
  quantity: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  cancellationRequest?: CancellationRequest
}
