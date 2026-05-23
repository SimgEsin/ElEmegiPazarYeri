"use client"

import { useState } from "react"

import type { ArtisanOrder, OrderStatus } from "./panel-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type OrderManagementModuleProps = {
  orders: ArtisanOrder[]
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void
}

const STATUS_OPTIONS: OrderStatus[] = ["Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi", "İptal Edildi"]

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getStatusVariant(status: OrderStatus): "default" | "secondary" | "outline" {
  if (status === "Teslim Edildi") {
    return "default"
  }

  if (status === "İptal Edildi") {
    return "outline"
  }

  return "secondary"
}

export default function OrderManagementModule({ orders, onUpdateOrderStatus }: OrderManagementModuleProps) {
  const [draftStatuses, setDraftStatuses] = useState<Record<string, OrderStatus>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const pendingCancellationCount = orders.filter((order) => order.cancellationRequest?.status === "Beklemede").length

  function handleStatusChange(orderId: string, status: OrderStatus) {
    setDraftStatuses((current) => ({ ...current, [orderId]: status }))
    setSuccessMessage("")
  }

  function handleStatusUpdate(orderId: string, currentStatus: OrderStatus) {
    const nextStatus = draftStatuses[orderId] ?? currentStatus

    onUpdateOrderStatus(orderId, nextStatus)
    setSuccessMessage("Sipariş durumu güncellendi.")
  }

  function handleCancel(orderId: string) {
    onUpdateOrderStatus(orderId, "İptal Edildi")
    setDraftStatuses((current) => ({ ...current, [orderId]: "İptal Edildi" }))
    setSuccessMessage("Sipariş iptal edildi.")
  }

  return (
    <div className="space-y-5">
      <Card className="border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle>Sipariş Yönetimi</CardTitle>
          <CardDescription>Siparişlerinizi izleyin, durumlarını güncelleyin veya gerekirse iptal edin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage ? <p className="text-sm font-medium text-primary">{successMessage}</p> : null}

          <div className="rounded-2xl border border-primary/10 bg-primary/[0.05] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Bekleyen İptal Talepleri</p>
                <p className="mt-2 text-2xl font-black tracking-tight">{pendingCancellationCount}</p>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Müşteriden gelen iptal talepleri sipariş kartları içinde neden ve zaman bilgisiyle gösterilir.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {orders.map((order) => {
              const isCanceled = order.status === "İptal Edildi"

              return (
                <div key={order.id} className="rounded-2xl border border-primary/10 bg-background/80 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{order.productName}</h3>
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>

                    <div className="text-right text-sm">
                      <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-[120px_160px_minmax(0,1fr)]">
                    <div className="rounded-xl border border-primary/10 bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">Adet</p>
                      <p className="mt-1 text-sm font-semibold">{order.quantity}</p>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">Sipariş No</p>
                      <p className="mt-1 text-sm font-semibold">{order.id}</p>
                    </div>
                    <div className="flex flex-col gap-3 rounded-xl border border-primary/10 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <select
                        value={draftStatuses[order.id] ?? order.status}
                        onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                        className={cn(selectClassName, "w-full sm:max-w-56")}
                        aria-label={`Sipariş durumu ${order.id}`}
                        disabled={isCanceled}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleStatusUpdate(order.id, order.status)}
                          disabled={isCanceled || draftStatuses[order.id] === order.status}
                        >
                          Durumu Güncelle
                        </Button>
                        <Button type="button" variant="destructive" onClick={() => handleCancel(order.id)} disabled={isCanceled}>
                          Siparişi İptal Et
                        </Button>
                      </div>
                    </div>
                  </div>

                  {order.cancellationRequest ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-950">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">Müşteri iptal talebi gönderdi</p>
                        <Badge variant="outline" className="border-amber-300 bg-white/80 text-amber-900">
                          {order.cancellationRequest.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-amber-900/80">{order.cancellationRequest.reason}</p>
                      <p className="mt-2 text-xs text-amber-900/70">
                        Talep zamanı: {formatDateTime(order.cancellationRequest.requestedAt)}
                      </p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
