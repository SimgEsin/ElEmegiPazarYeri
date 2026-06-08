"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, CheckCircle2, Hammer, MessageCircle, SendHorizonal, UserRound, XCircle } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { getArtisanProfileBySlug } from "@/lib/api/artisans"
import { getProductBySlug } from "@/lib/api/products"
import {
  getConversationMessages,
  getMyAgreements,
  getMyConversations,
  makeOffer,
  respondToOffer,
  sendMessage,
  type ConversationMessage,
} from "@/lib/api/conversations"
import { formatTry } from "@/lib/format"
import type { OfferStatus, ProductDetails } from "@/lib/api/types"

type OfferView = { id: string; proposedPrice: number; status: OfferStatus } | null

type ConversationOption = { id: string; label: string }

const POLL_MS = 6000

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

export default function MutabakatClient({ slug }: { slug: string }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [artisanProfileId, setArtisanProfileId] = useState<string | null>(null)
  const [viewerIsArtisan, setViewerIsArtisan] = useState(false)

  const [conversationId, setConversationId] = useState<string | null>(null)
  const [artisanConversations, setArtisanConversations] = useState<ConversationOption[]>([])
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [offer, setOffer] = useState<OfferView>(null)

  const [draft, setDraft] = useState("")
  const [offerPrice, setOfferPrice] = useState("")
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const chatRef = useRef<HTMLDivElement>(null)

  const loadConversationState = useCallback(
    async (productId: string, profileId: string | null, isArtisan: boolean, preferredConversationId?: string | null) => {
      const conversations = await getMyConversations()
      const matching = conversations.filter(
        (conversation) =>
          conversation.type === "Agreement" &&
          conversation.productId === productId &&
          (profileId ? conversation.artisanProfileId === profileId : true),
      )

      if (isArtisan) {
        setArtisanConversations(
          matching.map((conversation) => ({
            id: conversation.id,
            label: conversation.buyerDisplayName?.trim() || "Alıcı",
          })),
        )
      }

      const chosen = matching.find((conversation) => conversation.id === preferredConversationId) ?? matching[0] ?? null
      const chosenId = chosen?.id ?? null
      setConversationId(chosenId)

      if (!chosenId) {
        setMessages([])
        setOffer(null)
        return
      }

      const [conversationMessages, agreements] = await Promise.all([
        getConversationMessages(chosenId).catch(() => [] as ConversationMessage[]),
        getMyAgreements().catch(() => []),
      ])

      setMessages(conversationMessages ?? [])

      const latestOffer = agreements
        .filter((agreement) => agreement.conversationId === chosenId)
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())[0]

      if (latestOffer) {
        setOffer({ id: latestOffer.id, proposedPrice: latestOffer.proposedPrice, status: latestOffer.status })
      } else if (chosen?.activeOffer) {
        setOffer({
          id: chosen.activeOffer.id,
          proposedPrice: chosen.activeOffer.proposedPrice,
          status: chosen.activeOffer.status,
        })
      } else {
        setOffer(null)
      }
    },
    [],
  )

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    let cancelled = false

    async function initialize() {
      setLoading(true)
      setError(null)
      try {
        const loadedProduct = await getProductBySlug(slug)
        if (!loadedProduct) {
          if (!cancelled) setError("Ürün bulunamadı.")
          return
        }

        const isArtisan = Boolean(user?.id && loadedProduct.artisanId === user.id)

        let profileId: string | null = null
        if (loadedProduct.artisanSlug) {
          const profile = await getArtisanProfileBySlug(loadedProduct.artisanSlug)
          profileId = profile?.id ?? null
        }

        if (cancelled) return

        setProduct(loadedProduct)
        setViewerIsArtisan(isArtisan)
        setArtisanProfileId(profileId)

        if (!profileId) {
          setError("Bu ürünün satıcı profili bulunamadığı için mutabakat başlatılamıyor.")
          return
        }

        await loadConversationState(loadedProduct.id, profileId, isArtisan)
      } catch {
        if (!cancelled) setError("Mutabakat ekranı yüklenemedi. Lütfen tekrar deneyin.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    initialize()

    return () => {
      cancelled = true
    }
  }, [slug, isAuthenticated, user?.id, loadConversationState, router])

  useEffect(() => {
    if (!product || !artisanProfileId) {
      return
    }

    const timer = window.setInterval(() => {
      loadConversationState(product.id, artisanProfileId, viewerIsArtisan, conversationId).catch(() => undefined)
    }, POLL_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [product, artisanProfileId, viewerIsArtisan, conversationId, loadConversationState])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !product || !artisanProfileId) {
      return
    }

    if (viewerIsArtisan && !conversationId) {
      setActionError("Önce alıcının mesaj göndermesi gerekir.")
      return
    }

    setBusy(true)
    setActionError(null)
    try {
      await sendMessage(product.id, artisanProfileId, text, "Agreement")
      setDraft("")
      await loadConversationState(product.id, artisanProfileId, viewerIsArtisan, conversationId)
    } catch {
      setActionError("Mesaj gönderilemedi. Lütfen tekrar deneyin.")
    } finally {
      setBusy(false)
    }
  }

  const handleRespondToOffer = async (isAccepted: boolean) => {
    if (!offer || !product) {
      return
    }

    setBusy(true)
    setActionError(null)
    try {
      await respondToOffer(offer.id, isAccepted)
      await loadConversationState(product.id, artisanProfileId, viewerIsArtisan, conversationId)
    } catch {
      setActionError("Teklife yanıt verilemedi. Lütfen tekrar deneyin.")
    } finally {
      setBusy(false)
    }
  }

  const handleMakeOffer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!conversationId || !product) {
      return
    }

    const parsedPrice = Number(offerPrice.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."))
    if (!parsedPrice || parsedPrice <= 0) {
      setActionError("Geçerli bir teklif tutarı girin.")
      return
    }

    setBusy(true)
    setActionError(null)
    try {
      await makeOffer(conversationId, parsedPrice)
      setOfferPrice("")
      await loadConversationState(product.id, artisanProfileId, viewerIsArtisan, conversationId)
    } catch {
      setActionError("Teklif oluşturulamadı. Lütfen tekrar deneyin.")
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Mutabakat ekranı yükleniyor...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="text-sm font-semibold text-red-600">{error ?? "Bir hata oluştu."}</p>
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
          <ArrowLeft className="size-4" />
          Ürünlere dön
        </Link>
      </div>
    )
  }

  const viewerRole = viewerIsArtisan ? "Artisan" : "Buyer"
  const hasPendingOffer = offer?.status === "Pending"

  return (
    <div className="space-y-8 pb-10">
      <Link
        href={`/products/${product.slug}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        <ArrowLeft className="size-4" />
        Ürün sayfasına dön
      </Link>

      <section className="rounded-2xl border border-primary/10 bg-card p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-3 border-b border-primary/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-black">Siparişi Başlat</h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {viewerIsArtisan ? "Satıcı Görünümü" : "Alıcı Görünümü"}
            </span>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            {product.name} · {product.artisanDisplayName ?? "Zanaatkâr"}
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Önce satıcıyla detayları konuşun. Mutabık kalındığında satıcı resmi teklifini paylaşır, alıcı teklifi onaylayınca
            mutabakat sağlanır.
          </p>

          {viewerIsArtisan && artisanConversations.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="conversation-select" className="text-xs font-semibold text-foreground">
                Görüşme:
              </label>
              <select
                id="conversation-select"
                value={conversationId ?? ""}
                onChange={(event) => setConversationId(event.target.value)}
                className="h-9 rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              >
                {artisanConversations.map((conversation) => (
                  <option key={conversation.id} value={conversation.id}>
                    {conversation.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="space-y-4 xl:col-span-2">
            <div
              ref={chatRef}
              className="max-h-140 min-h-72 space-y-4 overflow-y-auto rounded-xl border border-primary/10 bg-primary/5 p-4"
            >
              {messages.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  {viewerIsArtisan
                    ? "Bu ürün için henüz bir mutabakat görüşmesi yok."
                    : "İlk mesajınızı göndererek satıcıyla mutabakat sürecini başlatın."}
                </p>
              ) : (
                messages.map((message) => {
                  const isOwn = message.senderRole === viewerRole
                  return (
                    <article key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[75%] ${isOwn ? "bg-primary text-white" : "bg-white"}`}
                      >
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold">
                          {message.senderRole === "Artisan" ? (
                            <Hammer className={`size-4 ${isOwn ? "" : "text-primary"}`} />
                          ) : (
                            <UserRound className="size-4" />
                          )}
                          <span>{message.senderRole === "Artisan" ? "Satıcı" : "Alıcı"}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isOwn ? "text-white" : "text-stone-700 dark:text-stone-200"}`}>
                          {message.content}
                        </p>
                        <span className={`mt-2 block text-[10px] ${isOwn ? "text-white/80" : "text-muted-foreground"}`}>
                          {formatTime(message.sentAt)}
                        </span>
                      </div>
                    </article>
                  )
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex flex-col gap-3 rounded-xl border border-primary/10 bg-white p-4 sm:flex-row">
              <label htmlFor="mutabakat-mesaj" className="sr-only">
                Mesajınız
              </label>
              <input
                id="mutabakat-mesaj"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={viewerIsArtisan ? "Alıcıya yanıt yazın..." : "Satıcıya mesaj yazın..."}
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

            {actionError ? <p className="text-xs font-semibold text-red-600">{actionError}</p> : null}
          </section>

          <aside className="space-y-4 rounded-xl border border-primary/10 bg-card p-5">
            <h2 className="text-lg font-bold">Mutabakat Durumu</h2>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MessageCircle className="mt-0.5 size-4 text-primary" />
              {offer === null
                ? "Henüz resmi teklif yok."
                : offer.status === "Pending"
                  ? "Resmi teklif onay bekliyor."
                  : offer.status === "Accepted"
                    ? "Mutabakat sağlandı."
                    : "Teklif reddedildi."}
            </p>

            {offer ? (
              <section className="space-y-3 rounded-lg border border-primary/10 bg-white p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold">Resmi Teklif</h3>
                  {offer.status === "Accepted" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[11px] font-bold text-green-700">
                      <CheckCircle2 className="size-3.5" />
                      Onaylandı
                    </span>
                  ) : offer.status === "Pending" ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">Onay Bekliyor</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[11px] font-bold text-red-700">
                      <XCircle className="size-3.5" />
                      Reddedildi
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-foreground">{formatTry(offer.proposedPrice)}</p>
              </section>
            ) : null}

            {!viewerIsArtisan ? (
              <>
                {offer === null ? (
                  <p className="text-xs font-semibold text-muted-foreground">
                    Detaylarda anlaştığınızda satıcı resmi teklifini paylaşacak. Teklif geldiğinde buradan onaylayabilirsiniz.
                  </p>
                ) : null}

                {hasPendingOffer ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleRespondToOffer(true)}
                      disabled={busy}
                      className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                      Teklifi Kabul Et
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRespondToOffer(false)}
                      disabled={busy}
                      className="flex w-full items-center justify-center rounded-lg border border-primary/20 bg-white py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
                    >
                      Teklifi Reddet
                    </button>
                  </div>
                ) : null}

                {offer?.status === "Accepted" ? (
                  <p className="text-xs font-semibold text-green-700">
                    Teklifi onayladınız. Satıcı üretim ve teslimat sürecini başlatacak.
                  </p>
                ) : null}

                {offer?.status === "Rejected" ? (
                  <p className="text-xs font-semibold text-amber-700">Teklifi reddettiniz. Satıcı yeni bir teklif paylaşabilir.</p>
                ) : null}
              </>
            ) : (
              <>
                {!conversationId ? (
                  <p className="text-xs font-semibold text-muted-foreground">
                    Alıcı mesaj gönderdiğinde görüşme burada açılır ve teklif oluşturabilirsiniz.
                  </p>
                ) : hasPendingOffer ? (
                  <p className="text-xs font-semibold text-amber-700">Teklif gönderildi. Alıcının yanıtını bekleyin.</p>
                ) : (
                  <form onSubmit={handleMakeOffer} className="space-y-3 rounded-xl border border-primary/10 bg-white p-4">
                    <h3 className="text-sm font-bold">{offer ? "Yeni Teklif Oluştur" : "Resmi Teklif Oluştur"}</h3>
                    <div className="space-y-2">
                      <label htmlFor="offer-price" className="text-xs font-semibold text-foreground">
                        Toplam fiyat (TL)
                      </label>
                      <input
                        id="offer-price"
                        inputMode="decimal"
                        value={offerPrice}
                        onChange={(event) => setOfferPrice(event.target.value)}
                        placeholder="Örn. 8500"
                        className="h-10 w-full rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={busy}
                      className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                      Teklifi Gönder
                    </button>
                  </form>
                )}

                {offer?.status === "Accepted" ? (
                  <p className="text-xs font-semibold text-green-700">Alıcı teklifi onayladı. Mutabakat sağlandı.</p>
                ) : null}
              </>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}
