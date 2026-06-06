import type { Metadata } from "next"

import { getMappedStories } from "@/lib/api/stories"
import StoryDetailClient from "./story-detail-client"

export const metadata: Metadata = {
  title: "Hikaye Detayı",
  description: "El emeği ürünlerin üretim hikayesi.",
}

export const dynamic = "force-dynamic"

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const stories = await getMappedStories().catch(() => [])
  const story = stories.find((item) => item.slug === slug) ?? null

  return <StoryDetailClient story={story} />
}
