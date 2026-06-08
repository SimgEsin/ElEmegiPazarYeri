"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, MessageCircle, Star, UserCheck, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"
import { followArtisan, isFollowing as fetchIsFollowing, unfollowArtisan } from "@/lib/api/follows"
import { sendMessage } from "@/lib/api/conversations"

type MessageableProduct = {
  id: string
  name: string
}

type ArtisanActionsProps = {
  artisanProfileId: string
  artisanUserId: string
  artisanName: string
  followerCount: number
  productCount: number
  ratingAvg: number
  products: MessageableProduct[]
}

function formatFollowerCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return count.toString()
}

export function ArtisanActions({
  artisanProfileId,
  artisanUserId,
  artisanName,
  followerCount,
  productCount,
  ratingAvg,
  products,
}: ArtisanActionsProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const isOwnProfile = isAuthenticated && user?.id === artisanUserId

  const [following, setFollowing] = useState(false)
  const [followerTotal, setFollowerTotal] = useState(followerCount)
  const [isFollowPending, setIsFollowPending] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "")
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || isOwnProfile) {
      setFollowing(false)
      return
    }

    let active = true
    fetchIsFollowing(artisanProfileId)
      .then((result) => {
        if (active) {
          setFollowing(result)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [artisanProfileId, isAuthenticated, isOwnProfile])

  async function toggleFollow() {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsFollowPending(true)
    const next = !following
    setFollowing(next)
    setFollowerTotal((total) => Math.max(0, total + (next ? 1 : -1)))

    try {
      if (next) {
        await followArtisan(artisanProfileId)
      } else {
        await unfollowArtisan(artisanProfileId)
      }
    } catch (error) {
      setFollowing(!next)
      setFollowerTotal((total) => Math.max(0, total + (next ? -1 : 1)))
      console.error("Takip işlemi başarısız:", error)
    } finally {
      setIsFollowPending(false)
    }
  }

  function openMessageModal() {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setSendError(null)
    setIsSent(false)
    setMessageText("")
    setSelectedProductId(products[0]?.id ?? "")
    setIsModalOpen(true)
  }

  function closeMessageModal() {
    setIsModalOpen(false)
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const content = messageText.trim()
    if (!content || !selectedProductId) {
      return
    }

    setIsSending(true)
    setSendError(null)
    try {
      await sendMessage(selectedProductId, artisanProfileId, content, "Message")
      setIsSent(true)
      setMessageText("")
    } catch (error) {
      console.error("Mesaj gönderilemedi:", error)
      setSendError("Mesaj gönderilemedi. Lütfen tekrar deneyin.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {!isOwnProfile ? (
        <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-4">
          <button
            type="button"
            onClick={toggleFollow}
            disabled={isFollowPending}
            aria-pressed={following}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 ${
              following
                ? "bg-primary/10 text-primary shadow-none"
                : "bg-primary text-white shadow-primary/30"
            }`}
          >
            {following ? (
              <>
                <UserCheck className="size-5" />
                Takip Ediliyor
              </>
            ) : (
              "Takip Et"
            )}
          </button>
          <button
            type="button"
            onClick={openMessageModal}
            className="h-12 rounded-xl bg-primary/10 text-base font-bold text-primary transition-colors hover:bg-primary/20"
          >
            Mesaj Gönder
          </button>
        </div>
      ) : null}

      <div className="mt-8 mb-12 grid w-full grid-cols-3 gap-4">
        <div className="rounded-xl border border-primary/10 bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-white/5">
          <p className="text-2xl font-bold">{formatFollowerCount(followerTotal)}</p>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Takipçi</p>
        </div>
        <div className="rounded-xl border border-primary/10 bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-white/5">
          <p className="text-2xl font-bold">{productCount}</p>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Ürünler</p>
        </div>
        <div className="rounded-xl border border-primary/10 bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-white/5">
          <p className="text-2xl font-bold">{ratingAvg.toFixed(1)}</p>
          <div className="mt-1 flex items-center justify-center gap-1">
            <Star className="size-3.5 fill-primary text-primary" />
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Puan</p>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={closeMessageModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${artisanName} ile mesajlaş`}
            className="w-full max-w-lg rounded-3xl border border-primary/10 bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  <MessageCircle className="size-3.5" />
                  Mesaj
                </div>
                <div>
                  <h3 className="text-xl font-black">{artisanName} ile iletişime geç</h3>
                  <p className="text-sm text-muted-foreground">
                    Hangi ürün hakkında konuşmak istediğinizi seçin ve mesajınızı yazın.
                  </p>
                </div>
              </div>

              <Button type="button" variant="ghost" size="icon-sm" onClick={closeMessageModal} aria-label="Kapat">
                <X className="size-4" />
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-6 text-muted-foreground">
                Bu zanaatkarın mesaj başlatabileceğiniz yayında bir ürünü yok. Mesajlaşma, bir ürün üzerinden başlatılır.
              </div>
            ) : isSent ? (
              <div className="space-y-4 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                <p className="flex items-center gap-2 font-semibold text-primary">
                  <Check className="size-4" />
                  Mesajınız gönderildi.
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Yanıtları ve sohbetin devamını profilinizdeki mesajlar bölümünden takip edebilirsiniz.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={closeMessageModal}>
                    Kapat
                  </Button>
                  <Button asChild>
                    <Link href="/profile">Mesajlara Git</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSend}>
                {products.length > 1 ? (
                  <div className="space-y-2">
                    <label htmlFor="message-product" className="text-sm font-semibold">
                      Ürün
                    </label>
                    <select
                      id="message-product"
                      value={selectedProductId}
                      onChange={(event) => setSelectedProductId(event.target.value)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ürün: <span className="font-semibold text-foreground">{products[0]?.name}</span>
                  </p>
                )}

                <div className="space-y-2">
                  <label htmlFor="message-content" className="text-sm font-semibold">
                    Mesajınız
                  </label>
                  <Textarea
                    id="message-content"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder="Merhaba, bu ürünle ilgili bilgi almak istiyorum..."
                    className="min-h-32"
                    required
                  />
                </div>

                {sendError ? <p className="text-sm font-medium text-destructive">{sendError}</p> : null}

                <Button type="submit" className="w-full" disabled={isSending || !messageText.trim()}>
                  {isSending ? "Gönderiliyor..." : "Mesajı Gönder"}
                </Button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
