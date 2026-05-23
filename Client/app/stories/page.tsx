import type { Metadata } from "next"

import StoriesClient from "./stories-client"

export const metadata: Metadata = {
  title: "Hikayeler",
  description: "El emeği üretimlerin ardındaki zanaat hikayeleri.",
}

export default function StoriesPage() {
  return <StoriesClient />
}
