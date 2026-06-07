import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Siparişiniz Alındı",
  description: "Siparişiniz başarıyla oluşturuldu.",
}

export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto max-w-xl space-y-6 rounded-2xl border border-primary/10 bg-card p-8 text-center shadow-sm">
      <div className="flex justify-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="size-9" />
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black">Siparişiniz başarıyla alındı</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Siparişiniz oluşturuldu. Sipariş durumunuzu profil sayfanızdaki siparişlerim
          bölümünden takip edebilirsiniz.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/profile">Siparişlerime Git</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/categories">
            <ShoppingBag className="size-4" />
            Alışverişe Devam Et
          </Link>
        </Button>
      </div>
    </section>
  )
}
