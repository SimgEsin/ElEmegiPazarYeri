import { Ban, Clock3, Eye, WalletCards } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const orderFlow = [
  { label: "Yeni Sipariş", value: "18", detail: "Son 24 saatte açılan kayıtlar", icon: WalletCards },
  { label: "İptal Talebi", value: "6", detail: "Admin onayı veya kontrolü bekliyor", icon: Clock3 },
]

const activeOrders = [
  {
    code: "#EE-4821",
    customer: "Zehra K.",
    product: "İndigo Servis Kasesi",
    artisan: "Toprak İzleri",
    total: "₺2.450",
    eta: "24 Nisan, 16:00",
    status: "İptal talebi",
  },
  {
    code: "#EE-4816",
    customer: "Lara D.",
    product: "Gün Batımı Cam Koleksiyonu",
    artisan: "Amber Cam Evi",
    total: "₺3.120",
    eta: "25 Nisan, 11:00",
    status: "Teslimat itirazı",
  },
  {
    code: "#EE-4804",
    customer: "Burak T.",
    product: "El Dokuması Masa Örtüsü",
    artisan: "Narin Atölye",
    total: "₺1.890",
    eta: "26 Nisan, 18:00",
    status: "İnceleme notu",
  },
]

export default function OrderManagementModule() {
  const [orderSearch, setOrderSearch] = useState("")
  const normalizedOrderSearch = orderSearch.trim().toLocaleLowerCase("tr-TR")
  const visibleOrders = activeOrders
    .filter((order) =>
      [order.code, order.customer, order.product, order.artisan, order.status].some((value) =>
        value.toLocaleLowerCase("tr-TR").includes(normalizedOrderSearch)
      )
    )
    .slice(0, 3)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-2">
        {orderFlow.map((item) => {
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

      <Card className="border-primary/10 bg-background/85">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>Canlı Sipariş Takibi</CardTitle>
            <CardDescription>Admin denetimine düşen sipariş kayıtları, iptal ve inceleme aksiyonlarıyla birlikte gösterilir.</CardDescription>
          </div>
          <Input
            value={orderSearch}
            onChange={(event) => setOrderSearch(event.target.value)}
            placeholder="Sipariş kodu, müşteri, ürün, zanaatkar veya durum ara"
            aria-label="Canlı sipariş takibinde ara"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleOrders.length > 0 ? (
            visibleOrders.map((order) => (
              <div key={order.code} className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{order.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer} • {order.product}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-primary/15 bg-background/80">
                    {order.status}
                  </Badge>
                </div>
                <Separator className="my-3 bg-primary/10" />
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{order.artisan}</span>
                    <span className="font-medium text-primary">{order.total}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Tahmini teslim: {order.eta}</span>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm">
                        <Eye className="size-4" />
                        Siparişi Görüntüle
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <Ban className="size-4" />
                        Siparişi İptal Et
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/15 bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
              Eşleşen sipariş bulunamadı.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
