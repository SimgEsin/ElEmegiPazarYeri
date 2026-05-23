import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { FeaturedStoryHero } from "@/components/site/featured-story-hero"
import { Button } from "@/components/ui/button"
import { formatHomepageProductPricing, homepageCategorySections } from "@/lib/homepage-data"

export default function Home() {
  return (
    <div className="space-y-16">
      <FeaturedStoryHero />

      <section className="space-y-10 pb-4">
        <div className="space-y-12">
          {homepageCategorySections.map((category) => (
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
