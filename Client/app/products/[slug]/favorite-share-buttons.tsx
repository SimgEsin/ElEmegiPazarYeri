"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Heart, Share2 } from "lucide-react"
import { addFavorite, getFavorites, removeFavorite } from "@/lib/api/favorites"
import { useAuth } from "@/components/providers/auth-provider"

type Props = {
  productId: string
  productName: string
}

export function FavoriteShareButtons({ productId, productName }: Props) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setIsFavorited(false)
      setFavoriteId(null)
      return
    }

    getFavorites()
      .then((favorites) => {
        const match = favorites.find((f) => f.productId === productId)
        if (match) {
          setIsFavorited(true)
          setFavoriteId(match.id)
        }
      })
      .catch(() => {})
  }, [isAuthenticated, productId])

  async function toggleFavorite() {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsPending(true)
    try {
      if (isFavorited && favoriteId) {
        await removeFavorite(favoriteId)
        setIsFavorited(false)
        setFavoriteId(null)
      } else {
        const id = await addFavorite(productId)
        setIsFavorited(true)
        setFavoriteId(id)
      }
    } catch (error) {
      console.error("Favori işlemi başarısız:", error)
    } finally {
      setIsPending(false)
    }
  }

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: productName, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={isPending}
        aria-label={isFavorited ? "Favorilerden çıkar" : "Favorilere ekle"}
        aria-pressed={isFavorited}
        onClick={toggleFavorite}
        className={`flex size-10 items-center justify-center rounded-full transition-colors disabled:opacity-60 ${
          isFavorited
            ? "bg-primary text-white"
            : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
        }`}
      >
        <Heart className={`size-5 ${isFavorited ? "fill-current" : ""}`} />
      </button>
      <button
        type="button"
        aria-label={shareCopied ? "Bağlantı kopyalandı" : "Paylaş"}
        onClick={handleShare}
        className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
      >
        {shareCopied ? <Check className="size-5" /> : <Share2 className="size-5" />}
      </button>
    </div>
  )
}
