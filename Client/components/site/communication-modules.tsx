"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import {
  BellDot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  MailPlus,
  MessageSquareText,
  PackageOpen,
  Search,
  SendHorizonal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  type ConsensusItem,
  type MessageThread,
  type NotificationItem,
  type ThreadSender,
  type ThreadStatus,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type MessageFilter = "Tümü" | "Okunmamış" | "Cevap Bekleyen" | "Mutabakata Dönen"

type NotificationFeedProps = {
  title: string
  description: string
  notifications: NotificationItem[]
  onOpenTarget: (notification: NotificationItem) => void
}

type MessageWorkspaceProps = {
  title: string
  description: string
  viewerRole: "artisan" | "customer"
  threads: MessageThread[]
  selectedThreadId: string | null
  onSelectThread: (threadId: string) => void
  onSendMessage: (threadId: string, text: string) => void
  onThreadAction: (threadId: string) => void
  threadActionLabel: string
}

type AgreementsListProps = {
  title: string
  description: string
  items: ConsensusItem[]
  highlightedItemId?: string | null
}

const messageFilters: MessageFilter[] = ["Tümü", "Okunmamış", "Cevap Bekleyen", "Mutabakata Dönen"]

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatCompactDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  })
}

function notificationIcon(type: NotificationItem["type"]) {
  if (type === "message") {
    return MessageSquareText
  }

  if (type === "agreement") {
    return CheckCircle2
  }

  return BellDot
}

function badgeStyleForThreadStatus(status: ThreadStatus) {
  if (status === "Okunmamış") {
    return "border-amber-200 bg-amber-100 text-amber-800"
  }

  if (status === "Cevap Bekliyor") {
    return "border-sky-200 bg-sky-100 text-sky-800"
  }

  if (status === "Mutabakata Döndü") {
    return "border-emerald-200 bg-emerald-100 text-emerald-800"
  }

  if (status === "Arşivlendi" || status === "Kapatıldı") {
    return "border-stone-200 bg-stone-100 text-stone-700"
  }

  return "border-primary/10 bg-primary/10 text-primary"
}

function badgeStyleForConsensusStatus(status: ConsensusItem["status"]) {
  if (status === "Onay Bekliyor") {
    return "border-amber-200 bg-amber-100 text-amber-800"
  }

  if (status === "Revize Gönderildi" || status === "Teklif Hazırlandı") {
    return "border-sky-200 bg-sky-100 text-sky-800"
  }

  if (status === "Siparişe Dönüştü") {
    return "border-emerald-200 bg-emerald-100 text-emerald-800"
  }

  if (status === "Reddedildi" || status === "Süresi Doldu") {
    return "border-rose-200 bg-rose-100 text-rose-800"
  }

  return "border-primary/10 bg-primary/10 text-primary"
}

function previewForThread(thread: MessageThread) {
  return thread.messages.at(-1)?.text ?? "Henüz mesaj yok."
}

function senderLabel(sender: ThreadSender) {
  return sender === "artisan" ? "Zanaatkar" : "Müşteri"
}

function matchesFilter(thread: MessageThread, filter: MessageFilter) {
  if (filter === "Tümü") {
    return true
  }

  if (filter === "Okunmamış") {
    return thread.unreadCount > 0 || thread.status === "Okunmamış"
  }

  if (filter === "Cevap Bekleyen") {
    return thread.status === "Cevap Bekliyor"
  }

  return thread.status === "Mutabakata Döndü"
}

