"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ShoppingBag } from "lucide-react"
import { addToCart } from "@/lib/api/cart"
import { useAuth } from "@/components/providers/auth-provider"

export function AddToCartButton({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleClick() {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsPending(true)
    setErrorMessage(null)
    try {
      await addToCart(productId, 1)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error("Sepete ekleme başarısız:", error)
      setErrorMessage("Ürün sepete eklenemedi. Lütfen tekrar deneyin.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {isAdded ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
        {isPending ? "Ekleniyor..." : isAdded ? "Sepete Eklendi" : "Sepete Ekle"}
      </button>
      {errorMessage ? (
        <p className="text-center text-xs font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  )
}
