import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { getProducts } from "@/lib/api/products"
import { getArtisanProfiles } from "@/lib/api/artisans"
import { formatTry } from "@/lib/format"
import type { ArtisanProfile, ProductListItem } from "@/lib/api/types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Arama | El Emeği Sanat",
  description: "El emeği ürünler ve zanaatkarlar arasında arama yapın.",
}

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

const PLACEHOLDER_IMAGE = "https://placehold.co/600x450?text=El+Emegi"

function matchesArtisan(artisan: ArtisanProfile, query: string): boolean {
  const haystack = [artisan.displayName, artisan.craft, artisan.city, artisan.bio ?? ""]
    .join(" ")
    .toLocaleLowerCase("tr-TR")
  return haystack.includes(query.toLocaleLowerCase("tr-TR"))
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = (q ?? "").trim()

  let products: ProductListItem[] = []
  let artisans: ArtisanProfile[] = []

  if (query) {
    const [productResult, artisanResult] = await Promise.allSettled([
      getProducts({ search: query, status: "Published" }),
      getArtisanProfiles(),
    ])

    if (productResult.status === "fulfilled") {
      products = productResult.value
    }
    if (artisanResult.status === "fulfilled") {
      artisans = artisanResult.value.filter((artisan) => matchesArtisan(artisan, query))
    }
  }

  const totalResults = products.length + artisans.length

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Arama Sonuçları</p>
        <h1 className="text-4xl font-black tracking-tight">
          {query ? `“${query}”` : "Ne aramıştınız?"}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {query
            ? `${totalResults} sonuç bulundu — ${products.length} ürün, ${artisans.length} zanaatkar.`
            : "Üst menüdeki arama kutusuna bir ürün veya zanaatkar adı yazarak arayabilirsiniz."}
        </p>
      </header>

      {query && totalResults === 0 ? (
        <div className="rounded-xl border border-dashed border-primary/20 bg-card/40 p-10 text-center">
          <p className="text-base font-semibold">Sonuç bulunamadı</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Farklı bir anahtar kelime deneyin ya da{" "}
            <Link href="/categories" className="font-semibold text-primary hover:text-primary/80">
              kategorilere göz atın
            </Link>
            .
          </p>
        </div>
      ) : null}

      {products.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Ürünler</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-xl border border-primary/10 bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.primaryImageUrl ?? PLACEHOLDER_IMAGE}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="text-base leading-tight font-bold">{product.name}</h3>
                  {product.summary ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{product.summary}</p>
                  ) : null}
                  <p
                    className={
                      product.salesMode === "MadeToOrder"
                        ? "text-sm font-semibold text-primary"
                        : "text-sm font-semibold text-foreground"
                    }
                  >
                    {product.salesMode === "MadeToOrder"
                      ? `${formatTry(product.price)} • Siparişe özel`
                      : formatTry(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {artisans.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Zanaatkarlar</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {artisans.map((artisan) => (
              <Link
                key={artisan.id}
                href={`/artisans/${artisan.slug}`}
                className="group rounded-xl border border-primary/10 bg-card p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="space-y-1.5">
                  <h3 className="text-base leading-tight font-bold">{artisan.displayName}</h3>
                  <p className="text-sm font-medium text-primary">{artisan.craft}</p>
                  <p className="text-sm text-muted-foreground">{artisan.city}</p>
                  {artisan.bio ? (
                    <p className="line-clamp-2 pt-1 text-sm text-muted-foreground">{artisan.bio}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
