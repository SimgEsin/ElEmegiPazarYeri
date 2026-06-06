import type { Metadata } from "next"

import { getMappedStories } from "@/lib/api/stories"
import StoriesClient from "./stories-client"

export const metadata: Metadata = {
  title: "Hikayeler",
  description: "El emeği üretimlerin ardındaki zanaat hikayeleri.",
}

export const dynamic = "force-dynamic"

export default async function StoriesPage() {
  const stories = await getMappedStories().catch(() => [])
  return <StoriesClient stories={stories} />
}
