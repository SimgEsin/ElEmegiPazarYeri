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
import { startTransition, useState } from "react"

import AgreementsModule from "./agreements-module"
import AnalyticsModule from "./analytics-module"
import MessagesModule from "./messages-module"
import NotificationsModule from "./notifications-module"
import OrderManagementModule from "./order-management-module"
import type { OrderStatus } from "./panel-types"
import ProductManagementModule from "./product-management-module"
import ProfileManagementModule from "./profile-management-module"
import SalesManagementModule from "./sales-management-module"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deleteCatalogProduct, saveCatalogProduct, useCatalogSnapshot } from "@/lib/catalog-store"
import { updateArtisanOrderStatus, useArtisanOrdersSnapshot } from "@/lib/order-store"
import {
  artisanConsensusItems,
  artisanMessageThreads,
  artisanNotifications,
  type MessageThread,
  type NotificationItem,
} from "@/lib/mock-data"
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

function sortThreads(threads: MessageThread[]) {
  return [...threads].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
}

function sortNotifications(notifications: NotificationItem[]) {
  return [...notifications].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
}

function getTimeLabel() {
  return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

export default function ArtisanPanelClient() {
  const [activeTab, setActiveTab] = useState<PanelTab>("profile")
  const orders = useArtisanOrdersSnapshot()
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(() => sortThreads(artisanMessageThreads))
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => artisanMessageThreads[0]?.id ?? null)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => sortNotifications(artisanNotifications))
  const [highlightedAgreementId, setHighlightedAgreementId] = useState<string | null>(null)
  const { products } = useCatalogSnapshot()

  function handleSaveProduct(nextProduct: (typeof products)[number]) {
    saveCatalogProduct(nextProduct)
  }

  function handleDeleteProduct(productId: string) {
    deleteCatalogProduct(productId)
  }

  function handleUpdateOrderStatus(orderId: string, status: OrderStatus) {
    updateArtisanOrderStatus(orderId, status)
  }

  function markThreadAsSeen(threadId: string) {
    setMessageThreads((current) =>
      current.map((thread) => {
        if (thread.id !== threadId) {
          return thread
        }

        return {
          ...thread,
          unreadCount: 0,
          status: thread.status === "Okunmamış" ? "Aktif" : thread.status,
        }
      })
    )
  }

  function handleSelectThread(threadId: string) {
    setSelectedThreadId(threadId)
    setHighlightedAgreementId(null)
    markThreadAsSeen(threadId)
  }

  function handleSendThreadMessage(threadId: string, text: string) {
    const selectedThread = messageThreads.find((thread) => thread.id === threadId)
    const createdAt = new Date().toISOString()

    setMessageThreads((current) =>
      sortThreads(
        current.map((thread) => {
          if (thread.id !== threadId) {
            return thread
          }

          return {
            ...thread,
            status: "Cevap Bekliyor",
            unreadCount: 0,
            updatedAt: createdAt,
            messages: [
              ...thread.messages,
              {
                id: `${threadId}-${Date.now()}`,
                sender: "artisan",
                text,
                timeLabel: getTimeLabel(),
              },
            ],
          }
        })
      )
    )

    if (!selectedThread) {
      return
    }

    setNotifications((current) =>
      sortNotifications([
        {
          id: `artisan-notification-${Date.now()}`,
          type: "message",
          title: `${selectedThread.participantName} görüşmesi güncellendi`,
          description: "Yeni yanıtınız konuşma akışına eklendi.",
          createdAt,
          isRead: false,
          targetModule: "messages",
          targetId: threadId,
        },
        ...current,
      ])
    )
  }

  function handleArchiveThread(threadId: string) {
    const selectedThread = messageThreads.find((thread) => thread.id === threadId)
    const createdAt = new Date().toISOString()

    setMessageThreads((current) =>
      current.map((thread) => {
        if (thread.id !== threadId) {
          return thread
        }

        return {
          ...thread,
          status: "Arşivlendi",
          unreadCount: 0,
        }
      })
    )

    if (!selectedThread) {
      return
    }

    setNotifications((current) =>
      sortNotifications([
        {
          id: `artisan-notification-${Date.now() + 1}`,
          type: "system",
          title: `${selectedThread.participantName} görüşmesi arşive alındı`,
          description: "Konuşma görünümünü daha sonra yeniden açabilirsiniz.",
          createdAt,
          isRead: false,
          targetModule: "messages",
          targetId: threadId,
        },
        ...current,
      ])
    )
  }

  function handleOpenNotification(notification: NotificationItem) {
    startTransition(() => {
      setNotifications((current) =>
        current.map((item) => {
          if (item.id !== notification.id) {
            return item
          }

          return { ...item, isRead: true }
        })
      )

      setActiveTab(notification.targetModule)

      if (notification.targetModule === "messages") {
        setHighlightedAgreementId(null)
        setSelectedThreadId(notification.targetId)
        markThreadAsSeen(notification.targetId)
        return
      }

      setHighlightedAgreementId(notification.targetId)
    })
  }

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
              <NotificationsModule notifications={notifications} onOpenTarget={handleOpenNotification} />
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
              <AgreementsModule items={artisanConsensusItems} highlightedItemId={highlightedAgreementId} />
            ) : null}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
