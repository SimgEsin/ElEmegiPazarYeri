import type { Metadata } from "next"

import SiparisBaslatClient from "./siparis-baslat-client"

export const metadata: Metadata = {
  title: "Siparişi Başlat | Güneşin Gözyaşı Vazo",
  description: "Müşteri ve zanaatkarın siparişe özel üretim detaylarını anlık mesajlaşma ile netleştirdiği ekran.",
}

type SiparisiBaslatPageProps = {
  searchParams: Promise<{
    role?: string
  }>
}

export default async function SiparisiBaslatPage({ searchParams }: SiparisiBaslatPageProps) {
  const resolvedSearchParams = await searchParams
  const role = resolvedSearchParams.role === "seller" ? "seller" : "buyer"

  return <SiparisBaslatClient role={role} />
}
