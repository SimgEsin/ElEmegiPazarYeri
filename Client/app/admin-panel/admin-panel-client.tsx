"use client"

import {
  ChartNoAxesCombined,
  HeartHandshake,
  Package,
  PanelLeft,
  ReceiptText,
  UsersRound,
} from "lucide-react"
import { useState } from "react"

import AnalyticsModule from "./analytics-module"
import ArtisanManagementModule from "./artisan-management-module"
import CustomerExperienceManagementModule from "./customer-experience-management-module"
import OrderManagementModule from "./order-management-module"
import ProductManagementModule from "./product-management-module"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PanelTab = "products" | "orders" | "artisans" | "experience" | "analytics"

type PanelTabConfig = {
  id: PanelTab
  label: string
  summary: string
  icon: typeof Package
}

const panelTabs: PanelTabConfig[] = [
  {
    id: "products",
    label: "Ürün Yönetimi",
    summary: "Koleksiyon kurgusu, stok ve vitrin seçkileri",
    icon: Package,
  },
  {
    id: "orders",
    label: "Sipariş Yönetimi",
    summary: "Hazırlık, teslimat ve kritik sipariş akışları",
    icon: ReceiptText,
  },
  {
    id: "artisans",
    label: "Zanaatkar Yönetimi",
    summary: "Atölye uygunluğu, onboarding ve destek talepleri",
    icon: UsersRound,
  },
  {
    id: "experience",
    label: "Müşteri Deneyimi",
    summary: "Memnuniyet sinyalleri ve concierge temasları",
    icon: HeartHandshake,
  },
  {
    id: "analytics",
    label: "Analizler",
    summary: "Gelir, dönüşüm ve kategori performansı",
    icon: ChartNoAxesCombined,
  },
]

function renderModule(activeTab: PanelTab) {
  switch (activeTab) {
    case "products":
      return <ProductManagementModule />
    case "orders":
      return <OrderManagementModule />
    case "artisans":
      return <ArtisanManagementModule />
    case "experience":
      return <CustomerExperienceManagementModule />
    case "analytics":
      return <AnalyticsModule />
  }
}

export default function AdminPanelClient() {
  const [activeTab, setActiveTab] = useState<PanelTab>("products")

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
          El Emeği Yönetim Masası
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Admin Paneli</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Kürasyon, operasyon ve topluluk sinyallerini tek bakışta takip etmek için tasarlanmış statik yönetim alanı.
          </p>
        </div>
      </header>

      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/[0.08] via-background to-orange-100/40 shadow-sm dark:to-orange-950/20">
        <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-primary/10 bg-background/70 backdrop-blur md:flex md:flex-col">
            <div className="border-b border-primary/10 px-5 py-5">
              <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <PanelLeft className="size-4 text-primary" />
                Yönetim Modülleri
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Günlük operasyonu butik mağaza diliyle izleyin ve önceliklendirin.
              </p>
            </div>

            <nav className="flex flex-1 flex-col gap-2 p-3">
              {panelTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-colors",
                      isActive
                        ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                        : "border-transparent bg-background/70 text-foreground hover:border-primary/10 hover:bg-background"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                        isActive ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted text-primary"
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{tab.label}</span>
                      <span
                        className={cn(
                          "mt-1 block text-xs leading-5",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}
                      >
                        {tab.summary}
                      </span>
                    </span>
                  </button>
                )
              })}
            </nav>
          </aside>

          <CardContent className="p-4 md:p-6">
            <div className="mb-4 flex flex-wrap gap-2 md:hidden">
              {panelTabs.map((tab) => {
                const Icon = tab.icon

                return (
                  <Button
                    key={tab.id}
                    type="button"
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="rounded-full"
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>

            {renderModule(activeTab)}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
