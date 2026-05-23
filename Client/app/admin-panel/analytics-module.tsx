import { ArrowUpRight, ChartColumnBig, ShoppingBag, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const headlineMetrics = [
  { label: "Aylık ciro", value: "₺428.000", detail: "Geçen aya göre +%12", icon: ChartColumnBig },
  { label: "Sipariş dönüşümü", value: "%3,9", detail: "Koleksiyon sayfaları etkili", icon: ShoppingBag },
  { label: "Geri dönen müşteri", value: "%37", detail: "Sadakat ivmesi korunuyor", icon: Users },
]

const monthlyPerformance = [
  { month: "Ocak", value: 62 },
  { month: "Şubat", value: 74 },
  { month: "Mart", value: 81 },
  { month: "Nisan", value: 93 },
]

const categoryMix = [
  { name: "Sofra & Sunum", share: "34%", width: "w-[34%]" },
  { name: "Dekoratif Seramik", share: "27%", width: "w-[27%]" },
  { name: "Tekstil", share: "21%", width: "w-[21%]" },
  { name: "Cam İşleri", share: "18%", width: "w-[18%]" },
]

export default function AnalyticsModule() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        {headlineMetrics.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.label} className="border-primary/10 bg-background/80">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">{item.label}</p>
                  <p className="mt-3 text-3xl font-black tracking-tight">{item.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-primary/10 bg-background/85">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Aylık Performans</CardTitle>
                <CardDescription>Son dört ayın gelir ritmi, sıcak bir vitrin temposuyla artıyor.</CardDescription>
              </div>
              <Badge variant="secondary" className="border border-primary/10 bg-primary/10 text-primary">
                +%18 trend
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyPerformance.map((item) => (
              <div key={item.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-muted-foreground">Endeks {item.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-primary/[0.04]">
          <CardHeader>
            <CardTitle>Kategori Payı</CardTitle>
            <CardDescription>Butik mağaza cirosunun ürün aileleri arasındaki dağılımı.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryMix.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-primary">{item.share}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-background/80">
                  <div className={`h-full rounded-full bg-primary ${item.width}`} />
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
              <p className="text-sm font-semibold">Editöryal okuma</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sofra ve sunum kategorisi, hediyeleşme dönemleri dışında da keşif trafiğini en iyi taşıyan alan olmayı sürdürüyor.
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Detay rapor
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
