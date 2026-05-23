import Link from "next/link"
import { Heart, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, type Product } from "@/lib/mock-data"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = typeof product.originalPrice === "number" && product.originalPrice > product.price

  return (
    <Card className="overflow-hidden">
      <div className="relative h-36 bg-muted">
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary">{product.categoryName}</Badge>
          {product.isSoldOut ? <Badge variant="outline">Stokta Yok</Badge> : null}
        </div>
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {hasDiscount ? (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice!)}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Usta: {product.artisan.name}</span>
          <span>{product.productionTime}</span>
        </div>
        {product.customizable ? (
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" />
            Kişiselleştirme açık
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild className="flex-1" size="sm" disabled={product.isSoldOut}>
          <Link href={`/products/${product.slug}`}>Detay</Link>
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Favorilere ekle">
          <Heart className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
