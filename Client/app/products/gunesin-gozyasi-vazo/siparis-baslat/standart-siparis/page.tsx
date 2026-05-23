import { Suspense } from "react"

import StandartSiparisClient from "./standart-siparis-client"

function StandartSiparisFallback() {
  return (
    <section className="space-y-3 rounded-2xl border border-primary/10 bg-card p-8 shadow-sm">
      <h1 className="text-3xl font-black">Sipariş Süreci</h1>
      <p className="text-sm text-muted-foreground">Teklif bilgileri hazırlanıyor...</p>
    </section>
  )
}

export default function StandartSiparisPage() {
  return (
    <Suspense fallback={<StandartSiparisFallback />}>
      <StandartSiparisClient />
    </Suspense>
  )
}
