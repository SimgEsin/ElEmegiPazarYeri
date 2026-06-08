"use client"

import { Archive, PackageCheck, PencilLine, ShieldAlert, Trash2 } from "lucide-react"
import { useState } from "react"

import type { Category, ProductListItem, ProductStatus, SalesMode } from "@/lib/api/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const STATUS_OPTIONS: ProductStatus[] = ["Published", "Draft", "Archived"]
const SALES_MODE_OPTIONS: SalesMode[] = ["ReadyToShip", "MadeToOrder"]

const STATUS_LABELS: Record<ProductStatus, string> = {
  Published: "Yayında",
  Draft: "Taslak",
  Archived: "Arşivlendi",
}

const SALES_MODE_LABELS: Record<SalesMode, string> = {
  ReadyToShip: "Hazır Eser",
  MadeToOrder: "Siparişe Özel Üretim",
}

export type ProductEditValues = {
  name: string
  categoryId: string
  status: ProductStatus
  salesMode: SalesMode
  price: number
  stock: number
  summary: string
}

type ProductEditForm = {
  name: string
  categoryId: string
  status: ProductStatus
  salesMode: SalesMode
  price: string
  stock: string
  summary: string
}

type ProductManagementModuleProps = {
  products: ProductListItem[]
  categories: Category[]
  onSaveProduct: (productId: string, values: ProductEditValues) => Promise<void> | void
  onDeleteProduct: (productId: string) => void
}

function createEditForm(product: ProductListItem): ProductEditForm {
  return {
    name: product.name,
    categoryId: product.categoryId,
    status: product.status,
    salesMode: product.salesMode,
    price: String(product.price),
    stock: String(product.stock),
    summary: product.summary ?? "",
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ProductManagementModule({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
}: ProductManagementModuleProps) {
  const [productSearch, setProductSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(null)
  const [editForm, setEditForm] = useState<ProductEditForm | null>(null)
  const [productPendingDelete, setProductPendingDelete] = useState<ProductListItem | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const publishedCount = products.filter((product) => product.status === "Published").length
  const draftCount = products.filter((product) => product.status === "Draft").length
  const archivedCount = products.filter((product) => product.status === "Archived").length

  const productHighlights = [
    { label: "Yayındaki ürün", value: publishedCount, detail: "Platformda aktif olarak listeleniyor", icon: PackageCheck },
    { label: "Taslak ürün", value: draftCount, detail: "Henüz yayınlanmamış kayıtlar", icon: ShieldAlert },
    { label: "Arşivdeki ürün", value: archivedCount, detail: "Yayından kaldırılmış kayıtlar", icon: Archive },
  ]

  const normalizedProductSearch = productSearch.trim().toLocaleLowerCase("tr-TR")
  const visibleProducts = products.filter((product) =>
    [product.name, product.artisanDisplayName ?? "", STATUS_LABELS[product.status], product.categoryName ?? ""].some(
      (value) => value.toLocaleLowerCase("tr-TR").includes(normalizedProductSearch),
    ),
  )

  function openEditModal(product: ProductListItem) {
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

  async function handleSaveEdit() {
    if (!editingProduct || !editForm) {
      return
    }

    const trimmedName = editForm.name.trim()
    const trimmedSummary = editForm.summary.trim()
    const parsedPrice = Number(editForm.price)
    const parsedStock = Number(editForm.stock)

    if (!trimmedName) {
      setErrorMessage("Ürün adını doldurun.")
      return
    }

    if (!editForm.categoryId) {
      setErrorMessage("Bir kategori seçin.")
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

    try {
      await onSaveProduct(editingProduct.id, {
        name: trimmedName,
        categoryId: editForm.categoryId,
        status: editForm.status,
        salesMode: editForm.salesMode,
        price: parsedPrice,
        stock: parsedStock,
        summary: trimmedSummary,
      })
      setFeedbackMessage("Ürün bilgileri güncellendi.")
      closeEditModal()
    } catch {
      setErrorMessage("Ürün güncellenemedi. Lütfen tekrar deneyin.")
    }
  }

  function handleDeleteProduct() {
    if (!productPendingDelete) {
      return
    }

    onDeleteProduct(productPendingDelete.id)
    setFeedbackMessage("Ürün kaldırıldı.")
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

      <Card className="border-primary/10 bg-background/85">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Ürün Listesi</CardTitle>
              <CardDescription>Admin görünümünde ürün düzenleme ve silme aksiyonları burada toplanır.</CardDescription>
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
                    <p className="text-sm text-muted-foreground">{product.artisanDisplayName ?? "Bilinmeyen zanaatkar"}</p>
                  </div>
                  <Badge variant="outline" className="border-primary/15 bg-background/80">
                    {STATUS_LABELS[product.status]}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {formatCurrency(product.price)} • {product.stock} stok • {product.categoryName ?? "Kategori yok"}
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
                  <label htmlFor="admin-product-category" className="text-sm font-medium">
                    Kategori
                  </label>
                  <select
                    id="admin-product-category"
                    value={editForm.categoryId}
                    onChange={(event) => updateEditForm("categoryId", event.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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
                        {STATUS_LABELS[status]}
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
                    onChange={(event) => updateEditForm("salesMode", event.target.value as SalesMode)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {SALES_MODE_OPTIONS.map((salesMode) => (
                      <option key={salesMode} value={salesMode}>
                        {SALES_MODE_LABELS[salesMode]}
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
                <span className="font-semibold text-foreground">{productPendingDelete.name}</span> ürünü kalıcı olarak kaldırılacak.
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
