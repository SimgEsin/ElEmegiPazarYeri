"use client"
/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { ArrowLeft, Clock3 } from "lucide-react"

import { StoryRichText } from "@/components/site/story-rich-text"
import { useCatalogSnapshot } from "@/lib/catalog-store"

export default function StoryDetailClient({ slug }: { slug: string }) {
  const { stories } = useCatalogSnapshot()
  const story = stories.find((item) => item.slug === slug)

  if (!story) {
    return (
      <section className="rounded-2xl border border-primary/10 bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Hikaye bulunamadı</h1>
        <p className="mt-2 text-sm text-muted-foreground">Aradığınız hikaye bu oturumdaki katalogda yer almıyor olabilir.</p>
        <Link href="/stories" className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline">
          Hikaye arşivine dön
        </Link>
      </section>
    )
  }

  return (
    <article className="mx-auto w-full max-w-5xl space-y-10 pb-10">
      <section className="space-y-4">
        <Link href="/stories" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" />
          Hikaye arşivine dön
        </Link>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-primary/15">
          {story.coverImage ? (
            <img
              src={story.coverImage.previewUrl}
              alt={story.coverImage.alt ?? story.coverImage.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 space-y-3 p-7 text-white">
            <p className="text-xs font-bold tracking-wide uppercase">{story.category}</p>
            <h1 className="max-w-3xl text-3xl leading-tight font-black sm:text-5xl">{story.title}</h1>
            <p className="flex items-center gap-2 text-sm text-slate-200">
              <Clock3 className="size-4" />
              {story.readTime} • {story.artisanName}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-2xl border border-primary/10 bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">İlişkili Ürün</p>
              <p className="text-base font-bold">{story.productName}</p>
            </div>
            {story.productPageHref ? (
              <Link href={story.productPageHref} className="text-sm font-semibold text-primary hover:underline">
                Ürüne git
              </Link>
            ) : null}
          </div>
        </div>

        <StoryRichText html={story.contentHtml} />
      </section>
    </article>
  )
}
