import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { FeaturedStoryHero } from "@/components/site/featured-story-hero"
import { Button } from "@/components/ui/button"
import {
  curatedCategories,
  formatHomepageProductPricing,
  homepageCategorySections,
  type HomepageCategoryProduct,
  type HomepageCategorySection,
} from "@/lib/homepage-data"
import { getCategories } from "@/lib/api/categories"
import { getProducts } from "@/lib/api/products"
import { getMappedStories } from "@/lib/api/stories"
import type { ProductListItem } from "@/lib/api/types"

// Ürün listesi gerçek API'den besleniyor; tasarım/markup birebir aynı kalıyor.
// API alanları mevcut kartın beklediği HomepageCategoryProduct şekline map'leniyor.
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

async function buildSectionsFromApi(): Promise<HomepageCategorySection[] | null> {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ status: "Published" }).catch(() => []),
  ])

  if (products.length === 0) {
    return null
  }

  // Ürünleri kategoriye göre grupla; sıralamayı kategori listesi belirler,
  // listede olmayan kategoriler de sona eklenir (hiçbir ürün düşmesin).
  const groups = new Map<string, ProductListItem[]>()
  for (const product of products) {
    const key = product.categorySlug ?? product.categoryId ?? "diger"
    const bucket = groups.get(key)
    if (bucket) {
      bucket.push(product)
    } else {
      groups.set(key, [product])
    }
  }

  const orderedKeys = [
    ...categories.map((category) => category.slug),
    ...[...groups.keys()].filter((key) => !categories.some((category) => category.slug === key)),
  ]

  const sections: HomepageCategorySection[] = []
  for (const key of orderedKeys) {
    const categoryProducts = groups.get(key)
    if (!categoryProducts || categoryProducts.length === 0) {
      continue
    }

    const category = categories.find((item) => item.slug === key)
    const curated = curatedCategories.find((item) => item.slug === key)
    const first = categoryProducts[0]

    sections.push({
      title: category?.name ?? first.categoryName ?? curated?.title ?? "Ürünler",
      slug: category?.slug ?? first.categorySlug ?? key,
      description: category?.description ?? curated?.description ?? "",
      products: categoryProducts.map(toHomepageProduct),
    })
  }

  return sections.length > 0 ? sections : null
}

export default async function Home() {
  const [apiSections, stories] = await Promise.all([
    buildSectionsFromApi(),
    getMappedStories().catch(() => []),
  ])
  const categorySections = apiSections ?? homepageCategorySections
  const featuredStory = stories.find((story) => story.isFeatured) ?? stories[0] ?? null

  return (
    <div className="space-y-16">
      <FeaturedStoryHero story={featuredStory} />

      <section className="space-y-10 pb-4">
        <div className="space-y-12">
          {categorySections.map((category) => (
            <article key={category.title} className="space-y-5">
              <header className="space-y-1">
                <h3 className="text-2xl font-bold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </header>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {category.products.map((product) => (
                  <Link
                    key={`${category.title}-${product.title}`}
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
                      <h4 className="text-base leading-tight font-bold">{product.title}</h4>
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
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline" className="h-10 px-4 text-xs font-bold uppercase">
            <Link href="/categories">
              Tüm Kategoriler
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
