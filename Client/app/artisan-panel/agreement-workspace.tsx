"use client"

import { FormEvent, useState } from "react"
import { CheckCircle2, Hammer, MessagesSquare, SendHorizonal, UserRound, XCircle } from "lucide-react"

import { formatPrice } from "@/lib/mock-data"
import type { ThreadMessage } from "@/lib/mock-data"
import type { OfferStatus } from "@/lib/api/types"
import { cn } from "@/lib/utils"

export type AgreementThread = {
  id: string
  buyerName: string
  productName: string
  offer: { id: string; proposedPrice: number; status: OfferStatus } | null
  updatedAt: string
  messages: ThreadMessage[]
}

type AgreementWorkspaceProps = {
  threads: AgreementThread[]
  selectedId: string | null
  onSelect: (id: string) => void
  onSendMessage: (id: string, text: string) => void | Promise<void>
  onMakeOffer: (id: string, price: number) => void | Promise<void>
}

function offerBadge(status: OfferStatus) {
  if (status === "Accepted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[11px] font-bold text-green-700">
        <CheckCircle2 className="size-3.5" />
        Onaylandı
      </span>
    )
  }
  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[11px] font-bold text-red-700">
        <XCircle className="size-3.5" />
        Reddedildi
      </span>
    )
  }
  return <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">Onay Bekliyor</span>
}

export default function AgreementWorkspace({
  threads,
  selectedId,
  onSelect,
  onSendMessage,
  onMakeOffer,
}: AgreementWorkspaceProps) {
  const [draft, setDraft] = useState("")
  const [offerPrice, setOfferPrice] = useState("")
  const [busy, setBusy] = useState(false)

  const selected = threads.find((thread) => thread.id === selectedId) ?? null
  const offer = selected?.offer ?? null
  const hasPendingOffer = offer?.status === "Pending"

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !selected) {
      return
    }
    setBusy(true)
    try {
      await onSendMessage(selected.id, text)
      setDraft("")
    } finally {
      setBusy(false)
    }
  }

  async function handleOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected) {
      return
    }
    const parsed = Number(offerPrice.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."))
    if (!parsed || parsed <= 0) {
      return
    }
    setBusy(true)
    try {
      await onMakeOffer(selected.id, parsed)
      setOfferPrice("")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-black">
          <MessagesSquare className="size-5 text-primary" />
          Mutabakatlar
        </h2>
        <p className="text-sm text-muted-foreground">
          Siparişe özel üretim taleplerini görüşün ve alıcıya resmi teklifinizi gönderin.
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center text-sm text-muted-foreground">
          Henüz bir mutabakat talebi yok. Alıcılar bir ürünün “Siparişi Başlat” ekranından sizinle iletişime geçtiğinde
          görüşmeler burada listelenir.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-2">
            {threads.map((thread) => {
              const isActive = thread.id === selectedId
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => onSelect(thread.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                    isActive
                      ? "border-primary/30 bg-primary/10"
                      : "border-primary/10 bg-card hover:border-primary/20 hover:bg-primary/5",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold">{thread.buyerName}</span>
                    {thread.offer ? offerBadge(thread.offer.status) : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{thread.productName}</p>
                </button>
              )
            })}
          </aside>

          <section className="flex min-h-[28rem] flex-col rounded-xl border border-primary/10 bg-card">
            {selected ? (
              <>
                <header className="flex items-center justify-between gap-3 border-b border-primary/10 px-5 py-4">
                  <div>
                    <h3 className="text-sm font-bold">{selected.buyerName}</h3>
                    <p className="text-xs text-muted-foreground">{selected.productName}</p>
                  </div>
                  {offer ? offerBadge(offer.status) : null}
                </header>

                <div className="flex-1 space-y-4 overflow-y-auto bg-primary/5 p-4">
                  {selected.messages.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">Bu görüşmede henüz mesaj yok.</p>
                  ) : (
                    selected.messages.map((message) => {
                      const isOwn = message.sender === "artisan"
                      return (
                        <article key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[75%] ${isOwn ? "bg-primary text-white" : "bg-white"}`}
                          >
                            <div className="mb-1 flex items-center gap-2 text-xs font-semibold">
                              {isOwn ? <Hammer className="size-4" /> : <UserRound className="size-4" />}
                              <span>{isOwn ? "Siz" : "Alıcı"}</span>
                            </div>
                            <p className={`text-sm leading-relaxed ${isOwn ? "text-white" : "text-stone-700 dark:text-stone-200"}`}>
                              {message.text}
                            </p>
                            <span className={`mt-2 block text-[10px] ${isOwn ? "text-white/80" : "text-muted-foreground"}`}>
                              {message.timeLabel}
                            </span>
                          </div>
                        </article>
                      )
                    })
                  )}
                </div>

                <div className="space-y-3 border-t border-primary/10 p-4">
                  <form onSubmit={handleSend} className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Alıcıya yanıt yazın..."
                      className="h-11 flex-1 rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                      <SendHorizonal className="size-4" />
                      Gönder
                    </button>
                  </form>

                  {offer ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/10 bg-white p-3 text-sm">
                      <span className="font-semibold">Son teklif</span>
                      <span className="text-lg font-black">{formatPrice(offer.proposedPrice)}</span>
                    </div>
                  ) : null}

                  {offer?.status === "Accepted" ? (
                    <p className="text-xs font-semibold text-green-700">Alıcı teklifi onayladı. Mutabakat sağlandı.</p>
                  ) : hasPendingOffer ? (
                    <p className="text-xs font-semibold text-amber-700">Teklif gönderildi. Alıcının yanıtını bekleyin.</p>
                  ) : (
                    <form onSubmit={handleOffer} className="flex flex-col gap-2 sm:flex-row">
                      <input
                        inputMode="decimal"
                        value={offerPrice}
                        onChange={(event) => setOfferPrice(event.target.value)}
                        placeholder={offer ? "Yeni teklif tutarı (TL)" : "Resmi teklif tutarı (TL)"}
                        className="h-11 flex-1 rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
                      />
                      <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 px-5 text-sm font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
                      >
                        {offer ? "Yeni Teklif Gönder" : "Resmi Teklif Gönder"}
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
                Görüntülemek için bir görüşme seçin.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
