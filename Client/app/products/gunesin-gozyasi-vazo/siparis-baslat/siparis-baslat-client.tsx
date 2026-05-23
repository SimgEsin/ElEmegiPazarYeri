"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock3, Hammer, MessageCircle, SendHorizonal, ShoppingBag, UserRound } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"

type ViewerRole = "buyer" | "seller"
type ChatSender = "customer" | "artisan"
type FlowStage =
  | "chatting"
  | "awaiting_consensus"
  | "consensus_approved"
  | "awaiting_offer_acceptance"
  | "offer_accepted"
  | "offer_rejected"
  | "offer_expired"
  | "converted_to_order"

type ChatMessage = {
  id: string
  sender: ChatSender
  text: string
  timeLabel: string
}

type OfferDraft = {
  productDetails: string
  productionDuration: string
  totalPrice: string
}

type Offer = OfferDraft & {
  version: number
  createdAt: number
  expiresAt: number
}

type SiparisBaslatClientProps = {
  role: ViewerRole
}

const initialMessages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "artisan",
    text: "Merhaba, ben Elif. İstediğiniz vazo ölçüsü, renk tonu ve kullanım alanını paylaşırsanız birlikte netleştirebiliriz.",
    timeLabel: "10:02",
  },
  {
    id: "m-2",
    sender: "customer",
    text: "Merhaba Elif Hanım, 38 cm boyunda, gün batımı tonlarına yakın ve mat dokulu bir versiyon istiyorum.",
    timeLabel: "10:04",
  },
  {
    id: "m-3",
    sender: "artisan",
    text: "Harika seçim. Boyunu 38 cm, ana paleti sıcak turuncu-kiremit geçişli planlayabiliriz. İsterseniz bir deneme sır kartelası da paylaşabilirim.",
    timeLabel: "10:06",
  },
]

const quickPrompts = [
  "Boy: 38 cm, mat doku",
  "Renk: gün batımı tonları",
  "Teslim tarihi: en geç 30 gün",
  "Ağız çapı biraz daha geniş olsun",
]

const artisanAutoReplies = [
  "Not aldım. Bu detayı üretim planına ekliyorum.",
  "Bunu teknik olarak uygulayabiliriz. İsterseniz bir alternatif daha sunabilirim.",
  "Süper, bu tercih eser formunu daha güçlü hale getirecek.",
]

const customerAutoReplies = [
  "Teşekkür ederim, bu yaklaşım benim için uygun görünüyor.",
  "Bu versiyon iyi görünüyor, netleştirelim.",
  "Anladım, bu bilgiyi not ettim.",
]

const OFFER_VALIDITY_MS = 48 * 60 * 60 * 1000

