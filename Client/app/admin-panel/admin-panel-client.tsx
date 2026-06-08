"use client"

import {
  ChartNoAxesCombined,
  Flag,
  HeartHandshake,
  Package,
  PanelLeft,
  ReceiptText,
  Sparkles,
  UsersRound,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import AnalyticsModule from "./analytics-module"
import ArtisanManagementModule from "./artisan-management-module"
import CustomerExperienceManagementModule from "./customer-experience-management-module"
import FeaturedStoryModule from "./featured-story-module"
import ModerationModule from "./moderation-module"
import OrderManagementModule from "./order-management-module"
import ProductManagementModule, { type ProductEditValues } from "./product-management-module"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  cancelAdminOrder,
  getAdminAnalytics,
  getAdminOrders,
  type AdminAnalytics,
  type AdminOrder,
} from "@/lib/api/admin"
import { deleteArtisanProfile, getArtisanProfiles } from "@/lib/api/artisans"
import { getCategories } from "@/lib/api/categories"
import {
  createProductPayloadFromDetails,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/lib/api/products"
import { getProductReports, resolveProductReport, type ProductReport } from "@/lib/api/reports"
import { getAllReviews } from "@/lib/api/reviews"
import { getStoriesFeed, type StoryFeedItem } from "@/lib/api/stories"
import type { ArtisanProfile, Category, ProductListItem, ProductReview } from "@/lib/api/types"
import {
  getWorkshopApplications,
  updateWorkshopApplicationStatus,
  type WorkshopApplication,
} from "@/lib/api/workshop-applications"
import { cn } from "@/lib/utils"

type PanelTab = "products" | "stories" | "moderation" | "orders" | "artisans" | "experience" | "analytics"

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
    id: "stories",
    label: "Haftanın Hikayesi",
    summary: "Vitrine çıkarılacak hikayeyi seçin",
    icon: Sparkles,
  },
  {
    id: "moderation",
    label: "Moderasyon Kuyruğu",
    summary: "Kullanıcı raporlarını inceleyin ve kapatın",
    icon: Flag,
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

export default function AdminPanelClient() {
  const [activeTab, setActiveTab] = useState<PanelTab>("products")

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stories, setStories] = useState<StoryFeedItem[]>([])
  const [reports, setReports] = useState<ProductReport[]>([])
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([])
  const [applications, setApplications] = useState<WorkshopApplication[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [reviews, setReviews] = useState<ProductReview[]>([])

  const loadProducts = useCallback(async () => {
    try {
      setProducts(await getProducts())
    } catch {
      // ignore
    }
  }, [])

  const loadReports = useCallback(async () => {
    try {
      setReports(await getProductReports())
    } catch {
      // ignore
    }
  }, [])

  const loadArtisans = useCallback(async () => {
    try {
      setArtisans(await getArtisanProfiles())
    } catch {
      // ignore
    }
  }, [])

  const loadApplications = useCallback(async () => {
    try {
      setApplications(await getWorkshopApplications())
    } catch {
      // ignore
    }
  }, [])

  const loadOrders = useCallback(async () => {
    try {
      setOrders(await getAdminOrders())
    } catch {
      // ignore
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    try {
      setAnalytics(await getAdminAnalytics())
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    async function bootstrap() {
      await Promise.all([
        loadAnalytics(),
        loadProducts(),
        loadReports(),
        loadArtisans(),
        loadApplications(),
        loadOrders(),
      ])

      try {
        setCategories(await getCategories())
      } catch {
        // ignore
      }

      try {
        setStories(await getStoriesFeed())
      } catch {
        // ignore
      }

      try {
        setReviews(await getAllReviews())
      } catch {
        // ignore
      }
    }

    void bootstrap()
  }, [loadAnalytics, loadProducts, loadReports, loadArtisans, loadApplications, loadOrders])

  const handleSaveProduct = useCallback(
    async (productId: string, values: ProductEditValues) => {
      const details = await getProductById(productId)
      const payload = createProductPayloadFromDetails(details, {
        name: values.name,
        categoryId: values.categoryId,
        price: values.price,
        status: values.status,
        salesMode: values.salesMode,
        summary: values.summary,
        stock: values.stock,
        isSoldOut: values.stock <= 0,
      })
      await updateProduct(productId, payload)
      await loadProducts()
      await loadAnalytics()
    },
    [loadProducts, loadAnalytics],
  )

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      try {
        await deleteProduct(productId)
        await loadProducts()
        await loadAnalytics()
      } catch {
        // ignore
      }
    },
    [loadProducts, loadAnalytics],
  )

  const handleResolveReport = useCallback(
    async (report: ProductReport) => {
      try {
        await resolveProductReport(report)
        await loadReports()
      } catch {
        // ignore
      }
    },
    [loadReports],
  )

  const handleBanArtisan = useCallback(
    async (artisanId: string) => {
      try {
        await deleteArtisanProfile(artisanId)
        await loadArtisans()
      } catch {
        // ignore
      }
    },
    [loadArtisans],
  )

  const handleApproveApplication = useCallback(
    async (application: WorkshopApplication) => {
      try {
        await updateWorkshopApplicationStatus(application, "Approved")
        await loadApplications()
      } catch {
        // ignore
      }
    },
    [loadApplications],
  )

  const handleRejectApplication = useCallback(
    async (application: WorkshopApplication) => {
      try {
        await updateWorkshopApplicationStatus(application, "Rejected")
        await loadApplications()
      } catch {
        // ignore
      }
    },
    [loadApplications],
  )

  const handleCancelOrder = useCallback(
    async (orderId: string) => {
      try {
        await cancelAdminOrder(orderId)
        await loadOrders()
        await loadAnalytics()
      } catch {
        // ignore
      }
    },
    [loadOrders, loadAnalytics],
  )

  function renderModule(tab: PanelTab) {
    switch (tab) {
      case "products":
        return (
          <ProductManagementModule
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )
      case "stories":
        return <FeaturedStoryModule stories={stories} />
      case "moderation":
        return <ModerationModule reports={reports} products={products} onResolveReport={handleResolveReport} />
      case "orders":
        return <OrderManagementModule orders={orders} onCancelOrder={handleCancelOrder} />
      case "artisans":
        return (
          <ArtisanManagementModule
            artisans={artisans}
            applications={applications}
            onBanArtisan={handleBanArtisan}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
          />
        )
      case "experience":
        return <CustomerExperienceManagementModule reviews={reviews} />
      case "analytics":
        return <AnalyticsModule analytics={analytics} />
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
          El Emeği Yönetim Masası
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Admin Paneli</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Kürasyon, operasyon ve topluluk sinyallerini tek bakışta takip etmek için tasarlanmış yönetim alanı.
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
