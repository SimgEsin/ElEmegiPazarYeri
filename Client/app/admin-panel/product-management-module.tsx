"use client"

import { BarChart3, PackageCheck, PencilLine, ShieldAlert, Trash2, TriangleAlert } from "lucide-react"
import { useState } from "react"

import type { ArtisanProduct, ProductSalesMode, ProductStatus } from "@/app/artisan-panel/panel-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { deleteCatalogProduct, saveCatalogProduct, setFeaturedStory, useCatalogSnapshot } from "@/lib/catalog-store"

const productHighlights = [
  { label: "Yayındaki ürün", value: "128", detail: "Platformda aktif olarak listeleniyor", icon: PackageCheck },
  { label: "İnceleme bekleyen", value: "14", detail: "Yayın ve içerik kuralları kontrol ediliyor", icon: ShieldAlert },
  { label: "Raporlanan ürün", value: "9", detail: "Kaldırma veya düzenleme kararı bekliyor", icon: TriangleAlert },
]

const moderationQueue = [
  {
    name: "İndigo Servis Kasesi",
    reason: "Kullanıcı raporu: ürün görselleri ile teslim edilen ürün arasında fark olduğu bildirildi.",
    status: "Kullanıcı raporu inceleniyor",
    source: "Kullanıcı Raporu",
  },
  {
    name: "Gece Mavisi Seramik Kupa",
    reason: "Kullanıcı raporu: sır yüzeyinde çatlak bulunduğu ve açıklamada belirtilmediği aktarıldı.",
    status: "Kanıt bekleniyor",
    source: "Kullanıcı Raporu",
  },
  {
    name: "Hasır Sunum Tepsisi",
    reason: "Kullanıcı raporu: ürün kenarlarında beklenmeyen soyulma görüldüğü paylaşıldı.",
    status: "Karar bekliyor",
    source: "Kullanıcı Raporu",
  },
]

const STATUS_OPTIONS: ProductStatus[] = ["Yayında", "Taslak", "Stokta Az"]
const SALES_MODE_OPTIONS: ProductSalesMode[] = ["Hazır Eser", "Siparişe Özel Üretim"]

type ProductEditForm = {
  name: string
  artisanName: string
  category: string
  status: ProductStatus
  salesMode: ProductSalesMode
  price: string
  stock: string
  summary: string
}

function createEditForm(product: ArtisanProduct): ProductEditForm {
  return {
    name: product.name,
    artisanName: product.artisanName,
    category: product.category,
    status: product.status,
    salesMode: product.salesMode,
    price: String(product.price),
    stock: String(product.stock),
    summary: product.summary,
  }
}

