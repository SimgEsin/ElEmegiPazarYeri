import type { Metadata } from "next"

import ProfileClient from "./profile-client"

export const metadata: Metadata = {
  title: "Profilim",
  description: "Hesap bilgilerinizi yönetin, siparişlerinizi takip edin ve adreslerinizi düzenleyin.",
}

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Profilim</h1>
        <p className="max-w-2xl text-muted-foreground">
          Hesap bilgilerinizi yönetin, siparişlerinizi takip edin ve kayıtlı adreslerinizi düzenleyin.
        </p>
      </header>

      <ProfileClient />
    </div>
  )
}
