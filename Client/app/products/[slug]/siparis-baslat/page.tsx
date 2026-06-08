import type { Metadata } from "next"

import MutabakatClient from "./mutabakat-client"

export const metadata: Metadata = {
  title: "Siparişi Başlat | Mutabakat",
}

type SiparisBaslatPageProps = {
  params: Promise<{ slug: string }>
}

export default async function SiparisBaslatPage({ params }: SiparisBaslatPageProps) {
  const { slug } = await params

  return <MutabakatClient slug={slug} />
}