export default function ProductManagementModule() {
  const [productSearch, setProductSearch] = useState("")
  const [storySearch, setStorySearch] = useState("")
  const [moderationSearch, setModerationSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState<ArtisanProduct | null>(null)
  const [editForm, setEditForm] = useState<ProductEditForm | null>(null)
  const [productPendingDelete, setProductPendingDelete] = useState<ArtisanProduct | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const { products, stories } = useCatalogSnapshot()
  const featuredStory = stories.find((story) => story.isFeatured) ?? stories[0]
  const normalizedProductSearch = productSearch.trim().toLocaleLowerCase("tr-TR")
  const normalizedStorySearch = storySearch.trim().toLocaleLowerCase("tr-TR")
  const normalizedModerationSearch = moderationSearch.trim().toLocaleLowerCase("tr-TR")
  const filteredProducts = products.filter((product) =>
    [product.name, product.artisanName, product.status, product.category].some((value) =>
      value.toLocaleLowerCase("tr-TR").includes(normalizedProductSearch)
    )
  )
  const filteredStories = stories.filter((story) =>
    [story.title, story.artisanName, story.productName, story.category].some((value) =>
      value.toLocaleLowerCase("tr-TR").includes(normalizedStorySearch)
    )
  )
  const filteredModerationQueue = moderationQueue
    .filter((item) => item.source === "Kullanıcı Raporu")
    .filter((item) =>
      [item.name, item.reason, item.status, item.source].some((value) =>
        value.toLocaleLowerCase("tr-TR").includes(normalizedModerationSearch)
      )
    )
  const visibleProducts = filteredProducts.slice(0, 3)
  const visibleStories = filteredStories.slice(0, 3)
  const visibleModerationQueue = filteredModerationQueue.slice(0, 3)

  function openEditModal(product: ArtisanProduct) {
    setEditingProduct(product)
    setEditForm(createEditForm(product))
    setErrorMessage("")
    setFeedbackMessage("")
  }

  function closeEditModal() {
    setEditingProduct(null)
    setEditForm(null)
    setErrorMessage("")
  }

  function updateEditForm<K extends keyof ProductEditForm>(field: K, value: ProductEditForm[K]) {
    setEditForm((current) => (current ? { ...current, [field]: value } : current))
    setErrorMessage("")
  }

  function handleSaveEdit() {
    if (!editingProduct || !editForm) {
      return
    }

    const trimmedName = editForm.name.trim()
    const trimmedArtisanName = editForm.artisanName.trim()
    const trimmedCategory = editForm.category.trim()
    const trimmedSummary = editForm.summary.trim()
    const parsedPrice = Number(editForm.price)
    const parsedStock = Number(editForm.stock)

    if (!trimmedName || !trimmedArtisanName || !trimmedCategory) {
      setErrorMessage("Ürün adı, zanaatkar adı ve kategori alanlarını doldurun.")
      return
    }

    if (editForm.price.trim() === "" || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Geçerli bir fiyat girin.")
      return
    }

    if (editForm.stock.trim() === "" || Number.isNaN(parsedStock) || parsedStock < 0) {
      setErrorMessage("Geçerli bir stok değeri girin.")
      return
    }

    if (!trimmedSummary) {
      setErrorMessage("Kısa özet alanını doldurun.")
      return
    }

    saveCatalogProduct({
      ...editingProduct,
      name: trimmedName,
      artisanName: trimmedArtisanName,
      category: trimmedCategory,
      status: editForm.status,
      salesMode: editForm.salesMode,
      price: parsedPrice,
      stock: parsedStock,
      summary: trimmedSummary,
    })

    setFeedbackMessage("Ürün bilgileri güncellendi.")
    closeEditModal()
  }

  function handleDeleteProduct() {
    if (!productPendingDelete) {
      return
    }

    deleteCatalogProduct(productPendingDelete.id)
    setFeedbackMessage("Ürün ve ilişkili hikaye kaldırıldı.")
    setProductPendingDelete(null)
    setErrorMessage("")
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        {productHighlights.map((item) => {
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

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-primary/10 bg-background/85">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Ürün Listesi</CardTitle>
                <CardDescription>Admin görünümünde ürün düzenleme, silme ve istatistik aksiyonları burada toplanır.</CardDescription>
              </div>
              <Badge variant="secondary" className="border border-primary/10 bg-primary/10 text-primary">
                Yönetim Masası
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedbackMessage ? (
              <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
                {feedbackMessage}
              </div>
            ) : null}

            <Input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Ürün, zanaatkar, durum veya kategori ara"
              aria-label="Ürün listesinde ara"
            />

            {visibleProducts.length > 0 ? (
              visibleProducts.map((product, index) => (
                <div key={product.id} className="space-y-4 rounded-2xl border border-primary/10 bg-muted/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.artisanName}</p>
                    </div>
                    <Badge variant="outline" className="border-primary/15 bg-background/80">
                      {product.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {product.views.toLocaleString("tr-TR")} görüntülenme • {product.salesCount.toLocaleString("tr-TR")} satış
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(product)}>
                        <PencilLine className="size-4" />
                        Ürün Düzenle
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setProductPendingDelete(product)}>
                        <Trash2 className="size-4" />
                        Ürün Sil
                      </Button>
                      <Button type="button" size="sm">
                        <BarChart3 className="size-4" />
                        İstatistikleri Görüntüle
                      </Button>
                    </div>
                  </div>
                  {index < visibleProducts.length - 1 ? <Separator className="bg-primary/10" /> : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-primary/15 bg-muted/10 p-4 text-sm text-muted-foreground">
                Aramaya uygun ürün bulunamadı.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-primary/10 bg-primary/[0.04]">
            <CardHeader>
              <CardTitle>Haftanın Hikayesi</CardTitle>
              <CardDescription>Mevcut hikayeler arasından vitrine çıkarılacak tek hikayeyi seçin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {featuredStory ? (
                <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
                  <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Aktif Seçim</p>
                  <p className="mt-2 text-base font-semibold">{featuredStory.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{featuredStory.productName}</p>
                </div>
              ) : null}

              <Input
                value={storySearch}
                onChange={(event) => setStorySearch(event.target.value)}
                placeholder="Hikaye, zanaatkar, ürün veya kategori ara"
                aria-label="Hikaye listesinde ara"
              />

              {visibleStories.length > 0 ? (
                visibleStories.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => setFeaturedStory(story.id)}
                    className="w-full rounded-2xl border border-primary/10 bg-background/80 p-4 text-left transition-colors hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{story.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {story.artisanName} • {story.productName}
                        </p>
                      </div>
                      <Badge variant={story.isFeatured ? "default" : "outline"}>
                        {story.isFeatured ? "Seçili" : "Seç"}
                      </Badge>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-primary/15 bg-background/60 p-4 text-sm text-muted-foreground">
                  Aramaya uygun hikaye bulunamadı.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-primary/[0.04]">
            <CardHeader>
              <CardTitle>Moderasyon Kuyruğu</CardTitle>
              <CardDescription>Yalnızca kullanıcı raporları nedeniyle admin incelemesine düşen ürünler.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={moderationSearch}
                onChange={(event) => setModerationSearch(event.target.value)}
                placeholder="Ürün, rapor nedeni veya durum ara"
                aria-label="Moderasyon kuyruğunda ara"
              />

              {visibleModerationQueue.length > 0 ? (
                visibleModerationQueue.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-primary/10 bg-background/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                      <Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="mt-3 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                      {item.source}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-primary/15 bg-background/60 p-4 text-sm text-muted-foreground">
                  Aramaya uygun kullanıcı raporu bulunamadı.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {editingProduct && editForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-primary/15 bg-background shadow-2xl">
            <div className="space-y-2 border-b border-primary/10 px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight">Ürünü Düzenle</h2>
              <p className="text-sm text-muted-foreground">
                Bu modal temel ürün alanlarını günceller. Hikaye gövdesi ve görseller mevcut haliyle korunur.
              </p>
            </div>

            <div className="space-y-4 px-6 py-5">
              {errorMessage ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="admin-product-name" className="text-sm font-medium">
                    Ürün Adı
                  </label>
                  <Input
                    id="admin-product-name"
                    value={editForm.name}
                    onChange={(event) => updateEditForm("name", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-artisan-name" className="text-sm font-medium">
                    Zanaatkar Adı
                  </label>
                  <Input
                    id="admin-artisan-name"
                    value={editForm.artisanName}
                    onChange={(event) => updateEditForm("artisanName", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-product-category" className="text-sm font-medium">
                    Kategori
                  </label>
                  <Input
                    id="admin-product-category"
                    value={editForm.category}
                    onChange={(event) => updateEditForm("category", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-product-status" className="text-sm font-medium">
                    Durum
                  </label>
                  <select
                    id="admin-product-status"
                    value={editForm.status}
                    onChange={(event) => updateEditForm("status", event.target.value as ProductStatus)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-product-sales-mode" className="text-sm font-medium">
                    Satış Modu
                  </label>
                  <select
                    id="admin-product-sales-mode"
                    value={editForm.salesMode}
                    onChange={(event) => updateEditForm("salesMode", event.target.value as ProductSalesMode)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {SALES_MODE_OPTIONS.map((salesMode) => (
                      <option key={salesMode} value={salesMode}>
                        {salesMode}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-product-price" className="text-sm font-medium">
                    Fiyat
                  </label>
                  <Input
                    id="admin-product-price"
                    type="number"
                    min="0"
                    value={editForm.price}
                    onChange={(event) => updateEditForm("price", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-product-stock" className="text-sm font-medium">
                    Stok
                  </label>
                  <Input
                    id="admin-product-stock"
                    type="number"
                    min="0"
                    value={editForm.stock}
                    onChange={(event) => updateEditForm("stock", event.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="admin-product-summary" className="text-sm font-medium">
                    Kısa Özet
                  </label>
                  <textarea
                    id="admin-product-summary"
                    value={editForm.summary}
                    onChange={(event) => updateEditForm("summary", event.target.value)}
                    className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-primary/10 px-6 py-4">
              <Button type="button" variant="outline" onClick={closeEditModal}>
                Vazgeç
              </Button>
              <Button type="button" onClick={handleSaveEdit}>
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {productPendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-primary/15 bg-background shadow-2xl">
            <div className="space-y-2 px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight">Ürünü Sil</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{productPendingDelete.name}</span> ürünü silinirse ilişkili hikaye de kaldırılacak.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-primary/10 px-6 py-4">
              <Button type="button" variant="outline" onClick={() => setProductPendingDelete(null)}>
                Vazgeç
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteProduct}>
                Ürünü Sil
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
