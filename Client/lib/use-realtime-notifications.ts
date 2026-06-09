"use client"

import { useEffect, useRef } from "react"
import * as signalR from "@microsoft/signalr"

// axios.ts ile ayni anahtar (giris yapildiginda token bu anahtarla saklaniyor).
const AUTH_TOKEN_STORAGE_KEY = "authToken"

// Hub adresi: API tabani .../api iken, hub .../hubs/chat altindadir.
function resolveHubUrl(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7204/api"
  return apiBase.replace(/\/api\/?$/, "") + "/hubs/chat"
}

// Sunucudan gelen "ReceiveNotification" olaylarini dinler.
// Backend; yeni mesaj, teklif vb. olaylarda ilgili kullaniciya bu olayi push eder.
// Her olay geldiginde verilen onNotification geri cagrisi calistirilir.
export function useRealtimeNotifications(
  onNotification: (message: string, payload: unknown) => void,
): void {
  // Geri cagriyi ref'te tutariz; boylece baglantiyi her render'da yeniden kurmadan
  // her zaman en guncel closure (product, conversationId vb.) kullanilir.
  const callbackRef = useRef(onNotification)
  callbackRef.current = onNotification

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null

    if (!token) {
      return
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(resolveHubUrl(), { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connection.on("ReceiveNotification", (message: string, payload: unknown) => {
      callbackRef.current(message, payload)
    })

    // start()'in donus promise'ini saklariz; temizlikte ONCE start bitene kadar bekleyip
    // sonra stop() cagiririz. Boylece React Strict Mode'un (dev) ikili mount'unda olusan
    // "connection was stopped during negotiation" hatasi engellenir.
    const startPromise = connection.start().catch(() => undefined)

    return () => {
      void startPromise.finally(() => {
        connection.stop().catch(() => undefined)
      })
    }
  }, [])
}
