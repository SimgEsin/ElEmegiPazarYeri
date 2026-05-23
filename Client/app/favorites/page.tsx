import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { HeartOff, ShoppingCart } from "lucide-react"

import { EmptyState } from "@/components/site/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { favoriteProductSlugs, formatPrice, getProductBySlug, type Product } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Favoriler",
  description: "Beğendiğiniz el emeği ürünleri bir arada görün ve karşılaştırın.",
}

const favoriteProducts = favoriteProductSlugs
  .map((slug) => getProductBySlug(slug))
  .filter((product): product is Product => Boolean(product))

const categoryImageMap: Record<string, string> = {
  dokuma: "https://placehold.co/400x260/d4a373/fff?text=Dokuma",
  seramik: "https://placehold.co/400x260/a8b5a0/fff?text=Seramik",
  "ahsap-oyma": "https://placehold.co/400x260/b08968/fff?text=Ahsap+Oyma",
  takilar: "https://placehold.co/400x260/9b8ea0/fff?text=Takilar",
}

export default function FavoritesPage() {

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Favorilerim</h1>
        <p className="max-w-2xl text-muted-foreground">İlham aldığınız parçaları kaydedin, hikayelerini karşılaştırın ve siparişe hazırlandığınızda hızla geri dönün.</p>
      </header>

      {favoriteProducts.length === 0 ? (
        <EmptyState
          title="Henüz favoriniz yok"
          description="Beğendiğiniz ürünleri kalp ikonuyla favorilere ekleyebilir, sonra burada toplu şekilde inceleyebilirsiniz."
          icon={HeartOff}
        />
      ) : (
        <>
          <section className="grid gap-4 rounded-xl border border-primary/10 bg-card p-5">
            <div>
              <p className="text-sm text-muted-foreground">Kayıtlı ürün</p>
              <p className="text-2xl font-black">{favoriteProducts.length} parça</p>
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteProducts.map((product) => {
              const hasDiscount = typeof product.originalPrice === "number" && product.originalPrice > product.price

              return (
                <Card key={product.id} className="overflow-hidden border-primary/10">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={categoryImageMap[product.categorySlug] ?? "https://placehold.co/400x260/e0e0e0/fff?text=Ürün"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{product.categoryName}</Badge>
                      {product.isSoldOut ? <Badge variant="outline">Stokta Yok</Badge> : null}
                    </div>
                    <CardTitle className="text-xl leading-snug">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                      {hasDiscount ? <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice!)}</span> : null}
                    </div>
                    <p className="text-muted-foreground">Zanaatkar: {product.artisan.name}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" disabled={product.isSoldOut}>
                      <ShoppingCart className="mr-2 size-4" />
                      Sepete Ekle
                    </Button>
                    <Button asChild className="flex-1" disabled={product.isSoldOut}>
                      <Link href={`/products/${product.slug}/siparis-baslat`}>Sipariş Başlat</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </section>
        </>
      )}
    </div>
  )
}
