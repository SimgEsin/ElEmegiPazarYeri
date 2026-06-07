import { ChartColumnBig, Package, ShoppingBag, Users } from "lucide-react"

import type { AdminAnalytics } from "@/lib/api/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AnalyticsModuleProps = {
  analytics: AdminAnalytics | null
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value)
}

export default function AnalyticsModule({ analytics }: AnalyticsModuleProps) {
  if (!analytics) {
    return (
      <div className="rounded-2xl border border-dashed border-primary/15 bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
        Analiz verileri yükleniyor veya henüz oluşmadı.
      </div>
    )
  }

  const headlineMetrics = [
    { label: "Toplam ciro", value: formatCurrency(analytics.totalRevenue), icon: ChartColumnBig },
    { label: "Toplam sipariş", value: formatNumber(analytics.totalOrders), icon: ShoppingBag },
    { label: "Yayındaki ürün", value: formatNumber(analytics.totalProducts), icon: Package },
    { label: "Aktif zanaatkar", value: formatNumber(analytics.totalArtisans), icon: Users },
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {headlineMetrics.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.label} className="border-primary/10 bg-background/80">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">{item.label}</p>
                  <p className="mt-3 text-3xl font-black tracking-tight">{item.value}</p>
                </div>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-primary/10 bg-primary/[0.04]">
        <CardHeader>
          <CardTitle>Kategori Payı</CardTitle>
          <CardDescription>Yayındaki ürünlerin kategori ailelerine göre dağılımı.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.categoryMix.length > 0 ? (
            analytics.categoryMix.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-primary">
                    %{item.percentage} • {formatNumber(item.productCount)} ürün
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-background/80">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/15 bg-background/60 p-4 text-sm text-muted-foreground">
              Henüz kategoriye atanmış yayında ürün yok.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
