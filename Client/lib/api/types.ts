// Shared API DTO types mirroring the backend (Marketplace.Application Feature DTOs).
// The backend registers JsonStringEnumConverter, so enums are serialized as STRINGS.

export type ProductStatus = "Draft" | "Published" | "Archived"

export type SalesMode = "ReadyToShip" | "MadeToOrder"

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"

export type OfferStatus = "Pending" | "Accepted" | "Rejected"

export type ProductImageType = "Hero" | "Gallery" | "Story" | "OwnerGallery"

export type ProductListItem = {
  id: string
  name: string
  slug: string
  price: number
  status: ProductStatus
  salesMode: SalesMode
  stock: number
  isSoldOut: boolean
  summary?: string | null
  categoryId: string
  categoryName?: string | null
  categorySlug?: string | null
  artisanId: string
  artisanDisplayName?: string | null
  artisanSlug?: string | null
  primaryImageUrl?: string | null
}

export type ProductDetailsImage = {
  id: string
  type: ProductImageType
  url: string
  altText?: string | null
  sortOrder: number
}

export type ProductDetailsStory = {
  id: string
  title: string
  contentHtml: string
  imageUrl?: string | null
  sortOrder: number
}

export type ProductDetails = {
  id: string
  artisanId: string
  artisanDisplayName?: string | null
  artisanSlug?: string | null
  artisanCraft?: string | null
  artisanBio?: string | null
  artisanRatingAvg: number
  artisanProductCount: number
  artisanAvatarUrl?: string | null
  categoryId: string
  categoryName?: string | null
  categorySlug?: string | null
  slug: string
  name: string
  summary?: string | null
  storyTitle?: string | null
  storyContentHtml?: string | null
  quote?: string | null
  material?: string | null
  technique?: string | null
  productionDurationText?: string | null
  handcraftDurationText?: string | null
  productionStepsText?: string | null
  productionSteps: string[]
  deliveryInfoText?: string | null
  price: number
  stock: number
  status: ProductStatus
  salesMode: SalesMode
  heightText?: string | null
  widthText?: string | null
  weightText?: string | null
  isSoldOut: boolean
  createdAt: string
  updatedAt?: string | null
  images: ProductDetailsImage[]
  stories: ProductDetailsStory[]
  reviewAverage: number
  reviewCount: number
}

export type Category = {
  id: string
  slug: string
  name: string
  description?: string | null
  mood?: string | null
  imageUrl?: string | null
  createdAt?: string
  updatedAt?: string | null
}

export type CartItem = {
  id: string
  productId: string
  productName: string
  imageUrl?: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type Cart = {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
}

export type OrderItem = {
  id: string
  productId: string
  productName: string
  imageUrl?: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type Order = {
  id: string
  orderNo: string
  orderDate: string
  status: OrderStatus
  totalPrice: number
  items: OrderItem[]
}

export type Favorite = {
  id: string
  userId: string
  productId: string
  productName?: string | null
  productSlug?: string | null
  productPrice: number
  productImageUrl?: string | null
  categoryName?: string | null
  artisanDisplayName?: string | null
  isSoldOut: boolean
  createdAt: string
  updatedAt?: string | null
}

export type Address = {
  id: string
  label: string
  fullAddress: string
  city: string
  postalCode: string
  isDefault: boolean
  createdAt?: string
  updatedAt?: string | null
}

export type ProductReview = {
  id: string
  userId: string
  userFullName?: string | null
  userAvatarUrl?: string | null
  productId: string
  rating: number
  comment?: string | null
  isVerifiedBuyer: boolean
  createdAt: string
  updatedAt?: string | null
}

export type ArtisanProfile = {
  id: string
  userId: string
  slug: string
  displayName: string
  craft: string
  city: string
  bio?: string | null
  ratingAvg: number
  followerCount: number
  productCount: number
  isVerified: boolean
}

export type OfferSummary = {
  id: string
  proposedPrice: number
  status: OfferStatus
}

export type ConversationListItem = {
  id: string
  productId: string
  productName: string
  productImageUrl?: string | null
  buyerId: string
  artisanId: string
  artisanProfileId?: string | null
  artisanDisplayName: string
  lastMessage?: string | null
  lastMessageAt?: string | null
  activeOffer?: OfferSummary | null
}

export type Notification = {
  id: string
  type: string
  title: string
  description?: string | null
  isRead: boolean
  targetModule?: string | null
  targetId?: string | null
  createdAt: string
  readAt?: string | null
}
