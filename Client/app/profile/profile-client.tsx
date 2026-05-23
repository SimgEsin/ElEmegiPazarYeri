"use client"

import Image from "next/image"
import { startTransition, useState } from "react"
import {
  BellDot,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  MessageSquareText,
  Package,
  Phone,
  Star,
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
import AgreementsSection from "./agreements-section"
import MessagesSection from "./messages-section"
import NotificationsSection from "./notifications-section"
import { setIsLoggedIn } from "@/lib/auth-storage"
import {
  accountAddresses,
  customerConsensusItems,
  customerMessageThreads,
  customerNotifications,
  followedArtisans as initialFollowedArtisans,
  formatPrice,
  getProductBySlug,
  userProfile,
  type AccountAddress,
  type MessageThread,
  type NotificationItem,
  type AccountOrder,
  type FollowedArtisan,
  type UserProfile,
} from "@/lib/mock-data"
import { requestOrderCancellation, useCustomerOrdersSnapshot } from "@/lib/order-store"

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
type NewAddressDraft = Omit<AccountAddress, "id">

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

function createAddressDraft(isDefault = false): NewAddressDraft {
  return {
    label: "",
    fullAddress: "",
    city: "",
    postalCode: "",
    isDefault,
  }
}

function formatDateTR(dateString: string): string {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function OrderStatusBadge({ status }: { status: AccountOrder["status"] }) {
  const variantMap: Record<AccountOrder["status"], "default" | "secondary" | "outline"> = {
    Hazırlanıyor: "secondary",
    Kargoda: "default",
    "Teslim Edildi": "outline",
  }

  return <Badge variant={variantMap[status]}>{status}</Badge>
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

function sortThreads(threads: MessageThread[]) {
  return [...threads].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
}

function sortNotifications(notifications: NotificationItem[]) {
  return [...notifications].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
}

function getTimeLabel() {
  return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

function UserInfoSection({
  profile,
  draftProfile,
  isEditing,
  orderCount,
  addressCount,
  onStartEditing,
  onDraftChange,
  onSave,
  onCancel,
}: {
  profile: UserProfile
  draftProfile: UserProfile
  isEditing: boolean
  orderCount: number
  addressCount: number
  onStartEditing: () => void
  onDraftChange: (field: EditableProfileField, value: string) => void
  onSave: () => void
  onCancel: () => void
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
          <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
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
              <p className="truncate text-sm font-bold">{profile.email}</p>
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
              <p className="truncate text-sm font-bold">{profile.phone}</p>
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
              <p className="text-2xl font-black text-primary">3</p>
              <p className="text-xs text-muted-foreground">Favori</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing ? (
        <Card className="border-primary/10">
          <CardContent className="space-y-4 p-4">
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
                onChange={(event) => onDraftChange("email", event.target.value)}
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="text-xs font-bold" onClick={onCancel}>
                İptal
              </Button>
              <Button className="text-xs font-bold" onClick={onSave}>
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-end">
        <Button variant="outline" className="text-xs font-bold" onClick={onStartEditing}>
          Bilgileri Düzenle
        </Button>
      </div>
    </div>
  )
}

function OrdersSection({ orders }: { orders: AccountOrder[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [cancelReasonDrafts, setCancelReasonDrafts] = useState<Record<string, string>>({})
  const [feedbackMessage, setFeedbackMessage] = useState("")

  function handleCancellationDraftChange(orderId: string, value: string) {
    setCancelReasonDrafts((current) => ({ ...current, [orderId]: value }))
  }

  function handleRequestCancellation(order: AccountOrder) {
    const reason = cancelReasonDrafts[order.id]?.trim() ?? ""

    if (!reason) {
      return
    }

    requestOrderCancellation(order.referenceId, reason)
    setExpandedOrderId(null)
    setCancelReasonDrafts((current) => ({ ...current, [order.id]: "" }))
    setFeedbackMessage(`İptal talebiniz ${order.id} için zanaatkâra iletildi.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Siparişlerim</h2>
        <Badge variant="secondary">{orders.length} sipariş</Badge>
      </div>

      {feedbackMessage ? (
        <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
          {feedbackMessage}
        </div>
      ) : null}

      {orders.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <Package className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Henüz bir siparişiniz bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const product = getProductBySlug(order.productSlug)
            const canRequestCancellation = order.status !== "Teslim Edildi" && !order.cancellationRequest
            const isFormOpen = expandedOrderId === order.id

            return (
              <Card key={order.id} className="group border-primary/10 transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Package className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-bold leading-snug">{product?.name ?? order.productSlug}</p>
                        <p className="text-xs text-muted-foreground">
                          Sipariş No: <span className="font-semibold text-foreground">{order.id}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDateTR(order.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                      <OrderStatusBadge status={order.status} />
                      <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {order.cancellationRequest ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-amber-950">İptal talebi gönderildi</p>
                        <Badge variant="outline" className="border-amber-300 bg-white/80 text-amber-900">
                          {order.cancellationRequest.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-amber-950/80">{order.cancellationRequest.reason}</p>
                      <p className="mt-2 text-xs text-amber-950/70">
                        Gönderim zamanı: {formatDateTimeTR(order.cancellationRequest.requestedAt)}
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
                            onChange={(event) => handleCancellationDraftChange(order.id, event.target.value)}
                            placeholder="İptal talebinizin nedenini kısaca yazın"
                            aria-label={`${order.id} iptal talebi nedeni`}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setExpandedOrderId(null)}>
                              Vazgeç
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleRequestCancellation(order)}
                              disabled={(cancelReasonDrafts[order.id] ?? "").trim() === ""}
                            >
                              Talebi Gönder
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

function AddressCard({ address }: { address: AccountAddress }) {
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
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="text-xs">
            Düzenle
          </Button>
          {!address.isDefault ? (
            <Button variant="outline" size="sm" className="text-xs">
              Varsayılan Yap
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function AddressesSection({
  addresses,
  isAddingAddress,
  newAddressDraft,
  canSaveAddress,
  onStartAdding,
  onCancelAdding,
  onSaveAddress,
  onAddressFieldChange,
}: {
  addresses: AccountAddress[]
  isAddingAddress: boolean
  newAddressDraft: NewAddressDraft
  canSaveAddress: boolean
  onStartAdding: () => void
  onCancelAdding: () => void
  onSaveAddress: () => void
  onAddressFieldChange: (field: keyof NewAddressDraft, value: string | boolean) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Adreslerim</h2>
        <Button variant="outline" className="text-xs font-bold" onClick={onStartAdding}>
          Yeni Adres Ekle
        </Button>
      </div>

      {isAddingAddress ? (
        <Card className="border-primary/10">
          <CardContent className="space-y-3 p-4">
            <h3 className="text-sm font-bold">Yeni Adres</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={newAddressDraft.label}
                onChange={(event) => onAddressFieldChange("label", event.target.value)}
                placeholder="Adres etiketi (Ev, İş...)"
              />
              <Input
                value={newAddressDraft.city}
                onChange={(event) => onAddressFieldChange("city", event.target.value)}
                placeholder="Şehir"
              />
              <Input
                value={newAddressDraft.postalCode}
                onChange={(event) => onAddressFieldChange("postalCode", event.target.value)}
                placeholder="Posta Kodu"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newAddressDraft.isDefault}
                  onChange={(event) => onAddressFieldChange("isDefault", event.target.checked)}
                />
                Varsayılan adresim yap
              </label>
            </div>
            <Textarea
              value={newAddressDraft.fullAddress}
              onChange={(event) => onAddressFieldChange("fullAddress", event.target.value)}
              placeholder="Açık adres"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="text-xs font-bold" onClick={onCancelAdding}>
                İptal
              </Button>
              <Button className="text-xs font-bold" onClick={onSaveAddress} disabled={!canSaveAddress}>
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {addresses.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <MapPin className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Henüz kayıtlı bir adresiniz bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  )
}

function FollowingSection({
  artisans,
  onUnfollow,
}: {
  artisans: FollowedArtisan[]
  onUnfollow: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Takip Edilenler</h2>
        <Badge variant="secondary">{artisans.length} zanaatkar</Badge>
      </div>

      {artisans.length === 0 ? (
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
            <Card key={artisan.id} className="group border-primary/10 transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm">
                      <Image
                        src={artisan.avatarSrc}
                        alt={`${artisan.name} profil fotoğrafı`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-bold leading-snug">{artisan.name}</p>
                      <p className="text-xs font-medium text-primary">{artisan.craft}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {artisan.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="size-3 fill-primary text-primary" />
                          {artisan.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {artisan.followerCount.toLocaleString("tr-TR")} takipçi
                      </span>
                      <span>{artisan.productCount} ürün</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onUnfollow(artisan.id)}
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
  const [activeSection, setActiveSection] = useState<ProfileSection>("info")
  const orders = useCustomerOrdersSnapshot()
  const [profile, setProfile] = useState<UserProfile>(userProfile)
  const [draftProfile, setDraftProfile] = useState<UserProfile>(userProfile)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [addresses, setAddresses] = useState<AccountAddress[]>(accountAddresses)
  const [followedList, setFollowedList] = useState<FollowedArtisan[]>(initialFollowedArtisans)
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(() => sortThreads(customerMessageThreads))
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => customerMessageThreads[0]?.id ?? null)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => sortNotifications(customerNotifications))
  const [highlightedAgreementId, setHighlightedAgreementId] = useState<string | null>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddressDraft, setNewAddressDraft] = useState<NewAddressDraft>(() =>
    createAddressDraft(accountAddresses.length === 0),
  )

  const canSaveAddress =
    newAddressDraft.label.trim() !== "" &&
    newAddressDraft.city.trim() !== "" &&
    newAddressDraft.postalCode.trim() !== "" &&
    newAddressDraft.fullAddress.trim() !== ""

  function handleStartEditingProfile() {
    setDraftProfile(profile)
    setIsEditingProfile(true)
  }

  function handleProfileDraftChange(field: EditableProfileField, value: string) {
    setDraftProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function handleSaveProfile() {
    setProfile(draftProfile)
    setIsEditingProfile(false)
  }

  function handleCancelProfileEdit() {
    setDraftProfile(profile)
    setIsEditingProfile(false)
  }

  function handleStartAddingAddress() {
    setNewAddressDraft(createAddressDraft(addresses.length === 0))
    setIsAddingAddress(true)
  }

  function handleAddressDraftChange(field: keyof NewAddressDraft, value: string | boolean) {
    setNewAddressDraft((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function handleUnfollow(artisanId: string) {
    setFollowedList((prev) => prev.filter((a) => a.id !== artisanId))
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
                sender: "customer",
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
          id: `customer-notification-${Date.now()}`,
          type: "message",
          title: `${selectedThread.participantName} görüşmesi güncellendi`,
          description: "Yeni mesajınız yazışma akışına eklendi.",
          createdAt,
          isRead: false,
          targetModule: "messages",
          targetId: threadId,
        },
        ...current,
      ])
    )
  }

  function handleCloseThread(threadId: string) {
    const selectedThread = messageThreads.find((thread) => thread.id === threadId)
    const createdAt = new Date().toISOString()

    setMessageThreads((current) =>
      current.map((thread) => {
        if (thread.id !== threadId) {
          return thread
        }

        return {
          ...thread,
          status: "Kapatıldı",
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
          id: `customer-notification-${Date.now() + 1}`,
          type: "system",
          title: `${selectedThread.participantName} görüşmesi kapatıldı`,
          description: "Görüşme geçmişi korunuyor; ihtiyaç halinde tekrar açabilirsiniz.",
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

      setActiveSection(notification.targetModule)

      if (notification.targetModule === "messages") {
        setHighlightedAgreementId(null)
        setSelectedThreadId(notification.targetId)
        markThreadAsSeen(notification.targetId)
        return
      }

      setHighlightedAgreementId(notification.targetId)
    })
  }

  function handleLogout() {
    setIsLoggedIn(false)
  }

  function handleSaveAddress() {
    const nextAddress: AccountAddress = {
      ...newAddressDraft,
      id: `addr-${Date.now()}`,
    }

    setAddresses((prev) => {
      const baseAddresses = newAddressDraft.isDefault
        ? prev.map((address) => ({ ...address, isDefault: false }))
        : prev

      return [...baseAddresses, nextAddress]
    })

    setNewAddressDraft(createAddressDraft(false))
    setIsAddingAddress(false)
  }

  function handleCancelAddressAdd() {
    setNewAddressDraft(createAddressDraft(addresses.length === 0))
    setIsAddingAddress(false)
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Sidebar */}
      <aside className="shrink-0 lg:w-64">
        <Card className="sticky top-24 border-primary/10">
          <CardContent className="p-3">
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
                <p className="truncate text-sm font-bold">{profile.name}</p>
                <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
              </div>
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
                onStartEditing={handleStartEditingProfile}
                onDraftChange={handleProfileDraftChange}
                onSave={handleSaveProfile}
                onCancel={handleCancelProfileEdit}
              />
            ) : null}
            {activeSection === "orders" ? <OrdersSection orders={orders} /> : null}
            {activeSection === "following" ? (
              <FollowingSection artisans={followedList} onUnfollow={handleUnfollow} />
            ) : null}
            {activeSection === "addresses" ? (
              <AddressesSection
                addresses={addresses}
                isAddingAddress={isAddingAddress}
                newAddressDraft={newAddressDraft}
                canSaveAddress={canSaveAddress}
                onStartAdding={handleStartAddingAddress}
                onCancelAdding={handleCancelAddressAdd}
                onSaveAddress={handleSaveAddress}
                onAddressFieldChange={handleAddressDraftChange}
              />
            ) : null}
            {activeSection === "notifications" ? (
              <NotificationsSection notifications={notifications} onOpenTarget={handleOpenNotification} />
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
              <AgreementsSection items={customerConsensusItems} highlightedItemId={highlightedAgreementId} />
            ) : null}
            {activeSection === "logout" ? <LogoutSection onLogout={handleLogout} /> : null}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
