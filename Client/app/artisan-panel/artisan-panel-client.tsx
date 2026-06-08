"use client"

import {
  BarChart3,
  BellDot,
  CheckCircle2,
  MessageSquareText,
  Package,
  PanelLeft,
  Store,
  Truck,
  UserRound,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import AgreementWorkspace, { type AgreementThread } from "./agreement-workspace"
import AnalyticsModule from "./analytics-module"
import MessagesModule from "./messages-module"
import NotificationsModule from "./notifications-module"
import OrderManagementModule from "./order-management-module"
import type { ArtisanProduct, OrderStatus as PanelOrderStatus } from "./panel-types"
import ProductManagementModule from "./product-management-module"
import ProfileManagementModule from "./profile-management-module"
import SalesManagementModule from "./sales-management-module"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMyArtisanProfile } from "@/lib/api/artisans"
import { getCategories } from "@/lib/api/categories"
import {
  getConversationMessages,
  getMyAgreements,
  getMyConversations,
  makeOffer,
  sendMessage,
  type Agreement,
} from "@/lib/api/conversations"
import { createProductImage, deleteProductImage, getProductImages } from "@/lib/api/images"
import { getNotifications, markNotificationRead } from "@/lib/api/notifications"
import { getArtisanOrders, updateOrderStatus } from "@/lib/api/orders"
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  type CreateProductPayload,
} from "@/lib/api/products"
import type {
  ArtisanOrder as ApiArtisanOrder,
  Category,
  ConversationListItem,
  Notification,
  OfferStatus,
  OrderStatus as ApiOrderStatus,
  ProductDetails,
  ProductStatus as ApiProductStatus,
  SalesMode as ApiSalesMode,
} from "@/lib/api/types"
import type { ArtisanOrder } from "./panel-types"
import type { MessageThread, NotificationItem, ThreadMessage } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type PanelTab = "profile" | "sales" | "products" | "orders" | "analytics" | "notifications" | "messages" | "agreements"

const panelTabs = [
  { id: "profile", label: "Profil Yönetimi", icon: UserRound, description: "Atölye ve profil görünümü" },
  { id: "sales", label: "Satış Yönetimi", icon: Store, description: "Ödeme ve teslimat ayarları" },
  { id: "products", label: "Ürün Yönetimi", icon: Package, description: "Ürün ekle, düzenle, filtrele" },
  { id: "orders", label: "Sipariş Yönetimi", icon: Truck, description: "Sipariş takibi ve durum güncelleme" },
  { id: "analytics", label: "Analizler", icon: BarChart3, description: "Panel içi özet performans kartları" },
  { id: "notifications", label: "Bildirim Merkezi", icon: BellDot, description: "İşlem bekleyen tüm sinyaller" },
  { id: "messages", label: "Mesajlar", icon: MessageSquareText, description: "Müşteri görüşmelerini tek akışta yönet" },
  { id: "agreements", label: "Mutabakatlar", icon: CheckCircle2, description: "Karar aşamasındaki kayıtları izle" },
] satisfies {
  id: PanelTab
  label: string
  icon: typeof UserRound
  description: string
}[]

function apiToPanelProductStatus(status: ApiProductStatus): ArtisanProduct["status"] {
  return status === "Published" ? "Yayında" : "Taslak"
}

function panelToApiProductStatus(status: ArtisanProduct["status"]): ApiProductStatus {
  return status === "Taslak" ? "Draft" : "Published"
}

function apiToPanelSalesMode(salesMode: ApiSalesMode): ArtisanProduct["salesMode"] {
  return salesMode === "MadeToOrder" ? "Siparişe Özel Üretim" : "Hazır Eser"
}

function panelToApiSalesMode(salesMode: ArtisanProduct["salesMode"]): ApiSalesMode {
  return salesMode === "Siparişe Özel Üretim" ? "MadeToOrder" : "ReadyToShip"
}

