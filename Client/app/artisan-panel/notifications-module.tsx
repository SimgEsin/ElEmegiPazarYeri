"use client"

import { NotificationFeed } from "@/components/site/communication-modules"
import type { NotificationItem } from "@/lib/mock-data"

type NotificationsModuleProps = {
  notifications: NotificationItem[]
  onOpenTarget: (notification: NotificationItem) => void
}

export default function NotificationsModule({ notifications, onOpenTarget }: NotificationsModuleProps) {
  return (
    <NotificationFeed
      title="Bildirim Merkezi"
      description="Yeni mesajlar, mutabakat adımları ve operasyon sinyallerini tek akışta izleyin."
      notifications={notifications}
      onOpenTarget={onOpenTarget}
    />
  )
}
