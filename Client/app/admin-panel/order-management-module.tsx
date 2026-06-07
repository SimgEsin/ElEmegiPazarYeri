"use client"

import { Ban, Clock3, WalletCards } from "lucide-react"
import { useState } from "react"

import type { AdminOrder } from "@/lib/api/admin"
import type { OrderStatus } from "@/lib/api/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type OrderManagementModuleProps = {
  orders: AdminOrder[]
  onCancelOrder: (orderId: string) => void
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: "Yeni Sipariş",
  Confirmed: "Onaylandı",
  Preparing: "Hazırlanıyor",
  Shipped: "Kargoya Verildi",
  Delivered: "Teslim Edildi",
  Cancelled: "İptal Edildi",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function OrderManagementModule({ orders, onCancelOrder }: OrderManagementModuleProps) {
  const [orderSearch, setOrderSearch] = useState("")

  const newOrderCount = orders.filter((order) => order.status === "Pending").length
  const cancellationRequestCount = orders.filter(
    (order) => order.cancellationRequestedAt && order.status !== "Cancelled",
  ).length

  const orderFlow = [
    { label: "Yeni Sipariş", value: newOrderCount, detail: "Henüz işleme alınmamış kayıtlar", icon: WalletCards },
    { label: "İptal Talebi", value: cancellationRequestCount, detail: "Müşteriden gelen, bekleyen talepler", icon: Clock3 },
  ]

  const normalizedOrderSearch = orderSearch.trim().toLocaleLowerCase("tr-TR")
  const visibleOrders = orders.filter((order) =>
    [order.orderNo, order.customerName, order.productName, order.artisanName, STATUS_LABELS[order.status]].some((value) =>
      value.toLocaleLowerCase("tr-TR").includes(normalizedOrderSearch),
    ),
  )

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
            <CardDescription>Platformdaki tüm siparişler; gerektiğinde yönetici iptali uygulanabilir.</CardDescription>
          </div>
          <Input
            value={orderSearch}
            onChange={(event) => setOrderSearch(event.target.value)}
            placeholder="Sipariş no, müşteri, ürün, zanaatkar veya durum ara"
            aria-label="Canlı sipariş takibinde ara"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleOrders.length > 0 ? (
            visibleOrders.map((order) => {
              const isCancelled = order.status === "Cancelled"

              return (
                <div key={order.id} className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{order.orderNo}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerName} • {order.productName}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-primary/15 bg-background/80">
                      {STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <Separator className="my-3 bg-primary/10" />
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">{order.artisanName}</span>
                      <span className="font-medium text-primary">{formatCurrency(order.totalPrice)}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Sipariş tarihi: {formatDate(order.orderDate)}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onCancelOrder(order.id)}
                        disabled={isCancelled}
                      >
                        <Ban className="size-4" />
                        Siparişi İptal Et
                      </Button>
                    </div>
                    {order.cancellationRequestedAt ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-950">
                        <p className="font-semibold">Müşteri iptal talebi gönderdi</p>
                        {order.cancellationReason ? (
                          <p className="mt-1 text-amber-900/80">{order.cancellationReason}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })
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
