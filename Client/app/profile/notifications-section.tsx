"use client"

import { NotificationFeed } from "@/components/site/communication-modules"
import type { NotificationItem } from "@/lib/mock-data"

type NotificationsSectionProps = {
  notifications: NotificationItem[]
  onOpenTarget: (notification: NotificationItem) => void
}

export default function NotificationsSection({ notifications, onOpenTarget }: NotificationsSectionProps) {
  return (
    <NotificationFeed
      title="Bildirim Merkezi"
      description="Karar bekleyen mutabakatları ve yeni zanaatkar mesajlarını bu akıştan takip edin."
      notifications={notifications}
      onOpenTarget={onOpenTarget}
    />
  )
}
