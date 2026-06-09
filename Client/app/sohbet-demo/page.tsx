"use client"

import { useEffect, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"

// axios.ts ile ayni anahtar (giris yapildiginda token bu anahtarla saklaniyor).
const AUTH_TOKEN_STORAGE_KEY = "authToken"

type ChatMessage = { user: string; message: string; at: string }

// Hub adresi: API tabani .../api iken, hub .../hubs/chat altindadir.
function resolveHubUrl(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7204/api"
  return apiBase.replace(/\/api\/?$/, "") + "/hubs/chat"
}

export default function SohbetDemoPage() {
  const [status, setStatus] = useState("Başlatılıyor...")
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null

    if (!token) {
      setStatus("Önce giriş yapmalısın — token bulunamadı. /login sayfasından giriş yap, sonra bu sayfayı yenile.")
      return
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(resolveHubUrl(), { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connection.on("ReceiveMessage", (user: string, message: string) => {
      setMessages((prev) => [...prev, { user, message, at: new Date().toLocaleTimeString() }])
    })

    connection.onreconnecting(() => setStatus("Yeniden bağlanıyor..."))
    connection.onreconnected(() => setStatus("Bağlı (yeniden) ✓"))
    connection.onclose(() => {
      setConnected(false)
      setStatus("Bağlantı kapandı")
    })

    const startPromise = connection
      .start()
      .then(() => {
        setConnected(true)
        setStatus("Bağlı ✓ (gerçek zamanlı)")
      })
      .catch((err) => setStatus("Bağlantı hatası: " + err.message))

    connectionRef.current = connection

    return () => {
      void startPromise.finally(() => {
        connection.stop().catch(() => undefined)
      })
    }
  }, [])

  async function handleSend() {
    const text = draft.trim()
    if (!text || !connectionRef.current) return
    try {
      await connectionRef.current.invoke("SendMessage", text)
      setDraft("")
    } catch (err) {
      setStatus("Gönderim hatası: " + (err as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-2xl font-bold">Canlı Sohbet — SignalR Demo</h1>
      <p className="mb-4 text-sm text-gray-500">
        Gerçek zamanlı iletişim testi. Bu sayfayı <strong>iki sekmede</strong> aç; bir sekmeden mesaj yazınca
        diğerinde <strong>anında</strong> görünür (sayfa yenilenmeden).
      </p>

      <div className="mb-3 text-sm">
        Durum:{" "}
        <span className={connected ? "font-medium text-green-600" : "font-medium text-orange-500"}>
          {status}
        </span>
      </div>

      <div className="mb-3 h-80 space-y-2 overflow-y-auto rounded-lg border bg-gray-50 p-3">
        {messages.length === 0 && <div className="text-sm text-gray-400">Henüz mesaj yok.</div>}
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            <span className="font-semibold">{m.user}</span>
            <span className="ml-2 text-xs text-gray-400">{m.at}</span>
            <div>{m.message}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Mesaj yaz ve Enter'a bas..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSend()
          }}
          disabled={!connected}
        />
        <button
          className="rounded-lg bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
          onClick={() => void handleSend()}
          disabled={!connected}
        >
          Gönder
        </button>
      </div>
    </div>
  )
}
