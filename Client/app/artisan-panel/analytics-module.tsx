"use client"

import {
  Activity,
  ArrowUpRight,
  BadgeTurkishLira,
  Boxes,
  Eye,
  Sparkles,
  Target,
  Truck,
} from "lucide-react"
import { useMemo } from "react"

import type { ArtisanOrder, ArtisanProduct, OrderStatus } from "./panel-types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AnalyticsModuleProps = {
  products: ArtisanProduct[]
  orders: ArtisanOrder[]
}

const orderStatusLabels: Record<OrderStatus, string> = {
  "Hazırlanıyor": "Hazırlanıyor",
  "Kargoya Verildi": "Kargoya Verildi",
  "Teslim Edildi": "Teslim Edildi",
  "İptal Edildi": "İptal Edildi",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AnalyticsModule({ products, orders }: AnalyticsModuleProps) {
  const dashboard = useMemo(() => {
    const totalViews = products.reduce((sum, product) => sum + product.views, 0)
    const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0)
    const totalSales = products.reduce((sum, product) => sum + product.salesCount, 0)
    const activeOrders = orders.filter(
      (order) => order.status !== "İptal Edildi" && order.status !== "Teslim Edildi"
    ).length
    const deliveredOrders = orders.filter((order) => order.status === "Teslim Edildi").length
    const canceledOrders = orders.filter((order) => order.status === "İptal Edildi").length
    const lowStockProducts = products.filter((product) => product.stock <= 5).length
    const draftProducts = products.filter((product) => product.status === "Taslak").length

    const bestSellingProduct =
      [...products].sort((left, right) => right.salesCount - left.salesCount)[0] ?? null
    const topRevenueProduct =
      [...products].sort((left, right) => right.revenue - left.revenue)[0] ?? null
    const mostViewedProduct =
      [...products].sort((left, right) => right.views - left.views)[0] ?? null

    const categoryPerformance = Object.entries(
      products.reduce<Record<string, { sales: number; revenue: number }>>((accumulator, product) => {
        const current = accumulator[product.category] ?? { sales: 0, revenue: 0 }

        accumulator[product.category] = {
          sales: current.sales + product.salesCount,
          revenue: current.revenue + product.revenue,
        }

        return accumulator
      }, {})
    )
      .map(([category, values]) => ({ category, ...values }))
      .sort((left, right) => right.sales - left.sales)

    const orderStatusSummary = Object.entries(
      orders.reduce<Record<OrderStatus, number>>(
        (accumulator, order) => {
          accumulator[order.status] += 1
          return accumulator
        },
        {
          "Hazırlanıyor": 0,
          "Kargoya Verildi": 0,
          "Teslim Edildi": 0,
          "İptal Edildi": 0,
        }
      )
    ).map(([status, count]) => ({
      status: status as OrderStatus,
      count,
      ratio: orders.length > 0 ? Math.round((count / orders.length) * 100) : 0,
    }))

    return {
      summaryCards: [
        {
          label: "Toplam Kazanç",
          value: formatCurrency(totalRevenue),
          detail: `${totalSales} adet satıştan üretildi`,
          icon: BadgeTurkishLira,
        },
        {
          label: "Aktif Sipariş",
          value: String(activeOrders),
          detail: `${deliveredOrders} sipariş teslim edildi`,
          icon: Truck,
        },
        {
          label: "Toplam Ürün",
          value: String(products.length),
          detail: `${draftProducts} ürün taslak durumda`,
          icon: Boxes,
        },
        {
          label: "Toplam Görüntülenme",
          value: totalViews.toLocaleString("tr-TR"),
          detail: "Ürün vitrininin erişim hacmi",
          icon: Eye,
        },
      ],
      headline: {
        title: "Atölye Özeti",
        description:
          activeOrders > 0
            ? `Şu anda ${activeOrders} aktif siparişiniz var; ürün vitrininiz ${totalViews.toLocaleString("tr-TR")} görüntülenmeye ulaştı.`
            : `Aktif sipariş görünmüyor; vitrininiz ${totalViews.toLocaleString("tr-TR")} görüntülenme ile keşfedilmeye devam ediyor.`,
        badge: topRevenueProduct ? `${topRevenueProduct.name} en yüksek kazançta` : "Henüz ürün verisi yok",
      },
      operations: [
        {
          label: "Düşük Stok Riski",
          value: `${lowStockProducts} ürün`,
          description: "Stok seviyesi 5 ve altındaki ürünler",
        },
        {
          label: "İptal Edilen Sipariş",
          value: `${canceledOrders} sipariş`,
          description: "Terminal duruma geçmiş sipariş sayısı",
        },
        {
          label: "Öne Çıkan Kategori",
          value: categoryPerformance[0]?.category ?? "Veri yok",
          description: categoryPerformance[0]
            ? `${categoryPerformance[0].sales} satış ve ${formatCurrency(categoryPerformance[0].revenue)} kazanç`
            : "Kategori performansı hesaplanamadı",
        },
        {
          label: "Teslim Edilen Sipariş",
          value: `${deliveredOrders} sipariş`,
          description: "Tamamlanan sipariş akışı",
        },
      ],
      productInsights: [
        {
          title: "En Çok Satan Ürün",
          value: bestSellingProduct?.name ?? "Veri yok",
          detail: bestSellingProduct ? `${bestSellingProduct.salesCount} satış` : "Henüz satış verisi yok",
          icon: Target,
        },
        {
          title: "En Çok Kazandıran Ürün",
          value: topRevenueProduct?.name ?? "Veri yok",
          detail: topRevenueProduct ? formatCurrency(topRevenueProduct.revenue) : "Henüz kazanç verisi yok",
          icon: ArrowUpRight,
        },
        {
          title: "En Çok Görülen Ürün",
          value: mostViewedProduct?.name ?? "Veri yok",
          detail: mostViewedProduct ? `${mostViewedProduct.views} görüntülenme` : "Henüz görüntülenme verisi yok",
          icon: Sparkles,
        },
      ],
      topProducts: [...products]
        .sort((left, right) => right.revenue - left.revenue)
        .slice(0, 3)
        .map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          revenue: product.revenue,
          salesCount: product.salesCount,
          views: product.views,
          stock: product.stock,
        })),
      orderStatusSummary,
    }
  }, [orders, products])

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/10 via-background to-background">
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.3fr_minmax(0,1fr)] lg:p-6">
          <div className="space-y-4">
            <Badge variant="outline" className="border-primary/20 bg-background/70 px-3 py-1 text-[11px] tracking-wide">
              {dashboard.headline.badge}
            </Badge>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{dashboard.headline.title}</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{dashboard.headline.description}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {dashboard.summaryCards.map((card) => {
              const Icon = card.icon

              return (
                <div key={card.label} className="rounded-2xl border border-primary/10 bg-background/85 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{card.label}</p>
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <p className="mt-4 text-2xl font-black tracking-tight">{card.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle>Faaliyet Özeti</CardTitle>
            <CardDescription>Atölyenin şu anki operasyon ritmini hızlıca görün.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {dashboard.operations.map((item) => (
              <div key={item.label} className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{item.label}</p>
                <p className="mt-3 text-xl font-black tracking-tight">{item.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle>Sipariş Durum Dağılımı</CardTitle>
            <CardDescription>Mevcut sipariş akışının hangi aşamada yoğunlaştığını gösterir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.orderStatusSummary.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Activity className="size-4" />
                    </span>
                    <span className="font-medium">{orderStatusLabels[item.status]}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {item.count} sipariş • %{item.ratio}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary/80" style={{ width: `${Math.max(item.ratio, item.count > 0 ? 12 : 0)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle>Ürün İçgörüleri</CardTitle>
            <CardDescription>Ürün vitrininizde öne çıkan performans sinyalleri.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.productInsights.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-muted/20 p-4">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{item.title}</p>
                    <p className="mt-1 text-base font-semibold tracking-tight">{item.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle>En Çok Kazandıran Ürünler</CardTitle>
            <CardDescription>Kazanç, satış ve görünürlük açısından vitrinin güçlü parçaları.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.topProducts.map((product, index) => (
              <div key={product.id} className="grid gap-3 rounded-2xl border border-primary/10 bg-background/80 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.category} • {product.salesCount} satış • {product.views} görüntülenme
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold">{formatCurrency(product.revenue)}</p>
                  <p className="text-xs text-muted-foreground">Stok: {product.stock}</p>
                </div>
              </div>
            ))}

            {dashboard.topProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary/20 bg-muted/10 p-5 text-sm text-muted-foreground">
                Analiz gösterebilmek için ürün verisi bulunamadı.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
