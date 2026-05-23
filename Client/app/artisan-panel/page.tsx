import type { Metadata } from "next"

import ArtisanPanelClient from "./artisan-panel-client"

export const metadata: Metadata = {
  title: "Zanaatkar Paneli | El Emeği",
  description: "Zanaatkar profil ve satış yönetimi paneli.",
}

export default function ArtisanPanelPage() {
  return <ArtisanPanelClient />
}
