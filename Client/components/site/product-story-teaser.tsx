"use client"

import Link from "next/link"

import { useCatalogSnapshot } from "@/lib/catalog-store"

export function ProductStoryTeaser({
  productSlug,
  fallbackText,
}: {
  productSlug: string
  fallbackText: string
}) {
  const { stories } = useCatalogSnapshot()
  const story = stories.find((item) => item.productSlug === productSlug)

  if (!story) {
    return <p className="text-lg leading-relaxed text-muted-foreground">{fallbackText}</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">{story.title}</p>
      <p className="text-lg leading-relaxed text-muted-foreground">{story.excerpt}</p>
      <Link href={`/stories/${story.slug}`} className="inline-flex text-sm font-semibold text-primary hover:underline">
        Devamını oku...
      </Link>
    </div>
  )
}
