import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { curatedCategories } from "@/lib/homepage-data"

export const metadata: Metadata = {
  title: "Kategoriler | El Emeği Sanat",
  description: "El emeği ürünlerin tematik kategorilerini keşfedin.",
}

export default function CategoriesPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Kategoriler</h1>
        <p className="max-w-2xl text-muted-foreground">Zanaatın farklı alanlarını keşfetmek için kategori seçkilerimize göz atın.</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {curatedCategories.map((category) => (
          <article key={category.slug} className="group overflow-hidden rounded-xl border border-primary/10 bg-card shadow-sm transition-shadow hover:shadow-xl">
            <Link href={`/categories/${category.slug}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="space-y-2 p-5">
                <h2 className="text-xl font-bold">{category.title}</h2>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
