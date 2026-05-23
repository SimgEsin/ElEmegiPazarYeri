"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

import { EmptyState } from "@/components/site/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CART_CHECKOUT_ITEMS_STORAGE_KEY,
  CART_SHIPPING_FEE,
  type CartLineItem,
} from "@/lib/cart-view"
import { formatPrice } from "@/lib/mock-data"

type CartPageClientProps = {
  initialItems: CartLineItem[]
}

export function CartPageClient({ initialItems }: CartPageClientProps) {
  const [items, setItems] = useState(initialItems)
  const router = useRouter()

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  )

  const total = subtotal + CART_SHIPPING_FEE

  function increaseQuantity(productId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  function decreaseQuantity(productId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    )
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  function proceedToCheckout() {
    try {
      window.localStorage.setItem(CART_CHECKOUT_ITEMS_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error("Sepet verisi checkout için kaydedilemedi:", error)
    }

    router.push("/cart/checkout")
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
          {items.map((item) => {
            const lineTotal = item.product.price * item.quantity

            return (
              <Card key={item.product.id} className="border-primary/10">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{item.product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.product.shortDescription}</p>
                    </div>
                    <Badge variant="secondary">{item.product.categoryName}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">Zanaatkar: {item.product.artisan.name}</p>
                  <p className="text-muted-foreground">Notunuz: {item.buyerNote}</p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-lg border p-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`${item.product.name} adet azalt`}
                        onClick={() => decreaseQuantity(item.product.id)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`${item.product.name} adet artır`}
                        onClick={() => increaseQuantity(item.product.id)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    <p className="text-base font-bold">{formatPrice(lineTotal)}</p>
                  </div>
                </CardContent>

                <CardFooter className="justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="size-4" />
                    Kaldır
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
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