export function NotificationFeed({ title, description, notifications, onOpenTarget }: NotificationFeedProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-black tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="secondary">{notifications.filter((item) => !item.isRead).length} yeni</Badge>
      </div>

      {notifications.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <BellDot className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Şu anda görünür bir bildirim bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notificationIcon(notification.type)

            return (
              <Card
                key={notification.id}
                className={cn(
                  "border-primary/10 transition-shadow hover:shadow-md",
                  notification.isRead ? "bg-card" : "bg-primary/5"
                )}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold">{notification.title}</p>
                          {!notification.isRead ? <Badge className="bg-amber-500 text-white">Yeni</Badge> : null}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(notification.createdAt)}</p>
                      </div>
                    </div>

                    <Button type="button" variant="outline" size="sm" onClick={() => onOpenTarget(notification)}>
                      İlgili Kaydı Aç
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function MessageWorkspace({
  title,
  description,
  viewerRole,
  threads,
  selectedThreadId,
  onSelectThread,
  onSendMessage,
  onThreadAction,
  threadActionLabel,
}: MessageWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("Tümü")
  const [draftMessage, setDraftMessage] = useState("")
  const deferredSearch = useDeferredValue(searchQuery)
  const threadContainerRef = useRef<HTMLDivElement>(null)

  const visibleThreads = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("tr-TR")

    return threads.filter((thread) => {
      const matchesSearch =
        normalizedSearch === "" ||
        thread.subject.toLocaleLowerCase("tr-TR").includes(normalizedSearch) ||
        thread.participantName.toLocaleLowerCase("tr-TR").includes(normalizedSearch) ||
        thread.productName.toLocaleLowerCase("tr-TR").includes(normalizedSearch)

      return matchesSearch && matchesFilter(thread, activeFilter)
    })
  }, [activeFilter, deferredSearch, threads])

  const selectedThread =
    threads.find((thread) => thread.id === selectedThreadId) ?? visibleThreads[0] ?? null

  useEffect(() => {
    threadContainerRef.current?.scrollTo({
      top: threadContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [selectedThread?.id, selectedThread?.messages.length])

  function handleSubmit() {
    if (!selectedThread) {
      return
    }

    const cleanMessage = draftMessage.trim()

    if (!cleanMessage) {
      return
    }

    onSendMessage(selectedThread.id, cleanMessage)
    setDraftMessage("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-primary/10 bg-muted/20">
          <CardHeader className="space-y-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">Konuşmalar</CardTitle>
              <CardDescription>Mesaj akışını filtreleyin ve bir görüşme seçin.</CardDescription>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
                placeholder="Ürün, kişi veya konu ara"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {messageFilters.map((filter) => (
                <Button
                  key={filter}
                  type="button"
                  size="sm"
                  variant={activeFilter === filter ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter)}
                >
                  <Filter className="size-3.5" />
                  {filter}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {visibleThreads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary/20 bg-background p-6 text-center">
                <p className="text-sm font-semibold">Eşleşen konuşma bulunamadı.</p>
                <p className="mt-2 text-xs text-muted-foreground">Arama veya filtreleri değiştirerek tekrar deneyin.</p>
              </div>
            ) : (
              visibleThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => onSelectThread(thread.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-colors",
                    selectedThread?.id === thread.id
                      ? "border-primary/20 bg-background shadow-sm"
                      : "border-transparent bg-background/70 hover:border-primary/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-bold">{thread.subject}</p>
                      <p className="truncate text-xs text-muted-foreground">{thread.participantName}</p>
                    </div>
                    {thread.unreadCount > 0 ? (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {thread.unreadCount}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2 py-1 text-[11px] font-bold", badgeStyleForThreadStatus(thread.status))}>
                      {thread.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{formatDateTime(thread.updatedAt)}</span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{previewForThread(thread)}</p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="border-b border-primary/10">
            {selectedThread ? (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{selectedThread.subject}</CardTitle>
                  <CardDescription>
                    {selectedThread.participantName} ile {selectedThread.productName} üzerine yürüyen görüşme
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full border px-2 py-1 text-[11px] font-bold", badgeStyleForThreadStatus(selectedThread.status))}>
                    {selectedThread.status}
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={() => onThreadAction(selectedThread.id)}>
                    {threadActionLabel}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <CardTitle className="text-lg">Bir konuşma seçin</CardTitle>
                <CardDescription>Sağ tarafta thread ve mesaj alanını görmek için listeden bir kayıt seçin.</CardDescription>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4 p-0">
            {selectedThread ? (
              <>
                <div ref={threadContainerRef} className="max-h-[28rem] space-y-4 overflow-y-auto p-5">
                  {selectedThread.messages.map((message) => {
                    const isOwnMessage = message.sender === viewerRole

                    return (
                      <article
                        key={message.id}
                        className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[90%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%]",
                            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"
                          )}
                        >
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-75">
                            {senderLabel(message.sender)}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed">{message.text}</p>
                          <span className="mt-3 block text-[11px] opacity-70">{message.timeLabel}</span>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="border-t border-primary/10 bg-muted/20 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <PackageOpen className="size-3.5" />
                    <span>{selectedThread.productName}</span>
                    <span className="rounded-full bg-background px-2 py-1">{selectedThread.participantName}</span>
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      placeholder="Mesajınızı yazın"
                      rows={4}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        {viewerRole === "artisan"
                          ? "Güncellediğiniz thread bildirim merkezine de yansır."
                          : "Gönderdiğiniz mesaj konuşma sırasını anında günceller."}
                      </p>
                      <Button type="button" onClick={handleSubmit} disabled={draftMessage.trim() === ""}>
                        <SendHorizonal className="size-4" />
                        Mesaj Gönder
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                <MailPlus className="size-10 text-muted-foreground/40" />
                <p className="text-sm font-semibold">Seçili konuşma bulunmuyor.</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Sol listeden bir kayıt seçin. Filtre nedeniyle görünmüyorsa aramayı temizleyip yeniden deneyin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AgreementsList({ title, description, items, highlightedItemId }: AgreementsListProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {items.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Gösterilecek mutabakat kaydı bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "border-primary/10 transition-shadow hover:shadow-md",
                highlightedItemId === item.id ? "border-primary/30 bg-primary/5" : "bg-card"
              )}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold">{item.title}</h3>
                      <span className={cn("rounded-full border px-2 py-1 text-[11px] font-bold", badgeStyleForConsensusStatus(item.status))}>
                        {item.status}
                      </span>
                      {highlightedItemId === item.id ? <Badge className="bg-primary text-white">Bildirimden Açıldı</Badge> : null}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {item.counterpartyName} • {item.productName}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                      <Clock3 className="size-3" />
                      {formatCompactDate(item.updatedAt)}
                    </div>
                    {item.ctaLabel ? <Badge variant="outline">{item.ctaLabel}</Badge> : null}
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