function mapDetailsToArtisanProduct(details: ProductDetails): ArtisanProduct {
  const toImage = (image: ProductDetails["images"][number]) => ({
    name: image.altText ?? "Görsel",
    previewUrl: image.url,
    alt: image.altText ?? undefined,
  })

  const hero = details.images.find((image) => image.type === "Hero") ?? null
  const gallery = details.images
    .filter((image) => image.type === "Gallery")
    .sort((left, right) => left.sortOrder - right.sortOrder)
  const story = details.images
    .filter((image) => image.type === "Story")
    .sort((left, right) => left.sortOrder - right.sortOrder)

  return {
    id: details.id,
    slug: details.slug,
    pageHref: `/products/${details.slug}`,
    artisanSlug: details.artisanSlug ?? "",
    artisanName: details.artisanDisplayName ?? "",
    name: details.name,
    category: details.categoryName ?? "",
    price: details.price,
    stock: details.stock,
    status: apiToPanelProductStatus(details.status),
    salesMode: apiToPanelSalesMode(details.salesMode),
    summary: details.summary ?? "",
    storyTitle: details.storyTitle ?? "",
    storyContent: details.storyContentHtml ?? "",
    storyImages: story.map(toImage),
    material: details.material ?? "",
    technique: details.technique ?? "",
    productionDuration: details.productionDurationText ?? "",
    deliveryInfo: details.deliveryInfoText ?? "",
    dimensions: {
      height: details.heightText ?? "",
      width: details.widthText ?? "",
      weight: details.weightText ?? "",
    },
    heroImage: hero ? toImage(hero) : null,
    galleryImages: gallery.map(toImage),
    views: 0,
    salesCount: 0,
    revenue: 0,
  }
}

function apiToPanelOrderStatus(status: ApiOrderStatus): PanelOrderStatus {
  if (status === "Shipped") {
    return "Kargoya Verildi"
  }
  if (status === "Delivered") {
    return "Teslim Edildi"
  }
  if (status === "Cancelled") {
    return "İptal Edildi"
  }
  return "Hazırlanıyor"
}

function panelToApiOrderStatus(status: PanelOrderStatus): ApiOrderStatus {
  if (status === "Kargoya Verildi") {
    return "Shipped"
  }
  if (status === "Teslim Edildi") {
    return "Delivered"
  }
  if (status === "İptal Edildi") {
    return "Cancelled"
  }
  return "Preparing"
}

function mapApiOrderToPanel(order: ApiArtisanOrder): ArtisanOrder {
  return {
    id: order.id,
    referenceId: order.orderNo,
    customerName: order.customerName,
    productName: order.productName,
    quantity: order.quantity,
    totalAmount: order.totalPrice,
    status: apiToPanelOrderStatus(order.status),
    createdAt: new Date(order.orderDate).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    cancellationRequest: order.cancellationRequestedAt
      ? {
          reason: order.cancellationReason ?? "",
          requestedAt: order.cancellationRequestedAt,
          status: order.status === "Cancelled" ? "İşlendi" : "Beklemede",
        }
      : undefined,
  }
}

function notificationDisplayType(type: string): NotificationItem["type"] {
  const normalized = type.toLowerCase()
  if (normalized === "message") {
    return "message"
  }
  if (normalized === "agreement") {
    return "agreement"
  }
  return "system"
}

function toNotificationItem(notification: Notification): NotificationItem {
  const targetModuleRaw = (notification.targetModule ?? "").toLowerCase()
  const targetModule: NotificationItem["targetModule"] = targetModuleRaw === "agreements" ? "agreements" : "messages"

  return {
    id: notification.id,
    type: notificationDisplayType(notification.type),
    title: notification.title,
    description: notification.description ?? "",
    createdAt: notification.createdAt,
    isRead: notification.isRead,
    targetModule,
    targetId: notification.targetId ?? "",
  }
}

function latestOfferForConversation(
  conversation: ConversationListItem,
  agreements: Agreement[],
): { id: string; proposedPrice: number; status: OfferStatus } | null {
  const latest = agreements
    .filter((agreement) => agreement.conversationId === conversation.id)
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())[0]

  if (latest) {
    return { id: latest.id, proposedPrice: latest.proposedPrice, status: latest.status }
  }

  if (conversation.activeOffer) {
    return {
      id: conversation.activeOffer.id,
      proposedPrice: conversation.activeOffer.proposedPrice,
      status: conversation.activeOffer.status,
    }
  }

  return null
}

