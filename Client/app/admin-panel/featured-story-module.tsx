"use client"

import { useState } from "react"

import type { StoryFeedItem } from "@/lib/api/stories"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type FeaturedStoryModuleProps = {
  stories: StoryFeedItem[]
}

export default function FeaturedStoryModule({ stories }: FeaturedStoryModuleProps) {
  const [storySearch, setStorySearch] = useState("")
  const [featuredStoryId, setFeaturedStoryId] = useState<string | null>(null)

  const featuredStory = stories.find((story) => story.id === featuredStoryId) ?? stories[0] ?? null
  const normalizedStorySearch = storySearch.trim().toLocaleLowerCase("tr-TR")
  const visibleStories = stories.filter((story) =>
    [story.title, story.artisanDisplayName ?? "", story.productName, story.categoryName ?? ""].some((value) =>
      value.toLocaleLowerCase("tr-TR").includes(normalizedStorySearch),
    ),
  )

  return (
    <Card className="border-primary/10 bg-primary/[0.04]">
      <CardHeader>
        <CardTitle>Haftanın Hikayesi</CardTitle>
        <CardDescription>Mevcut hikayeler arasından vitrine çıkarılacak hikayeyi seçin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {featuredStory ? (
          <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Aktif Seçim</p>
            <p className="mt-2 text-base font-semibold">{featuredStory.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{featuredStory.productName}</p>
          </div>
        ) : null}

        <Input
          value={storySearch}
          onChange={(event) => setStorySearch(event.target.value)}
          placeholder="Hikaye, zanaatkar, ürün veya kategori ara"
          aria-label="Hikaye listesinde ara"
        />

        {visibleStories.length > 0 ? (
          visibleStories.map((story) => {
            const isFeatured = story.id === featuredStory?.id

            return (
              <button
                key={story.id}
                type="button"
                onClick={() => setFeaturedStoryId(story.id)}
                className="w-full rounded-2xl border border-primary/10 bg-background/80 p-4 text-left transition-colors hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{story.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(story.artisanDisplayName ?? "Zanaatkar")} • {story.productName}
                    </p>
                  </div>
                  <Badge variant={isFeatured ? "default" : "outline"}>{isFeatured ? "Seçili" : "Seç"}</Badge>
                </div>
              </button>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/15 bg-background/60 p-4 text-sm text-muted-foreground">
            Aramaya uygun hikaye bulunamadı.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
