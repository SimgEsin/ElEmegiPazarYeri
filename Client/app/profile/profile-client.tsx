"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import {
  BellDot,
  Camera,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  MessageSquareText,
  Package,
  Phone,
  Star,
  Trash2,
  User,
  UserCheck,
  UserMinus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"
import AgreementsSection from "./agreements-section"
import MessagesSection from "./messages-section"
import NotificationsSection from "./notifications-section"
import { setIsLoggedIn } from "@/lib/auth-storage"
import { formatPrice } from "@/lib/mock-data"
import type {
  ConsensusItem,
  MessageThread,
  NotificationItem,
  ThreadMessage,
} from "@/lib/mock-data"
import { getMyProfile, updateMyProfile } from "@/lib/api/users"
import { getMyOrders, requestOrderCancellation } from "@/lib/api/orders"
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  type AddressPayload,
} from "@/lib/api/addresses"
import { getMyFollowing, unfollowArtisan, type FollowedArtisan } from "@/lib/api/follows"
import { getNotifications, markNotificationRead } from "@/lib/api/notifications"
import {
  getConversationMessages,
  getMyAgreements,
  getMyConversations,
  sendMessage,
  type Agreement,
} from "@/lib/api/conversations"
import type { Address, ConversationListItem, Notification, Order, OrderStatus } from "@/lib/api/types"

type ProfileSection =
  | "info"
  | "orders"
  | "following"
  | "addresses"
  | "notifications"
  | "messages"
  | "agreements"
  | "logout"
type EditableProfileField = "name" | "email" | "phone" | "birthDate"

type ProfileView = {
  name: string
  email: string
  phone: string
  birthDate: string
  memberSince: string
  avatarSrc: string
}

type AddressDraft = AddressPayload

const DEFAULT_AVATAR = "/images/home/profile.png"

const emptyProfile: ProfileView = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  memberSince: "",
  avatarSrc: DEFAULT_AVATAR,
}

const sidebarItems: { id: ProfileSection; label: string; icon: typeof User }[] = [
  { id: "info", label: "Kullanıcı Bilgileri", icon: User },
  { id: "orders", label: "Siparişlerim", icon: Package },
  { id: "following", label: "Takip Edilenler", icon: UserCheck },
  { id: "addresses", label: "Adreslerim", icon: MapPin },
  { id: "notifications", label: "Bildirim Merkezi", icon: BellDot },
  { id: "messages", label: "Mesajlar", icon: MessageSquareText },
  { id: "agreements", label: "Mutabakatlar", icon: CheckCircle2 },
  { id: "logout", label: "Çıkış Yap", icon: LogOut },
]

const orderStatusLabels: Record<OrderStatus, string> = {
  Pending: "Beklemede",
  Confirmed: "Onaylandı",
  Preparing: "Hazırlanıyor",
  Shipped: "Kargoda",
  Delivered: "Teslim Edildi",
  Cancelled: "İptal Edildi",
}

const orderStatusVariants: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  Pending: "secondary",
  Confirmed: "secondary",
  Preparing: "secondary",
  Shipped: "default",
  Delivered: "outline",
  Cancelled: "destructive",
}

function createAddressDraft(isDefault = false): AddressDraft {
  return {
    label: "",
    fullAddress: "",
    city: "",
    postalCode: "",
    isDefault,
  }
}

