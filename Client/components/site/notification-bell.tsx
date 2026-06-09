"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { getNotifications, markNotificationRead } from "@/lib/api/notifications"
import { useRealtimeNotifications } from "@/lib/use-realtime-notifications"
import type { Notification } from "@/lib/api/types"
import { cn } from "@/lib/utils"

// Bildirim zamanini "az once / 5 dk once / 2 sa once / 3 gun once" gibi gosterir.
function formatRelativeTime(isoDate: string): string {
  const created = new Date(isoDate).getTime()
  if (Number.isNaN(created)) {
    return ""
  }

  const diffSeconds = Math.floor((Date.now() - created) / 1000)
  if (diffSeconds < 60) {
    return "az önce"
  }
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `${diffMinutes} dk önce`
  }
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} sa önce`
  }
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} gün önce`
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  // Dropdown bu oturumda acildiginda okunmamis olan bildirimlerin id'leri.
  // Bunlari okundu olarak isaretleriz ama acik kaldigi surece "yeni" stiliyle gosteririz.
  const [justReadIds, setJustReadIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((item) => !item.isRead).length

  const loadNotifications = useCallback(async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch {
      // Oturum yoksa veya istek basarisizsa sessizce yok say.
    }
  }, [])

  useEffect(() => {
    void loadNotifications()
  }, [loadNotifications])

  // SignalR: yeni bir bildirim push'u gelince listeyi aninda tazele.
  useRealtimeNotifications(() => {
    void loadNotifications()
  })

  const closeDropdown = useCallback(() => {
    setOpen(false)
    setJustReadIds(new Set())
  }, [])

  // Dropdown disina tiklayinca kapat.
  useEffect(() => {
    if (!open) {
      return
    }
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [open, closeDropdown])

  function handleToggle() {
    setOpen((isOpen) => {
      const next = !isOpen
      if (next) {
        // Dropdown aciliyor: okunmamis tum bildirimleri okundu isaretle (rozet sifirlanir),
        // ama bu oturumda "yeni" vurgusunu korumak icin id'lerini sakla.
        const unread = notifications.filter((item) => !item.isRead)
        if (unread.length > 0) {
          setJustReadIds(new Set(unread.map((item) => item.id)))
          setNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
          void Promise.all(
            unread.map((item) => markNotificationRead(item.id).catch(() => undefined)),
          )
        }
      } else {
        // Kapaninca "yeni" vurgusunu temizle; sonraki acilista temiz baslar.
        setJustReadIds(new Set())
      }
      return next
    })
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Bildirimler"
        onClick={handleToggle}
        className="relative rounded-full text-muted-foreground hover:text-foreground"
      >
        <Bell />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[0.625rem] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Bildirimler</span>
            {justReadIds.size > 0 ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.6875rem] font-medium text-primary">
                {justReadIds.size} yeni
              </span>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Henüz bildiriminiz yok.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.slice(0, 8).map((notification) => {
                  // Bu oturumda yeni gelen (henuz acilista okundu isaretlenen) bildirimleri vurgula.
                  const isHighlighted = justReadIds.has(notification.id) || !notification.isRead
                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={closeDropdown}
                        className={cn(
                          "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                          isHighlighted ? "bg-primary/5" : "",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={cn(
                              "mt-1.5 size-2 shrink-0 rounded-full",
                              isHighlighted ? "bg-primary" : "bg-transparent",
                            )}
                            aria-hidden
                          />
                          <span
                            className={cn(
                              "flex-1 text-sm",
                              isHighlighted
                                ? "font-semibold text-foreground"
                                : "font-medium text-muted-foreground",
                            )}
                          >
                            {notification.title}
                          </span>
                        </div>
                        {notification.description ? (
                          <span className="line-clamp-2 pl-4 text-xs text-muted-foreground">
                            {notification.description}
                          </span>
                        ) : null}
                        <span className="pl-4 text-[0.6875rem] text-muted-foreground/80">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-border">
            <Link
              href="/profile#bildirimler"
              onClick={closeDropdown}
              className="block px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-muted/60"
            >
              Bildirim merkezine git
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
