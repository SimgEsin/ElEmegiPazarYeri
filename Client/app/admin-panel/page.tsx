import type { Metadata } from "next"

import AdminPanelClient from "./admin-panel-client"

export const metadata: Metadata = {
  title: "Admin Paneli | El Emeği",
  description: "Ürün, sipariş, zanaatkar ve deneyim akışlarını yöneten statik yönetim paneli.",
}

export default function AdminPanelPage() {
  return <AdminPanelClient />
}
