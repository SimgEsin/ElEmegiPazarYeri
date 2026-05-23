"use client"

import { useSyncExternalStore } from "react"

import type { ArtisanOrder, OrderStatus } from "@/app/artisan-panel/panel-types"
import { accountOrders, type AccountOrder } from "@/lib/mock-data"
import type { CancellationRequest } from "@/lib/order-types"

type OrdersSnapshot = {
  customerOrders: AccountOrder[]
  artisanOrders: ArtisanOrder[]
}

const initialArtisanOrders: ArtisanOrder[] = [
  {
    id: "SIP-1042",
    referenceId: "ORD-24122",
    customerName: "Elif Kaya",
    productName: "Lale İşlemeli İpek Şal",
    quantity: 1,
    totalAmount: 2100,
    status: "Kargoya Verildi",
    createdAt: "4 Mart 2026",
  },
  {
    id: "SIP-1038",
    referenceId: "ORD-24188",
    customerName: "Elif Kaya",
    productName: "Gümüş Telkari Yüzük",
    quantity: 1,
    totalAmount: 1420,
    status: "Hazırlanıyor",
    createdAt: "10 Mart 2026",
  },
  {
    id: "SIP-1029",
    referenceId: "ORD-99901",
    customerName: "Deniz Tunç",
    productName: "Oyma Servis Tahtası",
    quantity: 1,
    totalAmount: 980,
    status: "Teslim Edildi",
    createdAt: "20 Nisan 2026",
  },
]

let ordersSnapshot: OrdersSnapshot = {
  customerOrders: accountOrders,
  artisanOrders: initialArtisanOrders,
}

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function createPendingRequest(reason: string): CancellationRequest {
  return {
    reason,
    requestedAt: new Date().toISOString(),
    status: "Beklemede",
  }
}

function markRequestAsProcessed(request?: CancellationRequest): CancellationRequest | undefined {
  if (!request || request.status === "İşlendi") {
    return request
  }

  return { ...request, status: "İşlendi" }
}

export function subscribeToOrders(callback: () => void) {
  listeners.add(callback)

  return () => {
    listeners.delete(callback)
  }
}

function getOrdersSnapshot() {
  return ordersSnapshot
}

function getServerOrdersSnapshot(): OrdersSnapshot {
  return {
    customerOrders: accountOrders,
    artisanOrders: initialArtisanOrders,
  }
}

export function useCustomerOrdersSnapshot() {
  return useSyncExternalStore(
    subscribeToOrders,
    () => getOrdersSnapshot().customerOrders,
    () => getServerOrdersSnapshot().customerOrders
  )
}

export function useArtisanOrdersSnapshot() {
  return useSyncExternalStore(
    subscribeToOrders,
    () => getOrdersSnapshot().artisanOrders,
    () => getServerOrdersSnapshot().artisanOrders
  )
}

export function requestOrderCancellation(referenceId: string, reason: string) {
  const trimmedReason = reason.trim()

  if (!trimmedReason) {
    return
  }

  const nextRequest = createPendingRequest(trimmedReason)

  ordersSnapshot = {
    customerOrders: ordersSnapshot.customerOrders.map((order) =>
      order.referenceId === referenceId && !order.cancellationRequest
        ? { ...order, cancellationRequest: nextRequest }
        : order
    ),
    artisanOrders: ordersSnapshot.artisanOrders.map((order) =>
      order.referenceId === referenceId && !order.cancellationRequest
        ? { ...order, cancellationRequest: nextRequest }
        : order
    ),
  }

  emitChange()
}

export function updateArtisanOrderStatus(orderId: string, status: OrderStatus) {
  const currentOrder = ordersSnapshot.artisanOrders.find((order) => order.id === orderId)

  if (!currentOrder || currentOrder.status === "İptal Edildi") {
    return
  }

  const nextCancellationRequest =
    status === "İptal Edildi" ? markRequestAsProcessed(currentOrder.cancellationRequest) : currentOrder.cancellationRequest

  ordersSnapshot = {
    customerOrders: ordersSnapshot.customerOrders.map((order) =>
      order.referenceId === currentOrder.referenceId ? { ...order, cancellationRequest: nextCancellationRequest } : order
    ),
    artisanOrders: ordersSnapshot.artisanOrders.map((order) =>
      order.id === orderId ? { ...order, status, cancellationRequest: nextCancellationRequest } : order
    ),
  }

  emitChange()
}
