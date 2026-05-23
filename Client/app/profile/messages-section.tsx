"use client"

import { MessageWorkspace } from "@/components/site/communication-modules"
import type { MessageThread } from "@/lib/mock-data"

type MessagesSectionProps = {
  threads: MessageThread[]
  selectedThreadId: string | null
  onSelectThread: (threadId: string) => void
  onSendMessage: (threadId: string, text: string) => void
  onCloseThread: (threadId: string) => void
}

export default function MessagesSection({
  threads,
  selectedThreadId,
  onSelectThread,
  onSendMessage,
  onCloseThread,
}: MessagesSectionProps) {
  return (
    <MessageWorkspace
      title="Mesajlar"
      description="Zanaatkarlarla yazışmaları aynı modülde yönetin ve karar akışına dönen konuşmaları izleyin."
      viewerRole="customer"
      threads={threads}
      selectedThreadId={selectedThreadId}
      onSelectThread={onSelectThread}
      onSendMessage={onSendMessage}
      onThreadAction={onCloseThread}
      threadActionLabel="Konuşmayı Kapat"
    />
  )
}
