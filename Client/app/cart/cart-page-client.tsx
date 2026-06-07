"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { EmptyState } from "@/components/site/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getMyCart, removeCartItem, updateCartItemQuantity } from "@/lib/api/cart"
import {
  CART_CHECKOUT_ITEMS_STORAGE_KEY,
  CART_SHIPPING_FEE,
  type CartLineItem,
} from "@/lib/cart-view"
import { formatPrice } from "@/lib/mock-data"

export function CartPageClient() {
  const [items, setItems] = useState<CartLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getMyCart()
      .then((cart) => setItems(cart.items))
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false))
  }, [])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  )

  const total = subtotal + CART_SHIPPING_FEE

  async function increaseQuantity(itemId: string) {
    const item = items.find((i) => i.id === itemId)
    if (!item) return
    const newQuantity = item.quantity + 1
    try {
      await updateCartItemQuantity(itemId, newQuantity)
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: newQuantity, totalPrice: i.unitPrice * newQuantity } : i
        )
      )
    } catch {
      console.error("Adet güncellenemedi.")
    }
  }

  async function decreaseQuantity(itemId: string) {
    const item = items.find((i) => i.id === itemId)
    if (!item || item.quantity <= 1) return
    const newQuantity = item.quantity - 1
    try {
      await updateCartItemQuantity(itemId, newQuantity)
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: newQuantity, totalPrice: i.unitPrice * newQuantity } : i
        )
      )
    } catch {
      console.error("Adet güncellenemedi.")
    }
  }

  async function removeItem(itemId: string) {
    try {
      await removeCartItem(itemId)
      setItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch {
      console.error("Ürün sepetten kaldırılamadı.")
    }
  }

  function proceedToCheckout() {
    try {
      window.localStorage.setItem(CART_CHECKOUT_ITEMS_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error("Sepet verisi checkout için kaydedilemedi:", error)
    }

    router.push("/cart/checkout")
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">Sepetim</h1>
        </header>
        <p className="text-muted-foreground">Sepet yükleniyor...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">Sepetim</h1>
          <p className="max-w-2xl text-muted-foreground">
            Sepetinizde ürün bulunmuyor. El emeği parçaları keşfederek sepetinizi doldurabilirsiniz.
          </p>
        </header>

        <EmptyState
          title="Sepetiniz şu an boş"
          description="Kategorilerden ürünleri keşfedip tekrar sepetinize ekleyebilirsiniz."
          icon={ShoppingCart}
        />

        <Button asChild variant="outline">
          <Link href="/categories">Alışverişe Dön</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Sepetim</h1>
        <p className="max-w-2xl text-muted-foreground">
          Ürün adetlerini güncelleyin, notlarınızı kontrol edin ve sipariş özetinizi onaylayın.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <section className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border-primary/10">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-xl">{item.productName}</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-lg border p-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`${item.productName} adet azalt`}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`${item.productName} adet artır`}
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  <p className="text-base font-bold">{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
              </CardContent>

              <CardFooter className="justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="size-4" />
                  Kaldır
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Kargo</span>
                <span>{formatPrice(CART_SHIPPING_FEE)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-3 text-base font-bold">
                <span>Toplam</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" className="w-full" onClick={proceedToCheckout}>
                Ödemeye Geç
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  )
}
