"use client"

import { MessageWorkspace } from "@/components/site/communication-modules"
import type { MessageThread } from "@/lib/mock-data"

type MessagesModuleProps = {
  threads: MessageThread[]
  selectedThreadId: string | null
  onSelectThread: (threadId: string) => void
  onSendMessage: (threadId: string, text: string) => void
  onArchiveThread: (threadId: string) => void
}

export default function MessagesModule({
  threads,
  selectedThreadId,
  onSelectThread,
  onSendMessage,
  onArchiveThread,
}: MessagesModuleProps) {
  return (
    <MessageWorkspace
      title="Mesajlar"
      description="Müşteri görüşmelerini aynı modülde yönetin, yanıtlayın ve mutabakata dönen kayıtları izleyin."
      viewerRole="artisan"
      threads={threads}
      selectedThreadId={selectedThreadId}
      onSelectThread={onSelectThread}
      onSendMessage={onSendMessage}
      onThreadAction={onArchiveThread}
      threadActionLabel="Konuşmayı Arşivle"
    />
  )
}
