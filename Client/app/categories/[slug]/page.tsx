import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  curatedCategories,
  formatHomepageProductPricing,
  homepageCategorySections,
  type HomepageCategoryProduct,
} from "@/lib/homepage-data"
import { getCategoryBySlug } from "@/lib/api/categories"
import { getProducts } from "@/lib/api/products"
import type { ProductListItem } from "@/lib/api/types"

type CategoryDetailPageProps = {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: "Kategori Ürünleri | El Emeği Sanat",
  description: "Seçtiğiniz kategorideki el emeği ürünleri inceleyin.",
}

// Veri kaynağı API; tasarım/markup birebir aynı kalıyor. API ürünleri mevcut
// kartın beklediği HomepageCategoryProduct şekline map'leniyor.
export const dynamic = "force-dynamic"

const PRODUCT_FALLBACK_IMAGE = "/images/home/collection-ceramic.png"

function toHomepageProduct(product: ProductListItem): HomepageCategoryProduct {
  const isCustom = product.salesMode === "MadeToOrder"
  return {
    title: product.name,
    description: product.summary ?? "",
    pricing: isCustom ? { type: "custom", label: "Özel Tasarım" } : { type: "fixed", amount: product.price },
    imageSrc: product.primaryImageUrl?.trim() ? product.primaryImageUrl : PRODUCT_FALLBACK_IMAGE,
    imageAlt: product.name,
    orderType: isCustom ? "custom" : "stock",
    href: `/products/${product.slug}`,
  }
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params

  const [category, apiProducts] = await Promise.all([
    getCategoryBySlug(slug).catch(() => null),
    getProducts({ categorySlug: slug, status: "Published" }).catch(() => []),
  ])

  // API'de kategori veya ürün bulunamadıysa mock seçkiye düş; o da yoksa 404.
  const mockSection = homepageCategorySections.find((section) => section.slug === slug)
  const curated = curatedCategories.find((item) => item.slug === slug)

  if (!category && apiProducts.length === 0 && !mockSection) {
    notFound()
  }

  const title = category?.name ?? mockSection?.title ?? curated?.title ?? "Kategori"
  const description = category?.description ?? mockSection?.description ?? curated?.description ?? ""
  const products =
    apiProducts.length > 0 ? apiProducts.map(toHomepageProduct) : mockSection?.products ?? []

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <Link href="/categories" className="inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary/80">
          Kategorilere Dön
        </Link>
        <h1 className="text-4xl font-black tracking-tight">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </header>

      {products.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={`${slug}-${product.title}`}
              href={product.href}
              className="group overflow-hidden rounded-xl border border-primary/10 bg-card shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="space-y-2 p-4">
                <h2 className="text-base leading-tight font-bold">{product.title}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                <p
                  className={
                    product.pricing.type === "custom"
                      ? "text-sm font-semibold text-primary"
                      : "text-sm font-semibold text-foreground"
                  }
                >
                  {formatHomepageProductPricing(product)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <p className="text-muted-foreground">Bu kategoride henüz ürün bulunmuyor.</p>
      )}
    </div>
  )
}