function formatDateTR(dateString: string): string {
  if (!dateString) {
    return "Belirtilmedi"
  }

  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTimeTR(dateString: string): string {
  return new Date(dateString).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatTimeLabel(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

function getNullableValue(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function profileFromDto(dto: {
  fullName: string
  email: string
  phoneNumber?: string | null
  dateOfBirth?: string | null
  avatarUrl?: string | null
  registerDate: string
}): ProfileView {
  return {
    name: dto.fullName ?? "",
    email: dto.email ?? "",
    phone: dto.phoneNumber ?? "",
    birthDate: dto.dateOfBirth ? dto.dateOfBirth.slice(0, 10) : "",
    memberSince: dto.registerDate ?? "",
    avatarSrc: dto.avatarUrl?.trim() ? dto.avatarUrl : DEFAULT_AVATAR,
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

const agreementStatusLabels: Record<Agreement["status"], ConsensusItem["status"]> = {
  Pending: "Onay Bekliyor",
  Accepted: "Siparişe Dönüştü",
  Rejected: "Reddedildi",
}

function toConsensusItem(agreement: Agreement): ConsensusItem {
  return {
    id: agreement.id,
    title: `${agreement.productName} / teklif`,
    counterpartyName: agreement.counterpartyName,
    productName: agreement.productName,
    summary: `Teklif tutarı: ${formatPrice(agreement.proposedPrice)}`,
    status: agreementStatusLabels[agreement.status],
    updatedAt: agreement.updatedAt,
    ctaLabel: agreementStatusLabels[agreement.status],
  }
}

function buildThread(conversation: ConversationListItem, messages: ThreadMessage[]): MessageThread {
  return {
    id: conversation.id,
    subject: conversation.productName || "Görüşme",
    participantName: conversation.artisanDisplayName || "Zanaatkar",
    participantRole: "artisan",
    productName: conversation.productName || "Ürün",
    status: conversation.activeOffer ? "Mutabakata Döndü" : "Aktif",
    unreadCount: 0,
    updatedAt: conversation.lastMessageAt ?? new Date().toISOString(),
    messages,
  }
}

function UserInfoSection({
  profile,
  draftProfile,
  isEditing,
  orderCount,
  addressCount,
  favoriteCount,
  onStartEditing,
  onDraftChange,
  onSave,
  onCancel,
  isSaving,
  feedbackMessage,
  errorMessage,
}: {
  profile: ProfileView
  draftProfile: ProfileView
  isEditing: boolean
  orderCount: number
  addressCount: number
  favoriteCount: number
  onStartEditing: () => void
  onDraftChange: (field: EditableProfileField, value: string) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  feedbackMessage: string
  errorMessage: string
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="relative size-20 overflow-hidden rounded-full border-2 border-primary/20 shadow-md">
          <Image
            src={profile.avatarSrc}
            alt={`${profile.name} profil fotoğrafı`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">{profile.name || "Kullanıcı"}</h2>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="size-3.5" />
            {formatDateTR(profile.memberSince)} tarihinden beri üye
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-muted-foreground">E-posta</p>
              <p className="truncate text-sm font-bold">{profile.email || "Belirtilmedi"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Phone className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-muted-foreground">Telefon</p>
              <p className="truncate text-sm font-bold">{profile.phone || "Belirtilmedi"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-muted-foreground">Doğum Tarihi</p>
              <p className="truncate text-sm font-bold">{formatDateTR(profile.birthDate)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-muted-foreground">Hesap Özeti</p>
          <div className="mt-3 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-primary">{orderCount}</p>
              <p className="text-xs text-muted-foreground">Sipariş</p>
            </div>
            <div>
              <p className="text-2xl font-black text-primary">{addressCount}</p>
              <p className="text-xs text-muted-foreground">Adres</p>
            </div>
            <div>
              <p className="text-2xl font-black text-primary">{favoriteCount}</p>
              <p className="text-xs text-muted-foreground">Favori</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing ? (
        <Card className="border-primary/10">
          <CardContent className="p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-bold">Kullanıcı Bilgilerini Düzenle</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  value={draftProfile.name}
                  onChange={(event) => onDraftChange("name", event.target.value)}
                  placeholder="Ad Soyad"
                />
                <Input
                  type="email"
                  value={draftProfile.email}
                  disabled
                  placeholder="E-posta"
                />
                <Input
                  value={draftProfile.phone}
                  onChange={(event) => onDraftChange("phone", event.target.value)}
                  placeholder="Telefon"
                />
                <Input
                  type="date"
                  value={draftProfile.birthDate}
                  onChange={(event) => onDraftChange("birthDate", event.target.value)}
                />
              </div>
              {errorMessage ? (
                <div className="rounded-2xl border border-destructive/15 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="text-xs font-bold" onClick={onCancel}>
                  İptal
                </Button>
                <Button type="button" className="text-xs font-bold" onClick={onSave} disabled={isSaving}>
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {feedbackMessage ? (
        <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
          {feedbackMessage}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button variant="outline" className="text-xs font-bold" onClick={onStartEditing}>
          Bilgileri Düzenle
        </Button>
      </div>
    </div>
  )
}

function OrdersSection({
  orders,
  isLoading,
  onRequestCancellation,
}: {
  orders: Order[]
  isLoading: boolean
  onRequestCancellation: (orderId: string, reason: string) => Promise<void>
}) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [cancelReasonDrafts, setCancelReasonDrafts] = useState<Record<string, string>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  function handleDraftChange(orderId: string, value: string) {
    setCancelReasonDrafts((current) => ({ ...current, [orderId]: value }))
  }

  async function handleSubmit(order: Order) {
    const reason = cancelReasonDrafts[order.id]?.trim() ?? ""
    if (!reason) {
      return
    }

    setSubmittingId(order.id)
    try {
      await onRequestCancellation(order.id, reason)
      setExpandedOrderId(null)
      setCancelReasonDrafts((current) => ({ ...current, [order.id]: "" }))
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Siparişlerim</h2>
        <Badge variant="secondary">{orders.length} sipariş</Badge>
      </div>

      {isLoading ? (
        <Card className="border-primary/10">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">Siparişler yükleniyor...</CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <Package className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Henüz bir siparişiniz bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const hasCancellationRequest = Boolean(order.cancellationRequestedAt)
            const canRequestCancellation =
              order.status !== "Delivered" && order.status !== "Cancelled" && !hasCancellationRequest
            const isFormOpen = expandedOrderId === order.id
            const firstItem = order.items[0]
            const itemSummary =
              order.items.length > 1
                ? `${firstItem?.productName ?? "Ürün"} +${order.items.length - 1} ürün`
                : firstItem?.productName ?? "Ürün"

            return (
              <Card key={order.id} className="group border-primary/10 transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Package className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-bold leading-snug">{itemSummary}</p>
                        <p className="text-xs text-muted-foreground">
                          Sipariş No: <span className="font-semibold text-foreground">{order.orderNo}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDateTR(order.orderDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                      <Badge variant={orderStatusVariants[order.status]}>{orderStatusLabels[order.status]}</Badge>
                      <p className="text-sm font-bold">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>

                  {hasCancellationRequest ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-amber-950">İptal talebi gönderildi</p>
                      </div>
                      {order.cancellationReason ? (
                        <p className="mt-2 text-amber-950/80">{order.cancellationReason}</p>
                      ) : null}
                      <p className="mt-2 text-xs text-amber-950/70">
                        Gönderim zamanı: {formatDateTimeTR(order.cancellationRequestedAt!)}
                      </p>
                    </div>
                  ) : null}

                  {canRequestCancellation ? (
                    <div className="space-y-3 rounded-2xl border border-primary/10 bg-muted/20 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">Sipariş için iptal talebi oluştur</p>
                          <p className="text-xs text-muted-foreground">
                            Talebiniz neden bilgisiyle zanaatkar paneline iletilir.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant={isFormOpen ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setExpandedOrderId(isFormOpen ? null : order.id)}
                        >
                          İptal Talebi Oluştur
                        </Button>
                      </div>

                      {isFormOpen ? (
                        <div className="space-y-3">
                          <Textarea
                            value={cancelReasonDrafts[order.id] ?? ""}
                            onChange={(event) => handleDraftChange(order.id, event.target.value)}
                            placeholder="İptal talebinizin nedenini kısaca yazın"
                            aria-label={`${order.orderNo} iptal talebi nedeni`}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setExpandedOrderId(null)}>
                              Vazgeç
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleSubmit(order)}
                              disabled={(cancelReasonDrafts[order.id] ?? "").trim() === "" || submittingId === order.id}
                            >
                              {submittingId === order.id ? "Gönderiliyor..." : "Talebi Gönder"}
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onDelete,
  busy,
}: {
  address: Address
  onEdit: (address: Address) => void
  onSetDefault: (address: Address) => void
  onDelete: (address: Address) => void
  busy: boolean
}) {
  return (
    <Card className="border-primary/10 transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{address.label}</CardTitle>
          {address.isDefault ? <Badge variant="default">Varsayılan</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{address.fullAddress}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{address.city}</span>
          <span>{address.postalCode}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onEdit(address)} disabled={busy}>
            Düzenle
          </Button>
          {!address.isDefault ? (
            <Button variant="outline" size="sm" className="text-xs" onClick={() => onSetDefault(address)} disabled={busy}>
              Varsayılan Yap
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(address)}
            disabled={busy}
          >
            <Trash2 className="mr-1 size-3.5" />
            Sil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AddressesSection({
  addresses,
  isLoading,
  isFormOpen,
  isEditing,
  draft,
  canSave,
  busy,
  errorMessage,
  onStartAdding,
  onStartEditing,
  onCancelForm,
  onSaveForm,
  onFieldChange,
  onSetDefault,
  onDelete,
}: {
  addresses: Address[]
  isLoading: boolean
  isFormOpen: boolean
  isEditing: boolean
  draft: AddressDraft
  canSave: boolean
  busy: boolean
  errorMessage: string
  onStartAdding: () => void
  onStartEditing: (address: Address) => void
  onCancelForm: () => void
  onSaveForm: () => void
  onFieldChange: (field: keyof AddressDraft, value: string | boolean) => void
  onSetDefault: (address: Address) => void
  onDelete: (address: Address) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Adreslerim</h2>
        <Button variant="outline" className="text-xs font-bold" onClick={onStartAdding}>
          Yeni Adres Ekle
        </Button>
      </div>

      {isFormOpen ? (
        <Card className="border-primary/10">
          <CardContent className="space-y-3 p-4">
            <h3 className="text-sm font-bold">{isEditing ? "Adresi Düzenle" : "Yeni Adres"}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={draft.label}
                onChange={(event) => onFieldChange("label", event.target.value)}
                placeholder="Adres etiketi (Ev, İş...)"
              />
              <Input
                value={draft.city}
                onChange={(event) => onFieldChange("city", event.target.value)}
                placeholder="Şehir"
              />
              <Input
                value={draft.postalCode}
                onChange={(event) => onFieldChange("postalCode", event.target.value)}
                placeholder="Posta Kodu"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isDefault}
                  onChange={(event) => onFieldChange("isDefault", event.target.checked)}
                />
                Varsayılan adresim yap
              </label>
            </div>
            <Textarea
              value={draft.fullAddress}
              onChange={(event) => onFieldChange("fullAddress", event.target.value)}
              placeholder="Açık adres"
            />
            {errorMessage ? (
              <div className="rounded-2xl border border-destructive/15 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="text-xs font-bold" onClick={onCancelForm}>
                İptal
              </Button>
              <Button className="text-xs font-bold" onClick={onSaveForm} disabled={!canSave || busy}>
                {busy ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <Card className="border-primary/10">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">Adresler yükleniyor...</CardContent>
        </Card>
      ) : addresses.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <MapPin className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Henüz kayıtlı bir adresiniz bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={onStartEditing}
              onSetDefault={onSetDefault}
              onDelete={onDelete}
              busy={busy}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FollowingSection({
  artisans,
  isLoading,
  onUnfollow,
}: {
  artisans: FollowedArtisan[]
  isLoading: boolean
  onUnfollow: (artisanProfileId: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Takip Edilenler</h2>
        <Badge variant="secondary">{artisans.length} zanaatkar</Badge>
      </div>

      {isLoading ? (
        <Card className="border-primary/10">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">Yükleniyor...</CardContent>
        </Card>
      ) : artisans.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <UserCheck className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Henüz takip ettiğiniz bir zanaatkar bulunmuyor.</p>
            <p className="text-xs text-muted-foreground">
              Zanaatkar profillerinden &quot;Takip Et&quot; butonuna tıklayarak takip edebilirsiniz.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {artisans.map((artisan) => (
            <Card key={artisan.followId} className="group border-primary/10 transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 shadow-sm">
                      <User className="size-6 text-primary" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-bold leading-snug">{artisan.displayName}</p>
                      <p className="text-xs font-medium text-primary">{artisan.craft}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {artisan.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="size-3 fill-primary text-primary" />
                          {artisan.ratingAvg}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{artisan.productCount} ürün</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onUnfollow(artisan.artisanProfileId)}
                    >
                      <UserMinus className="mr-1.5 size-3.5" />
                      Takipten Çık
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function LogoutSection({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black tracking-tight">Çıkış Yap</h2>

      <Card className="border-primary/10">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10">
              <LogOut className="size-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Hesabınızdan çıkış yapın</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Çıkış yaptıktan sonra tekrar giriş yapmanız gerekecektir. Sepet ve favori verileriniz hesabınıza bağlı
                olarak saklanmaya devam edecektir.
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button variant="destructive" className="font-bold" onClick={onLogout}>
              <LogOut className="mr-2 size-4" />
              Çıkış Yap
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfileClient() {
  const { logout } = useAuth()
  const avatarFileInputRef = useRef<HTMLInputElement>(null)
  const [activeSection, setActiveSection] = useState<ProfileSection>("info")

  const [profile, setProfile] = useState<ProfileView>(emptyProfile)
  const [draftProfile, setDraftProfile] = useState<ProfileView>(emptyProfile)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState("")
  const [profileError, setProfileError] = useState("")
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | null>(null)

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const [favoriteCount, setFavoriteCount] = useState(0)

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(() => createAddressDraft(true))
  const [addressBusy, setAddressBusy] = useState(false)
  const [addressError, setAddressError] = useState("")

  const [following, setFollowing] = useState<FollowedArtisan[]>([])
  const [followingLoading, setFollowingLoading] = useState(true)

  const [notifications, setNotifications] = useState<Notification[]>([])

  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [threadMessages, setThreadMessages] = useState<Record<string, ThreadMessage[]>>({})

  const [agreements, setAgreements] = useState<Agreement[]>([])

  const canSaveAddress =
    addressDraft.label.trim() !== "" &&
    addressDraft.city.trim() !== "" &&
    addressDraft.postalCode.trim() !== "" &&
    addressDraft.fullAddress.trim() !== ""

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      setOrders(await getMyOrders())
    } catch {
      // keep empty list on failure
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const loadAddresses = useCallback(async () => {
    setAddressesLoading(true)
    try {
      setAddresses(await getAddresses())
    } catch {
      // keep empty list on failure
    } finally {
      setAddressesLoading(false)
    }
  }, [])

  const loadFollowing = useCallback(async () => {
    setFollowingLoading(true)
    try {
      setFollowing(await getMyFollowing())
    } catch {
      // keep empty list on failure
    } finally {
      setFollowingLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const dto = await getMyProfile()
        if (!isMounted) {
          return
        }
        const view = profileFromDto(dto)
        setProfile(view)
        setDraftProfile(view)
      } catch {
        // token-only fallback: leave empty profile visible
      }
    }

    loadProfile()
    loadOrders()
    loadAddresses()
    loadFollowing()

    async function loadFavorites() {
      try {
        const { getFavorites } = await import("@/lib/api/favorites")
        const favorites = await getFavorites()
        if (isMounted) {
          setFavoriteCount(favorites.length)
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

    async function loadConversations() {
      try {
        const data = await getMyConversations()
        if (isMounted) {
          setConversations(data)
          setSelectedThreadId((current) => current ?? data[0]?.id ?? null)
        }
      } catch {
        // ignore
      }
    }

    async function loadAgreements() {
      try {
        const data = await getMyAgreements()
        if (isMounted) {
          setAgreements(data)
        }
      } catch {
        // ignore
      }
    }

    loadFavorites()
    loadNotifications()
    loadConversations()
    loadAgreements()

    return () => {
      isMounted = false
    }
  }, [loadOrders, loadAddresses, loadFollowing])

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
    if (selectedThreadId && !threadMessages[selectedThreadId]) {
      loadThreadMessages(selectedThreadId)
    }
  }, [selectedThreadId, threadMessages, loadThreadMessages])

  function handleStartEditingProfile() {
    setDraftProfile(profile)
    setIsEditingProfile(true)
    setProfileFeedback("")
    setProfileError("")
  }

  function handleProfileDraftChange(field: EditableProfileField, value: string) {
    setDraftProfile((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSaveProfile() {
    setIsSavingProfile(true)
    setProfileFeedback("")
    setProfileError("")

    try {
      await updateMyProfile({
        fullName: getNullableValue(draftProfile.name),
        phoneNumber: getNullableValue(draftProfile.phone),
        dateOfBirth: getNullableValue(draftProfile.birthDate),
        avatarUrl: pendingAvatarUrl ?? getNullableValue(draftProfile.avatarSrc === DEFAULT_AVATAR ? "" : draftProfile.avatarSrc),
      })

      const dto = await getMyProfile()
      const view = profileFromDto(dto)
      setProfile(view)
      setDraftProfile(view)
      setPendingAvatarUrl(null)
      setIsEditingProfile(false)
      setProfileFeedback("Profil bilgileri kaydedildi.")
    } catch {
      setProfileError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSavingProfile(false)
    }
  }

  function handleCancelProfileEdit() {
    setDraftProfile(profile)
    setIsEditingProfile(false)
    setProfileError("")
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      if (typeof reader.result !== "string") {
        return
      }
      const avatarUrl = reader.result
      const previousProfile = profile

      // Show the new photo immediately, then persist to the backend so it
      // survives a refresh without requiring the user to enter edit mode.
      setProfile((current) => ({ ...current, avatarSrc: avatarUrl }))
      setDraftProfile((current) => ({ ...current, avatarSrc: avatarUrl }))
      setProfileError("")
      setProfileFeedback("")

      try {
        await updateMyProfile({
          fullName: getNullableValue(previousProfile.name),
          phoneNumber: getNullableValue(previousProfile.phone),
          dateOfBirth: getNullableValue(previousProfile.birthDate),
          avatarUrl,
        })

        const dto = await getMyProfile()
        const view = profileFromDto(dto)
        setProfile(view)
        setDraftProfile((current) => ({ ...current, avatarSrc: view.avatarSrc }))
        setPendingAvatarUrl(null)
        setProfileFeedback("Profil fotoğrafı güncellendi.")
      } catch {
        setProfile(previousProfile)
        setDraftProfile((current) => ({ ...current, avatarSrc: previousProfile.avatarSrc }))
        setProfileError("Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.")
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleRequestOrderCancellation(orderId: string, reason: string) {
    await requestOrderCancellation(orderId, reason)
    await loadOrders()
  }

  function handleStartAddingAddress() {
    setEditingAddressId(null)
    setAddressDraft(createAddressDraft(addresses.length === 0))
    setAddressError("")
    setIsAddressFormOpen(true)
  }

  function handleStartEditingAddress(address: Address) {
    setEditingAddressId(address.id)
    setAddressDraft({
      label: address.label,
      fullAddress: address.fullAddress,
      city: address.city,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    })
    setAddressError("")
    setIsAddressFormOpen(true)
  }

  function handleAddressFieldChange(field: keyof AddressDraft, value: string | boolean) {
    setAddressDraft((prev) => ({ ...prev, [field]: value }))
  }

  function handleCancelAddressForm() {
    setIsAddressFormOpen(false)
    setEditingAddressId(null)
    setAddressError("")
  }

  async function handleSaveAddressForm() {
    setAddressBusy(true)
    setAddressError("")
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressDraft)
      } else {
        await createAddress(addressDraft)
      }
      await loadAddresses()
      setIsAddressFormOpen(false)
      setEditingAddressId(null)
    } catch {
      setAddressError("Adres kaydedilemedi. Lütfen tekrar deneyin.")
    } finally {
      setAddressBusy(false)
    }
  }

  async function handleSetDefaultAddress(address: Address) {
    setAddressBusy(true)
    try {
      await updateAddress(address.id, {
        label: address.label,
        fullAddress: address.fullAddress,
        city: address.city,
        postalCode: address.postalCode,
        isDefault: true,
      })
      await loadAddresses()
    } catch {
      setAddressError("İşlem başarısız oldu.")
    } finally {
      setAddressBusy(false)
    }
  }

  async function handleDeleteAddress(address: Address) {
    setAddressBusy(true)
    try {
      await deleteAddress(address.id)
      await loadAddresses()
    } catch {
      setAddressError("Adres silinemedi.")
    } finally {
      setAddressBusy(false)
    }
  }

  async function handleUnfollow(artisanProfileId: string) {
    setFollowing((prev) => prev.filter((artisan) => artisan.artisanProfileId !== artisanProfileId))
    try {
      await unfollowArtisan(artisanProfileId)
    } catch {
      await loadFollowing()
    }
  }

  function handleSelectThread(threadId: string) {
    setSelectedThreadId(threadId)
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
      await sendMessage(conversation.productId, conversation.artisanProfileId, text)
      await loadThreadMessages(threadId)
      const refreshed = await getMyConversations()
      setConversations(refreshed)
    } catch {
      // ignore send failure
    }
  }

  function handleCloseThread() {
    // Konuşma kapatma için backend uç noktası yok; işlem yapılmıyor.
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
      setActiveSection("messages")
      if (targetId) {
        handleSelectThread(targetId)
      }
      return
    }

    if (targetModule === "agreements") {
      setActiveSection("agreements")
      return
    }

    if (targetModule === "orders") {
      setActiveSection("orders")
      return
    }
  }

  function handleLogout() {
    logout()
    setIsLoggedIn(false)
  }

  const messageThreads = conversations
    .filter((conversation) => conversation.type === "Message")
    .map((conversation) => buildThread(conversation, threadMessages[conversation.id] ?? []))
  const notificationItems = notifications.map(toNotificationItem)
  const consensusItems = agreements.map(toConsensusItem)

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Sidebar */}
      <aside className="shrink-0 lg:w-64">
        <Card className="sticky top-24 border-primary/10">
          <CardContent className="p-3">
            <input
              ref={avatarFileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex items-center gap-3 px-3 py-3">
              <div className="relative size-10 overflow-hidden rounded-full border border-primary/20">
                <Image
                  src={profile.avatarSrc}
                  alt={`${profile.name} profil fotoğrafı`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{profile.name || "Kullanıcı"}</p>
                <p className="truncate text-xs text-muted-foreground">{profile.email || ""}</p>
              </div>
            </div>
            <div className="px-3 pb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-full text-xs font-bold"
                onClick={() => avatarFileInputRef.current?.click()}
              >
                <Camera className="mr-1.5 size-3.5" />
                Fotoğrafı Değiştir
              </Button>
            </div>

            <Separator className="my-1" />

            <nav className="mt-1 space-y-0.5" aria-label="Profil menüsü">
              {sidebarItems.map((item) => {
                const isActive = activeSection === item.id
                const Icon = item.icon
                const isLogout = item.id === "logout"

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? isLogout
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                        : isLogout
                          ? "text-destructive/70 hover:bg-destructive/5 hover:text-destructive"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive ? <ChevronRight className="size-4" /> : null}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <Card className="border-primary/10">
          <CardContent className="p-5 sm:p-6 lg:p-8">
            {activeSection === "info" ? (
              <UserInfoSection
                profile={profile}
                draftProfile={draftProfile}
                isEditing={isEditingProfile}
                orderCount={orders.length}
                addressCount={addresses.length}
                favoriteCount={favoriteCount}
                onStartEditing={handleStartEditingProfile}
                onDraftChange={handleProfileDraftChange}
                onSave={handleSaveProfile}
                onCancel={handleCancelProfileEdit}
                isSaving={isSavingProfile}
                feedbackMessage={profileFeedback}
                errorMessage={profileError}
              />
            ) : null}
            {activeSection === "orders" ? (
              <OrdersSection
                orders={orders}
                isLoading={ordersLoading}
                onRequestCancellation={handleRequestOrderCancellation}
              />
            ) : null}
            {activeSection === "following" ? (
              <FollowingSection artisans={following} isLoading={followingLoading} onUnfollow={handleUnfollow} />
            ) : null}
            {activeSection === "addresses" ? (
              <AddressesSection
                addresses={addresses}
                isLoading={addressesLoading}
                isFormOpen={isAddressFormOpen}
                isEditing={editingAddressId !== null}
                draft={addressDraft}
                canSave={canSaveAddress}
                busy={addressBusy}
                errorMessage={addressError}
                onStartAdding={handleStartAddingAddress}
                onStartEditing={handleStartEditingAddress}
                onCancelForm={handleCancelAddressForm}
                onSaveForm={handleSaveAddressForm}
                onFieldChange={handleAddressFieldChange}
                onSetDefault={handleSetDefaultAddress}
                onDelete={handleDeleteAddress}
              />
            ) : null}
            {activeSection === "notifications" ? (
              <NotificationsSection notifications={notificationItems} onOpenTarget={handleOpenNotification} />
            ) : null}
            {activeSection === "messages" ? (
              <MessagesSection
                threads={messageThreads}
                selectedThreadId={selectedThreadId}
                onSelectThread={handleSelectThread}
                onSendMessage={handleSendThreadMessage}
                onCloseThread={handleCloseThread}
              />
            ) : null}
            {activeSection === "agreements" ? (
              <AgreementsSection items={consensusItems} highlightedItemId={null} />
            ) : null}
            {activeSection === "logout" ? <LogoutSection onLogout={handleLogout} /> : null}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
