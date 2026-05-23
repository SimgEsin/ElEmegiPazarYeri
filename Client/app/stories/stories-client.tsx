"use client"
/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { ArrowRight, BookOpenText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCatalogSnapshot } from "@/lib/catalog-store"

export default function StoriesClient() {
  const { stories } = useCatalogSnapshot()
  const featuredStory = stories.find((story) => story.isFeatured) ?? stories[0]

  return (
    <div className="space-y-12 pb-10">
      {featuredStory ? (
        <section className="overflow-hidden rounded-2xl border border-primary/15 bg-card">
          <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-10">
            <div className="relative min-h-[280px] overflow-hidden rounded-xl">
              {featuredStory.coverImage ? (
                <img
                  src={featuredStory.coverImage.previewUrl}
                  alt={featuredStory.coverImage.alt ?? featuredStory.coverImage.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex flex-col justify-center gap-5">
              <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                Haftanın Hikayesi
              </span>
              <h1 className="text-3xl leading-tight font-black sm:text-4xl">{featuredStory.title}</h1>
              <p className="text-muted-foreground">{featuredStory.excerpt}</p>

              <Button asChild className="h-11 w-fit px-6 font-bold">
                <Link href={`/stories/${featuredStory.slug}`}>
                  Hikayeyi Oku
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpenText className="size-5 text-primary" />
          <h2 className="text-2xl font-bold">Hikaye Arşivi</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              className="group overflow-hidden rounded-xl border border-primary/10 bg-card transition-shadow hover:shadow-lg"
            >
              <article>
                <div className="relative h-56 overflow-hidden">
                  {story.coverImage ? (
                    <img
                      src={story.coverImage.previewUrl}
                      alt={story.coverImage.alt ?? story.coverImage.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs font-bold tracking-wide text-primary uppercase">{story.category}</p>
                  <h3 className="text-lg leading-snug font-bold group-hover:text-primary">{story.title}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{story.excerpt}</p>
                  <p className="text-xs text-muted-foreground">
                    {story.artisanName} • {story.readTime}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
