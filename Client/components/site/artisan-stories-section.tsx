"use client"
/* eslint-disable @next/next/no-img-element */

import Link from "next/link"

import { useCatalogSnapshot } from "@/lib/catalog-store"

export function ArtisanStoriesSection({ artisanSlug }: { artisanSlug: string }) {
  const { stories } = useCatalogSnapshot()
  const artisanStories = stories.filter((story) => story.artisanSlug === artisanSlug)

  if (artisanStories.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Hikayeler</h3>
        <p className="text-muted-foreground">Bu atölyeden çıkan ürünlerin ardındaki üretim hikayeleri.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {artisanStories.map((story) => (
          <Link
            key={story.id}
            href={`/stories/${story.slug}`}
            className="group overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-background/40"
          >
            <article>
              <div className="relative h-56 overflow-hidden">
                {story.coverImage ? (
                  <img
                    src={story.coverImage.previewUrl}
                    alt={story.coverImage.alt ?? story.coverImage.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
              </div>

              <div className="space-y-3 p-6">
                <p className="text-xs font-bold tracking-wide text-primary uppercase">{story.productName}</p>
                <h4 className="text-lg font-bold">{story.title}</h4>
                <p className="line-clamp-3 text-sm text-muted-foreground">{story.excerpt}</p>
                <p className="text-sm font-semibold text-primary">Tam hikayeyi oku</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
