import type { Metadata } from "next"

import StoryDetailClient from "./story-detail-client"

export const metadata: Metadata = {
  title: "Hikaye Detayı",
  description: "El emeği ürünlerin üretim hikayesi.",
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <StoryDetailClient slug={slug} />
}