function buildThread(conversation: ConversationListItem, messages: ThreadMessage[]): MessageThread {
  return {
    id: conversation.id,
    subject: conversation.productName || "Görüşme",
    participantName: conversation.buyerDisplayName || "Müşteri",
    participantRole: "customer",
    productName: conversation.productName || "Ürün",
    status: conversation.activeOffer ? "Mutabakata Döndü" : "Aktif",
    unreadCount: 0,
    updatedAt: conversation.lastMessageAt ?? new Date().toISOString(),
    messages,
  }
}

function formatTimeLabel(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

export default function ArtisanPanelClient() {
  const [activeTab, setActiveTab] = useState<PanelTab>("profile")

  const [categories, setCategories] = useState<Category[]>([])
  const [artisanUserId, setArtisanUserId] = useState<string | null>(null)
  const [products, setProducts] = useState<ArtisanProduct[]>([])

  const [orders, setOrders] = useState<ArtisanOrder[]>([])

  const [notifications, setNotifications] = useState<Notification[]>([])

  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null)
  const [threadMessages, setThreadMessages] = useState<Record<string, ThreadMessage[]>>({})

  const [agreements, setAgreements] = useState<Agreement[]>([])

  const loadProducts = useCallback(async (artisanId: string) => {
    try {
      const statuses: ApiProductStatus[] = ["Draft", "Published", "Archived"]
      const lists = await Promise.all(statuses.map((status) => getProducts({ artisanId, status })))
      const ids = Array.from(new Set(lists.flat().map((product) => product.id)))
      const details = await Promise.all(ids.map((id) => getProductById(id)))
      setProducts(details.map(mapDetailsToArtisanProduct))
    } catch {
      // hata durumunda mevcut listeyi koru
    }
  }, [])

  const loadOrders = useCallback(async () => {
    try {
      const data = await getArtisanOrders()
      setOrders(data.map(mapApiOrderToPanel))
    } catch {
      // ignore
    }
  }, [])

  const loadConversations = useCallback(async () => {
    try {
      const data = await getMyConversations()
      setConversations(data)
      setSelectedThreadId((current) => current ?? data.find((item) => item.type === "Message")?.id ?? null)
      setSelectedAgreementId((current) => current ?? data.find((item) => item.type === "Agreement")?.id ?? null)
    } catch {
      // ignore
    }
  }, [])

  const loadAgreements = useCallback(async () => {
    try {
      const data = await getMyAgreements()
      setAgreements(data)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadCatalogContext() {
      try {
        const categoryList = await getCategories()
        if (isMounted) {
          setCategories(categoryList)
        }
      } catch {
        // ignore
      }

      try {
        const profile = await getMyArtisanProfile()
        if (isMounted && profile) {
          setArtisanUserId(profile.userId)
          await loadProducts(profile.userId)
        }
      } catch {
        // ignore
      }
    }

    async function loadNotifications() {
      try {
        const data = await getNotifications()
        if (isMounted) {
          setNotifications(data)
        }
      } catch {
        // ignore
      }
    }

    loadCatalogContext()
    loadNotifications()
    void (async () => {
      await loadAgreements()
      await loadOrders()
      await loadConversations()
    })()

    return () => {
      isMounted = false
    }
  }, [loadProducts, loadOrders, loadConversations, loadAgreements])

  const loadThreadMessages = useCallback(async (conversationId: string) => {
    try {
      const messages = await getConversationMessages(conversationId)
      const mapped: ThreadMessage[] = messages.map((message) => ({
        id: message.id,
        sender: message.senderRole === "Buyer" ? "customer" : "artisan",
        text: message.content,
        timeLabel: formatTimeLabel(message.sentAt),
      }))
      setThreadMessages((current) => ({ ...current, [conversationId]: mapped }))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!selectedThreadId || threadMessages[selectedThreadId]) {
      return
    }

    const conversationId = selectedThreadId
    void (async () => {
      await loadThreadMessages(conversationId)
    })()
  }, [selectedThreadId, threadMessages, loadThreadMessages])

  async function syncProductImages(productId: string, product: ArtisanProduct) {
    const existing = await getProductImages(productId)
    await Promise.all(existing.map((image) => deleteProductImage(image.id)))

    if (product.heroImage) {
      await createProductImage({
        productId,
        type: "Hero",
        name: product.heroImage.name,
        url: product.heroImage.previewUrl,
        altText: product.heroImage.alt,
        sortOrder: 0,
      })
    }

    for (let index = 0; index < product.galleryImages.length; index += 1) {
      const image = product.galleryImages[index]
      await createProductImage({
        productId,
        type: "Gallery",
        name: image.name,
        url: image.previewUrl,
        altText: image.alt,
        sortOrder: index,
      })
    }

    for (let index = 0; index < product.storyImages.length; index += 1) {
      const image = product.storyImages[index]
      await createProductImage({
        productId,
        type: "Story",
        name: image.name,
        url: image.previewUrl,
        altText: image.alt,
        sortOrder: index,
      })
    }
  }

  async function handleSaveProduct(nextProduct: ArtisanProduct) {
    const categoryId = categories.find((category) => category.name === nextProduct.category)?.id

    if (!categoryId) {
      throw new Error("Seçilen kategori bulunamadı.")
    }

    const payload: CreateProductPayload = {
      name: nextProduct.name,
      categoryId,
      price: nextProduct.price,
      status: panelToApiProductStatus(nextProduct.status),
      salesMode: panelToApiSalesMode(nextProduct.salesMode),
      slug: nextProduct.slug,
      summary: nextProduct.summary,
      storyTitle: nextProduct.storyTitle,
      storyContentHtml: nextProduct.storyContent,
      material: nextProduct.material,
      technique: nextProduct.technique,
      productionDurationText: nextProduct.productionDuration,
      deliveryInfoText: nextProduct.deliveryInfo,
      stock: nextProduct.stock,
      heightText: nextProduct.dimensions.height,
      widthText: nextProduct.dimensions.width,
      weightText: nextProduct.dimensions.weight,
      isSoldOut: nextProduct.stock <= 0,
    }

    let productId = nextProduct.id

    if (nextProduct.id.startsWith("product-")) {
      productId = await createProduct(payload)
    } else {
      await updateProduct(nextProduct.id, payload)
    }

    await syncProductImages(productId, nextProduct)

    if (artisanUserId) {
      await loadProducts(artisanUserId)
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!productId.startsWith("product-")) {
      await deleteProduct(productId)
    }

    if (artisanUserId) {
      await loadProducts(artisanUserId)
    }
  }

  async function handleUpdateOrderStatus(orderId: string, status: PanelOrderStatus) {
    try {
      await updateOrderStatus(orderId, panelToApiOrderStatus(status))
      await loadOrders()
    } catch {
      // ignore
    }
  }

  function handleSelectThread(threadId: string) {
    setSelectedThreadId(threadId)
    if (!threadMessages[threadId]) {
      loadThreadMessages(threadId)
    }
  }

  function handleSelectAgreement(threadId: string) {
    setSelectedAgreementId(threadId)
    if (!threadMessages[threadId]) {
      loadThreadMessages(threadId)
    }
  }

  async function handleSendThreadMessage(threadId: string, text: string) {
    const conversation = conversations.find((item) => item.id === threadId)

    if (!conversation || !conversation.artisanProfileId) {
      return
    }

    try {
      await sendMessage(conversation.productId, conversation.artisanProfileId, text, "Message")
      await loadThreadMessages(threadId)
      await loadConversations()
    } catch {
      // ignore
    }
  }

  async function handleSendAgreementMessage(threadId: string, text: string) {
    const conversation = conversations.find((item) => item.id === threadId)

    if (!conversation || !conversation.artisanProfileId) {
      return
    }

    try {
      await sendMessage(conversation.productId, conversation.artisanProfileId, text, "Agreement")
      await loadThreadMessages(threadId)
      await loadConversations()
    } catch {
      // ignore
    }
  }

  async function handleMakeOffer(threadId: string, price: number) {
    try {
      await makeOffer(threadId, price)
      await loadAgreements()
      await loadConversations()
    } catch {
      // ignore
    }
  }

  function handleArchiveThread() {
    // Konuşma arşivleme için backend uç noktası yok; işlem yapılmıyor.
  }

  async function handleOpenNotification(notification: NotificationItem) {
    try {
      await markNotificationRead(notification.id)
    } catch {
      // ignore
    }

    setNotifications((current) =>
      current.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)),
    )

    const backendNotification = notifications.find((item) => item.id === notification.id)
    const targetModule = (backendNotification?.targetModule ?? "").toLowerCase()
    const targetId = backendNotification?.targetId ?? null

    if (targetModule === "messages") {
      setActiveTab("messages")
      if (targetId) {
        handleSelectThread(targetId)
      }
      return
    }

    if (targetModule === "agreements") {
      setActiveTab("agreements")
      const conversationId = agreements.find((agreement) => agreement.id === targetId)?.conversationId ?? targetId
      if (conversationId) {
        handleSelectAgreement(conversationId)
      }
      return
    }

    if (targetModule === "orders") {
      setActiveTab("orders")
    }
  }

  const messageThreads = conversations
    .filter((conversation) => conversation.type === "Message")
    .map((conversation) => buildThread(conversation, threadMessages[conversation.id] ?? []))
  const notificationItems = notifications.map(toNotificationItem)
  const agreementThreads: AgreementThread[] = conversations
    .filter((conversation) => conversation.type === "Agreement")
    .map((conversation) => ({
      id: conversation.id,
      buyerName: conversation.buyerDisplayName || "Müşteri",
      productName: conversation.productName || "Ürün",
      offer: latestOfferForConversation(conversation, agreements),
      updatedAt: conversation.lastMessageAt ?? new Date().toISOString(),
      messages: threadMessages[conversation.id] ?? [],
    }))

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Zanaatkar Paneli</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Profil bilgilerinizi, satış ayarlarınızı, ürünlerinizi, siparişlerinizi ve müşteri iletişimini tek panelden yönetin.
        </p>
      </header>

      <Card className="overflow-hidden border-primary/10">
        <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden border-r border-primary/10 bg-muted/20 md:flex md:flex-col">
            <div className="border-b border-primary/10 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <PanelLeft className="size-4 text-primary" />
                Modüller
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Panel bölümleri arasında geçiş yapın.</p>
            </div>
            <nav className="flex flex-1 flex-col gap-2 p-3">
              {panelTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors",
                      isActive
                        ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                        : "border-transparent bg-background/70 text-foreground hover:border-primary/10 hover:bg-background"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl",
                        isActive ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted text-primary"
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{tab.label}</span>
                      <span
                        className={cn(
                          "block text-xs",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}
                      >
                        {tab.description}
                      </span>
                    </span>
                  </button>
                )
              })}
            </nav>
          </aside>

          <CardContent className="p-4 md:p-6">
            <div className="mb-4 flex flex-wrap gap-2 md:hidden">
              {panelTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    type="button"
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>

            {activeTab === "profile" ? <ProfileManagementModule /> : null}
            {activeTab === "sales" ? <SalesManagementModule /> : null}
            {activeTab === "products" ? (
              <ProductManagementModule
                products={products}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            ) : null}
            {activeTab === "orders" ? (
              <OrderManagementModule orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
            ) : null}
            {activeTab === "analytics" ? <AnalyticsModule products={products} orders={orders} /> : null}
            {activeTab === "notifications" ? (
              <NotificationsModule notifications={notificationItems} onOpenTarget={handleOpenNotification} />
            ) : null}
            {activeTab === "messages" ? (
              <MessagesModule
                threads={messageThreads}
                selectedThreadId={selectedThreadId}
                onSelectThread={handleSelectThread}
                onSendMessage={handleSendThreadMessage}
                onArchiveThread={handleArchiveThread}
              />
            ) : null}
            {activeTab === "agreements" ? (
              <AgreementWorkspace
                threads={agreementThreads}
                selectedId={selectedAgreementId}
                onSelect={handleSelectAgreement}
                onSendMessage={handleSendAgreementMessage}
                onMakeOffer={handleMakeOffer}
              />
            ) : null}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
