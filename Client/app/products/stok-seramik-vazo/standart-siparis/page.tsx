import { Suspense } from "react"

import StokStandartSiparisClient from "./stok-standart-siparis-client"

function StokStandartSiparisFallback() {
  return (
    <section className="space-y-3 rounded-2xl border border-primary/10 bg-card p-8 shadow-sm">
      <h1 className="text-3xl font-black">Sipariş Süreci</h1>
      <p className="text-sm text-muted-foreground">Checkout adımları hazırlanıyor...</p>
    </section>
  )
}

export default function StokStandartSiparisPage() {
  return (
    <Suspense fallback={<StokStandartSiparisFallback />}>
      <StokStandartSiparisClient />
    </Suspense>
  )
}