function getTimeLabel(): string {
  return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

function formatDateLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function stageLabel(stage: FlowStage): string {
  switch (stage) {
    case "chatting":
      return "Mutabakat aşaması"
    case "awaiting_consensus":
      return "Alıcı mutabakat onayı"
    case "consensus_approved":
      return "Satıcı teklif hazırlığı"
    case "awaiting_offer_acceptance":
      return "Alıcı teklif onayı"
    case "offer_accepted":
      return "Siparişe geçiş hazır"
    case "offer_rejected":
      return "Teklif reddedildi"
    case "offer_expired":
      return "Teklif süresi doldu"
    case "converted_to_order":
      return "Standart siparişe geçildi"
    default:
      return "Süreç"
  }
}

export default function SiparisBaslatClient({ role }: SiparisBaslatClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draftMessage, setDraftMessage] = useState("")
  const [replyIndex, setReplyIndex] = useState(0)
  const [flowStage, setFlowStage] = useState<FlowStage>("chatting")
  const [hasChatActivity, setHasChatActivity] = useState(false)
  const [offerDraft, setOfferDraft] = useState<OfferDraft>({
    productDetails: "Güneş batımı tonlarında, 38 cm yüksekliğinde mat doku vazo",
    productionDuration: "30 gün",
    totalPrice: "2.950 TL",
  })
  const [offer, setOffer] = useState<Offer | null>(null)
  const [nowTimestamp, setNowTimestamp] = useState<number>(() => Date.now())
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTimestamp(Date.now())
    }, 60_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const isOfferExpired = Boolean(offer && nowTimestamp >= offer.expiresAt)
  const activeStage: FlowStage = flowStage === "offer_accepted" && isOfferExpired ? "offer_expired" : flowStage
  const isBuyer = role === "buyer"
  const actorSender: ChatSender = isBuyer ? "customer" : "artisan"
  const counterpartySender: ChatSender = isBuyer ? "artisan" : "customer"
  const autoReplies = isBuyer ? artisanAutoReplies : customerAutoReplies

  const standardOrderHref =
    offer && activeStage === "offer_accepted"
      ? {
          pathname: "/products/gunesin-gozyasi-vazo/siparis-baslat/standart-siparis",
          query: {
            role: "buyer",
            offerVersion: String(offer.version),
            productDetails: offer.productDetails,
            productionDuration: offer.productionDuration,
            totalPrice: offer.totalPrice,
            expiresAt: String(offer.expiresAt),
          },
        }
      : "/products/gunesin-gozyasi-vazo/siparis-baslat/standart-siparis?role=buyer"

  const nextStepText =
    activeStage === "chatting"
      ? "Mesajlaşma sonrası alıcı mutabakatı onaylar"
      : activeStage === "awaiting_consensus"
        ? "Alıcı mutabakatı onaylar"
        : activeStage === "consensus_approved"
          ? "Satıcı resmi teklifi oluşturur"
          : activeStage === "awaiting_offer_acceptance"
            ? "Alıcı teklifi kabul ya da reddeder"
            : activeStage === "offer_accepted"
              ? "Alıcı standart siparişi başlatır"
              : activeStage === "converted_to_order"
                ? "Standart sipariş akışı devam eder"
                : "Satıcı yeni teklif versiyonu hazırlar"

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanMessage = draftMessage.trim()

    if (!cleanMessage) {
      return
    }

    const actorMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: actorSender,
      text: cleanMessage,
      timeLabel: getTimeLabel(),
    }

    setMessages((prevMessages) => [...prevMessages, actorMessage])
    setDraftMessage("")
    setHasChatActivity(true)
    if (flowStage === "chatting") {
      setFlowStage("awaiting_consensus")
    }

    const selectedReply = autoReplies[replyIndex % autoReplies.length]
    setReplyIndex((prev) => prev + 1)

    window.setTimeout(() => {
      const counterpartyMessage: ChatMessage = {
        id: `m-${Date.now()}-reply`,
        sender: counterpartySender,
        text: selectedReply,
        timeLabel: getTimeLabel(),
      }
      setMessages((prevMessages) => [...prevMessages, counterpartyMessage])
    }, 450)
  }

  const handleApproveConsensus = () => {
    if (!isBuyer || activeStage !== "awaiting_consensus" || !hasChatActivity) {
      return
    }

    setFlowStage("consensus_approved")
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `m-${Date.now()}-consensus-approved`,
        sender: "customer",
        text: "Ürün detaylarında mutabıkız. Resmi teklifinizi paylaşabilirsiniz.",
        timeLabel: getTimeLabel(),
      },
    ])
  }

  const handleCreateOffer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!role || role !== "seller") {
      return
    }

    if (!offerDraft.productDetails.trim() || !offerDraft.productionDuration.trim() || !offerDraft.totalPrice.trim()) {
      return
    }

    if (!(activeStage === "consensus_approved" || activeStage === "offer_rejected" || activeStage === "offer_expired")) {
      return
    }

    const createdAt = Date.now()
    const version = offer ? offer.version + 1 : 1
    const nextOffer: Offer = {
      ...offerDraft,
      version,
      createdAt,
      expiresAt: createdAt + OFFER_VALIDITY_MS,
    }

    setOffer(nextOffer)
    setFlowStage("awaiting_offer_acceptance")
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `m-${Date.now()}-offer-created`,
        sender: "artisan",
        text: `Resmi teklif v${version}: ${nextOffer.productDetails}. Üretim/Teslim: ${nextOffer.productionDuration}. Toplam fiyat: ${nextOffer.totalPrice}.`,
        timeLabel: getTimeLabel(),
      },
    ])
  }

  const handleBuyerDecision = (decision: "accept" | "reject") => {
    if (!isBuyer || activeStage !== "awaiting_offer_acceptance" || !offer) {
      return
    }

    if (decision === "accept") {
      setFlowStage("offer_accepted")
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `m-${Date.now()}-offer-accepted`,
          sender: "customer",
          text: `Teklif v${offer.version} onaylandı. Standart sipariş adımına geçiyorum.`,
          timeLabel: getTimeLabel(),
        },
      ])
      return
    }

    setFlowStage("offer_rejected")
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `m-${Date.now()}-offer-rejected`,
        sender: "customer",
        text: `Teklif v${offer.version} bu haliyle uygun değil. Revize teklif paylaşabilir misiniz?`,
        timeLabel: getTimeLabel(),
      },
    ])
  }

  const offerSummaryCard = offer ? (
    <section className="space-y-3 rounded-lg border border-primary/10 bg-white p-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">Resmi Teklif v{offer.version}</h3>
        {activeStage === "offer_accepted" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[11px] font-bold text-green-700">
            <CheckCircle2 className="size-3.5" />
            Onaylandı
          </span>
        ) : activeStage === "awaiting_offer_acceptance" ? (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">Onay Bekliyor</span>
        ) : activeStage === "offer_expired" ? (
          <span className="rounded-full bg-stone-200 px-2 py-1 text-[11px] font-bold text-stone-700">Süresi Doldu</span>
        ) : (
          <span className="rounded-full bg-red-100 px-2 py-1 text-[11px] font-bold text-red-700">Reddedildi</span>
        )}
      </div>

      <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
        <li>
          <strong className="text-foreground">Ürün detayları:</strong> {offer.productDetails}
        </li>
        <li>
          <strong className="text-foreground">Üretim/Teslim:</strong> {offer.productionDuration}
        </li>
        <li>
          <strong className="text-foreground">Toplam fiyat:</strong> {offer.totalPrice}
        </li>
        <li>
          <strong className="text-foreground">Teklif oluşturulma:</strong> {formatDateLabel(offer.createdAt)}
        </li>
        <li>
          <strong className="text-foreground">Geçerlilik bitişi:</strong> {formatDateLabel(offer.expiresAt)}
        </li>
      </ul>
    </section>
  ) : null

  return (
    <div className="space-y-8 pb-10">
      <Link
        href="/products/gunesin-gozyasi-vazo"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        <ArrowLeft className="size-4" />
        Ürün sayfasına dön
      </Link>

      <section className="rounded-2xl border border-primary/10 bg-card p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-3 border-b border-primary/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-black">Siparişi Başlat</h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{isBuyer ? "Alıcı Görünümü" : "Satıcı Görünümü"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products/gunesin-gozyasi-vazo/siparis-baslat?role=buyer"
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${isBuyer ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
            >
              Alıcıyı Gör
            </Link>
            <Link
              href="/products/gunesin-gozyasi-vazo/siparis-baslat?role=seller"
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${!isBuyer ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
            >
              Satıcıyı Gör
            </Link>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Zorunlu sıra: önce chatleşme, sonra alıcı mutabakat onayı, ardından satıcı teklifi, sonra alıcı teklif onayı ve en son standart sipariş geçişi.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="space-y-4 xl:col-span-2">
            <div ref={chatContainerRef} className="max-h-140 space-y-4 overflow-y-auto rounded-xl border border-primary/10 bg-primary/5 p-4">
              {messages.map((message) => {
                const isCustomerMessage = message.sender === "customer"
                return (
                  <article key={message.id} className={`flex ${isCustomerMessage ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[75%] ${isCustomerMessage ? "bg-primary text-white" : "bg-white"}`}>
                      <div className="mb-1 flex items-center gap-2 text-xs font-semibold">
                        {isCustomerMessage ? <UserRound className="size-4" /> : <Hammer className="size-4 text-primary" />}
                        <span>{isCustomerMessage ? "Alıcı" : "Zanaatkar Elif"}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isCustomerMessage ? "text-white" : "text-stone-700 dark:text-stone-200"}`}>{message.text}</p>
                      <span className={`mt-2 block text-[10px] ${isCustomerMessage ? "text-white/80" : "text-muted-foreground"}`}>{message.timeLabel}</span>
                    </div>
                  </article>
                )
              })}
            </div>

            <form onSubmit={handleSendMessage} className="flex flex-col gap-3 rounded-xl border border-primary/10 bg-white p-4 sm:flex-row">
              <label htmlFor="siparis-mesaj" className="sr-only">
                Mesajınız
              </label>
              <input
                id="siparis-mesaj"
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                placeholder={isBuyer ? "Alıcı mesajı yazın..." : "Satıcı mesajı yazın..."}
                className="h-11 flex-1 rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                <SendHorizonal className="size-4" />
                Gönder
              </button>
            </form>
          </section>

          <aside className="space-y-4 rounded-xl border border-primary/10 bg-card p-5">
            <h2 className="text-lg font-bold">Süreç Durumu</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 size-4 text-primary" />
                Şu anki adım: {stageLabel(activeStage)}
              </p>
            </div>


            {offerSummaryCard}

            {isBuyer ? (
              <>
                {activeStage === "chatting" ? (
                  <p className="text-xs font-semibold text-muted-foreground">Satıcıyla anlaşma aşamasındasınız. İlk mesajdan sonra mutabakat onayı açılır.</p>
                ) : null}

                {activeStage === "awaiting_consensus" ? (
                  <button
                    type="button"
                    onClick={handleApproveConsensus}
                    disabled={!hasChatActivity}
                    className="flex w-full items-center justify-center rounded-lg border border-primary/20 bg-white py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Mutabakatı Onayla
                  </button>
                ) : null}

                {activeStage === "consensus_approved" ? (
                  <p className="text-xs font-semibold text-amber-700">Mutabakat onaylandı. Satıcının resmi teklifini bekliyorsunuz.</p>
                ) : null}

                {activeStage === "awaiting_offer_acceptance" && offer ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleBuyerDecision("accept")}
                      className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                    >
                      Teklifi Kabul Et
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyerDecision("reject")}
                      className="flex w-full items-center justify-center rounded-lg border border-primary/20 bg-white py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                    >
                      Teklifi Reddet
                    </button>
                  </div>
                ) : null}

                {activeStage === "offer_accepted" ? (
                  <Link
                    href={standardOrderHref}
                    onClick={() => setFlowStage("converted_to_order")}
                    className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    Sipariş Ver
                  </Link>
                ) : null}

                {activeStage === "offer_rejected" || activeStage === "offer_expired" ? (
                  <p className="text-xs font-semibold text-amber-700">Satıcının yeni teklif versiyonunu bekleyin.</p>
                ) : null}
              </>
            ) : (
              <>
                {activeStage === "chatting" || activeStage === "awaiting_consensus" ? (
                  <p className="text-xs font-semibold text-muted-foreground">Alıcı mutabakatı onaylayana kadar teklif aşaması açılmaz.</p>
                ) : null}

                {activeStage === "consensus_approved" || activeStage === "offer_rejected" || activeStage === "offer_expired" ? (
                  <form onSubmit={handleCreateOffer} className="space-y-3 rounded-xl border border-primary/10 bg-white p-4">
                    <h3 className="text-sm font-bold">{offer ? `Yeni Teklif v${offer.version + 1}` : "Resmi Teklif Oluştur"}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">Bu form yalnızca satıcı tarafından teklif aşamasında kullanılabilir.</p>

                    <div className="space-y-2">
                      <label htmlFor="offer-product-details" className="text-xs font-semibold text-foreground">
                        Ürün detayları
                      </label>
                      <textarea
                        id="offer-product-details"
                        value={offerDraft.productDetails}
                        onChange={(event) => setOfferDraft((prev) => ({ ...prev, productDetails: event.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm outline-none ring-primary/40 transition focus:ring-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="offer-production-duration" className="text-xs font-semibold text-foreground">
                        Üretim/Teslim süresi
                      </label>
                      <input
                        id="offer-production-duration"
                        type="text"
                        value={offerDraft.productionDuration}
                        onChange={(event) => setOfferDraft((prev) => ({ ...prev, productionDuration: event.target.value }))}
                        className="h-10 w-full rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="offer-total-price" className="text-xs font-semibold text-foreground">
                        Toplam fiyat
                      </label>
                      <input
                        id="offer-total-price"
                        type="text"
                        value={offerDraft.totalPrice}
                        onChange={(event) => setOfferDraft((prev) => ({ ...prev, totalPrice: event.target.value }))}
                        className="h-10 w-full rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-lg border border-primary/20 bg-primary/5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                    >
                      {offer ? `Yeni Teklif v${offer.version + 1} Oluştur` : "Resmi Teklif Oluştur"}
                    </button>
                  </form>
                ) : null}

                {activeStage === "awaiting_offer_acceptance" ? (
                  <p className="text-xs font-semibold text-amber-700">Teklif gönderildi. Alıcının onay veya ret kararını bekleyin.</p>
                ) : null}

                {activeStage === "offer_accepted" ? (
                  <p className="text-xs font-semibold text-green-700">Teklif onaylandı. Alıcı standart siparişe geçebilir.</p>
                ) : null}
              </>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}
