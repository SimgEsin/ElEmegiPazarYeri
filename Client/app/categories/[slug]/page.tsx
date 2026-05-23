import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { formatHomepageProductPricing, homepageCategorySections } from "@/lib/homepage-data"

type CategoryDetailPageProps = {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: "Kategori Ürünleri | El Emeği Sanat",
  description: "Seçtiğiniz kategorideki el emeği ürünleri inceleyin.",
}

export function generateStaticParams() {
  return homepageCategorySections.map((section) => ({
    slug: section.slug,
  }))
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params
  const section = homepageCategorySections.find((categorySection) => categorySection.slug === slug)

  if (!section) {
    notFound()
  }

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <Link href="/categories" className="inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary/80">
          Kategorilere Dön
        </Link>
        <h1 className="text-4xl font-black tracking-tight">{section.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{section.description}</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {section.products.map((product) => (
          <Link
            key={`${section.slug}-${product.title}`}
            href={product.href}
            className="group overflow-hidden rounded-xl border border-primary/10 bg-card shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                fill
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
    </div>
  )
}
