/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ProductStory } from "@/app/artisan-panel/panel-types"

export function FeaturedStoryHero({ story }: { story: ProductStory | null }) {
  const featuredStory = story

  if (!featuredStory) {
    return null
  }

  return (
    <section className="@container">
      <article className="group relative min-h-[500px] overflow-hidden rounded-xl">
        {featuredStory.coverImage ? (
          <img
            src={featuredStory.coverImage.previewUrl}
            alt={featuredStory.coverImage.alt ?? featuredStory.coverImage.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#221610]/90 via-[#221610]/55 to-[#221610]/20" />

        <div className="relative flex h-full max-w-2xl flex-col justify-end gap-6 p-8 sm:p-12">
          <span className="inline-flex w-fit rounded bg-primary px-3 py-1 text-xs font-bold tracking-widest text-primary-foreground uppercase">
            Haftanın Hikayesi
          </span>
          <h1 className="text-4xl leading-tight font-black text-white sm:text-5xl">{featuredStory.title}</h1>
          <p className="text-lg leading-relaxed text-slate-200">{featuredStory.excerpt}</p>
          <div className="pt-4">
            <Button asChild className="h-12 gap-2 px-8 text-sm font-bold">
              <Link href={`/stories/${featuredStory.slug}`}>
                Hikayeyi Oku
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </section>
  )
}
