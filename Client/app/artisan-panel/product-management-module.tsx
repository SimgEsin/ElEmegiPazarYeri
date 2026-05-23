"use client"
/* eslint-disable @next/next/no-img-element */

import type { ChangeEvent, RefObject } from "react"
import { Bold, ImagePlus, Italic, List, ListOrdered } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import type { ArtisanProduct, ProductImage, ProductSalesMode, ProductStatus } from "./panel-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createSlug, stripHtml } from "@/lib/catalog"
import { cn } from "@/lib/utils"

type ProductManagementModuleProps = {
  products: ArtisanProduct[]
  onSaveProduct: (product: ArtisanProduct) => void
  onDeleteProduct: (productId: string) => void
}

type ImageAsset = {
  file?: File
  previewUrl: string
  name: string
  alt?: string
  origin: "saved" | "local"
}

type ProductFormState = {
  name: string
  category: string
  price: string
  stock: string
  status: ProductStatus
  salesMode: ProductSalesMode
  summary: string
  storyTitle: string
  storyContent: string
  material: string
  technique: string
  productionDuration: string
  deliveryInfo: string
  height: string
  width: string
  weight: string
  heroImage: ImageAsset | null
  galleryImages: ImageAsset[]
  storyImages: ImageAsset[]
}

const CATEGORY_OPTIONS = ["Seramik", "Dokuma", "Ahşap", "Cam", "Metal"]
const STATUS_OPTIONS: ProductStatus[] = ["Yayında", "Taslak", "Stokta Az"]
const SALES_MODE_OPTIONS: ProductSalesMode[] = ["Hazır Eser", "Siparişe Özel Üretim"]

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

const initialFormState: ProductFormState = {
  name: "",
  category: "",
  price: "",
  stock: "",
  status: "Yayında",
  salesMode: "Hazır Eser",
  summary: "",
  storyTitle: "",
  storyContent: "",
  material: "",
  technique: "",
  productionDuration: "",
  deliveryInfo: "",
  height: "",
  width: "",
  weight: "",
  heroImage: null,
  galleryImages: [],
  storyImages: [],
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

function getStatusVariant(status: ProductStatus): "default" | "secondary" | "outline" {
  if (status === "Yayında") {
    return "default"
  }

  if (status === "Stokta Az") {
    return "secondary"
  }

  return "outline"
}

function createSavedAsset(image: ProductImage): ImageAsset {
  return {
    name: image.name,
    previewUrl: image.previewUrl,
    alt: image.alt,
    origin: "saved",
  }
}

function createFormStateFromProduct(product: ArtisanProduct): ProductFormState {
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    status: product.status,
    salesMode: product.salesMode,
    summary: product.summary,
    storyTitle: product.storyTitle,
    storyContent: product.storyContent,
    material: product.material,
    technique: product.technique,
    productionDuration: product.productionDuration,
    deliveryInfo: product.deliveryInfo,
    height: product.dimensions.height,
    width: product.dimensions.width,
    weight: product.dimensions.weight,
    heroImage: product.heroImage ? createSavedAsset(product.heroImage) : null,
    galleryImages: product.galleryImages.map(createSavedAsset),
    storyImages: product.storyImages.map(createSavedAsset),
  }
}

function createImageAsset(file: File): ImageAsset {
  return {
    file,
    previewUrl: URL.createObjectURL(file),
    name: file.name,
    alt: file.name.replace(/\.[^.]+$/, ""),
    origin: "local",
  }
}

function revokeBlobUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

function revokeLocalAsset(asset: ImageAsset | null) {
  if (asset?.origin === "local") {
    revokeBlobUrl(asset.previewUrl)
  }
}

function revokeLocalAssets(assets: ImageAsset[]) {
  assets.forEach((asset) => {
    if (asset.origin === "local") {
      revokeBlobUrl(asset.previewUrl)
    }
  })
}

function revokeRemovedSavedImages(previousProduct: ArtisanProduct, nextProduct: ArtisanProduct) {
  const keptUrls = new Set([
    nextProduct.heroImage?.previewUrl,
    ...nextProduct.galleryImages.map((image) => image.previewUrl),
    ...nextProduct.storyImages.map((image) => image.previewUrl),
  ])

  if (previousProduct.heroImage && !keptUrls.has(previousProduct.heroImage.previewUrl)) {
    revokeBlobUrl(previousProduct.heroImage.previewUrl)
  }

  previousProduct.galleryImages.forEach((image) => {
    if (!keptUrls.has(image.previewUrl)) {
      revokeBlobUrl(image.previewUrl)
    }
  })

  previousProduct.storyImages.forEach((image) => {
    if (!keptUrls.has(image.previewUrl)) {
      revokeBlobUrl(image.previewUrl)
    }
  })
}

function revokeProductImages(product: ArtisanProduct) {
  if (product.heroImage) {
    revokeBlobUrl(product.heroImage.previewUrl)
  }

  product.galleryImages.forEach((image) => revokeBlobUrl(image.previewUrl))
  product.storyImages.forEach((image) => revokeBlobUrl(image.previewUrl))
}

function execStoryCommand(command: string, editor: HTMLDivElement | null) {
  if (!editor) {
    return
  }

  editor.focus()
  document.execCommand(command)
}

function insertStoryImageMarkup(editor: HTMLDivElement | null, asset: ImageAsset) {
  if (!editor) {
    return
  }

  editor.focus()
  document.execCommand(
    "insertHTML",
    false,
    `<p><img src="${asset.previewUrl}" alt="${asset.alt ?? asset.name}" /></p>`
  )
}

function inferPageHref(slug: string, existingProduct: ArtisanProduct | undefined) {
  if (existingProduct?.pageHref) {
    return existingProduct.pageHref
  }

  if (slug === "gunesin-gozyasi-vazo" || slug === "stok-seramik-vazo") {
    return `/products/${slug}`
  }

  return null
}

function StoryEditor({
  value,
  onChange,
  onSelectImages,
  editorRef,
}: {
  value: string
  onChange: (value: string) => void
  onSelectImages: () => void
  editorRef: RefObject<HTMLDivElement | null>
}) {
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [editorRef, value])

  return (
    <div className="space-y-3 rounded-xl border border-primary/10 bg-background/70 p-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => execStoryCommand("bold", editorRef.current)}>
          <Bold className="size-4" />
          Kalın
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => execStoryCommand("italic", editorRef.current)}>
          <Italic className="size-4" />
          İtalik
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => execStoryCommand("insertUnorderedList", editorRef.current)}>
          <List className="size-4" />
          Liste
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => execStoryCommand("insertOrderedList", editorRef.current)}>
          <ListOrdered className="size-4" />
          Sıralı Liste
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onSelectImages}>
          <ImagePlus className="size-4" />
          Görsel Ekle
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        className="min-h-48 rounded-xl border border-primary/10 bg-card px-4 py-3 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      />

      <p className="text-xs text-muted-foreground">
        Hikaye gövdesine kalın, italik, liste ve bağımsız hikaye görselleri ekleyebilirsiniz.
      </p>
    </div>
  )
}

export default function ProductManagementModule({
  products,
  onSaveProduct,
  onDeleteProduct,
}: ProductManagementModuleProps) {
  const [form, setForm] = useState<ProductFormState>(initialFormState)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const heroImageRef = useRef<ImageAsset | null>(null)
  const galleryImagesRef = useRef<ImageAsset[]>([])
  const storyImagesRef = useRef<ImageAsset[]>([])
  const storyEditorRef = useRef<HTMLDivElement | null>(null)
  const storyImageInputRef = useRef<HTMLInputElement | null>(null)

  const categoryOptions = useMemo(() => {
    return ["Tümü", ...new Set([...CATEGORY_OPTIONS, ...products.map((product) => product.category)])]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Tümü") {
      return products
    }

    return products.filter((product) => product.category === selectedCategory)
  }, [products, selectedCategory])

  useEffect(() => {
    heroImageRef.current = form.heroImage
  }, [form.heroImage])

  useEffect(() => {
    galleryImagesRef.current = form.galleryImages
  }, [form.galleryImages])

  useEffect(() => {
    storyImagesRef.current = form.storyImages
  }, [form.storyImages])

  useEffect(() => {
    return () => {
      revokeLocalAsset(heroImageRef.current)
      revokeLocalAssets(galleryImagesRef.current)
      revokeLocalAssets(storyImagesRef.current)
    }
  }, [])

  function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrorMessage("")
    setSuccessMessage("")
  }

  function resetForm() {
    revokeLocalAsset(form.heroImage)
    revokeLocalAssets(form.galleryImages)
    revokeLocalAssets(form.storyImages)
    setEditingProductId(null)
    setForm(initialFormState)
    setErrorMessage("")
    setSuccessMessage("")
  }

  function populateForm(product: ArtisanProduct) {
    revokeLocalAsset(form.heroImage)
    revokeLocalAssets(form.galleryImages)
    revokeLocalAssets(form.storyImages)
    setEditingProductId(product.id)
    setForm(createFormStateFromProduct(product))
    setErrorMessage("")
    setSuccessMessage("")
  }

  function handleHeroImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Ana ürün görseli için yalnızca görsel dosyası seçin.")
      event.target.value = ""
      return
    }

    if (form.heroImage?.origin === "local") {
      revokeBlobUrl(form.heroImage.previewUrl)
    }

    updateField("heroImage", createImageAsset(file))
    event.target.value = ""
  }

  function removeHeroImage() {
    revokeLocalAsset(form.heroImage)
    updateField("heroImage", null)
  }

  function handleGalleryImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const imageFiles = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      setErrorMessage("Galeri için en az bir görsel seçin.")
      event.target.value = ""
      return
    }

    updateField("galleryImages", [...form.galleryImages, ...imageFiles.map(createImageAsset)])
    event.target.value = ""
  }

  function removeGalleryImage(previewUrl: string) {
    const asset = form.galleryImages.find((image) => image.previewUrl === previewUrl)

    if (asset?.origin === "local") {
      revokeBlobUrl(asset.previewUrl)
    }

    updateField(
      "galleryImages",
      form.galleryImages.filter((image) => image.previewUrl !== previewUrl)
    )
  }

  function handleStoryImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const imageFiles = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      setErrorMessage("Hikaye için yalnızca görsel dosyaları ekleyin.")
      event.target.value = ""
      return
    }

    const nextAssets = imageFiles.map(createImageAsset)

    setForm((current) => {
      const nextStoryImages = [...current.storyImages, ...nextAssets]

      window.requestAnimationFrame(() => {
        nextAssets.forEach((asset) => insertStoryImageMarkup(storyEditorRef.current, asset))
        if (storyEditorRef.current) {
          updateField("storyContent", storyEditorRef.current.innerHTML)
        }
      })

      return {
        ...current,
        storyImages: nextStoryImages,
      }
    })

    setErrorMessage("")
    setSuccessMessage("")
    event.target.value = ""
  }

  function removeStoryImage(previewUrl: string) {
    const asset = form.storyImages.find((image) => image.previewUrl === previewUrl)

    if (asset?.origin === "local") {
      revokeBlobUrl(asset.previewUrl)
    }

    updateField(
      "storyImages",
      form.storyImages.filter((image) => image.previewUrl !== previewUrl)
    )

    if (storyEditorRef.current) {
      storyEditorRef.current.innerHTML = storyEditorRef.current.innerHTML.replaceAll(
        new RegExp(`<p><img src="${previewUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*><\\/p>`, "g"),
        ""
      )
      updateField("storyContent", storyEditorRef.current.innerHTML)
    }
  }

  function handleSave() {
    const trimmedName = form.name.trim()
    const trimmedCategory = form.category.trim()
    const trimmedSummary = form.summary.trim()
    const trimmedStoryTitle = form.storyTitle.trim()
    const trimmedStoryText = stripHtml(form.storyContent)
    const trimmedMaterial = form.material.trim()
    const trimmedTechnique = form.technique.trim()
    const trimmedProductionDuration = form.productionDuration.trim()
    const trimmedDeliveryInfo = form.deliveryInfo.trim()
    const trimmedHeight = form.height.trim()
    const trimmedWidth = form.width.trim()
    const trimmedWeight = form.weight.trim()
    const parsedPrice = Number(form.price)
    const parsedStock = Number(form.stock)

    if (!trimmedName || !trimmedCategory || form.price.trim() === "" || form.stock.trim() === "") {
      setErrorMessage("Ürün adı, kategori, fiyat ve stok alanlarını doldurun.")
      return
    }

    if (!trimmedSummary || !trimmedStoryTitle || !trimmedStoryText) {
      setErrorMessage("Kısa özet, hikaye başlığı ve hikaye metni alanlarını doldurun.")
      return
    }

    if (
      !trimmedMaterial ||
      !trimmedTechnique ||
      !trimmedProductionDuration ||
      !trimmedDeliveryInfo ||
      !trimmedHeight ||
      !trimmedWidth ||
      !trimmedWeight
    ) {
      setErrorMessage("Ürün detay alanlarını eksiksiz doldurun.")
      return
    }

    if (!form.heroImage) {
      setErrorMessage("Ana ürün görseli yükleyin.")
      return
    }

    if (form.galleryImages.length === 0) {
      setErrorMessage("Galeri için en az bir görsel yükleyin.")
      return
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Fiyat sıfır veya daha büyük bir sayı olmalı.")
      return
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      setErrorMessage("Stok sıfır veya daha büyük bir sayı olmalı.")
      return
    }

    const existingProduct = products.find((product) => product.id === editingProductId)
    const slug = existingProduct?.slug ?? createSlug(trimmedName)

    const nextProduct: ArtisanProduct = {
      id: existingProduct?.id ?? `product-${Date.now()}`,
      slug,
      pageHref: inferPageHref(slug, existingProduct),
      artisanSlug: existingProduct?.artisanSlug ?? "zeynep-yilmaz",
      artisanName: existingProduct?.artisanName ?? "Zeynep Yılmaz",
      name: trimmedName,
      category: trimmedCategory,
      price: parsedPrice,
      stock: parsedStock,
      status: form.status,
      salesMode: form.salesMode,
      summary: trimmedSummary,
      storyTitle: trimmedStoryTitle,
      storyContent: form.storyContent,
      storyImages: form.storyImages.map((image) => ({
        name: image.name,
        previewUrl: image.previewUrl,
        alt: image.alt,
      })),
      material: trimmedMaterial,
      technique: trimmedTechnique,
      productionDuration: trimmedProductionDuration,
      deliveryInfo: trimmedDeliveryInfo,
      dimensions: {
        height: trimmedHeight,
        width: trimmedWidth,
        weight: trimmedWeight,
      },
      heroImage: {
        name: form.heroImage.name,
        previewUrl: form.heroImage.previewUrl,
        alt: form.heroImage.alt,
      },
      galleryImages: form.galleryImages.map((image) => ({
        name: image.name,
        previewUrl: image.previewUrl,
        alt: image.alt,
      })),
      views: existingProduct?.views ?? 0,
      salesCount: existingProduct?.salesCount ?? 0,
      revenue: existingProduct?.revenue ?? 0,
    }

    if (existingProduct) {
      revokeRemovedSavedImages(existingProduct, nextProduct)
    }

    onSaveProduct(nextProduct)
    setEditingProductId(nextProduct.id)
    setForm(createFormStateFromProduct(nextProduct))
    setErrorMessage("")
    setSuccessMessage(editingProductId ? "Ürün ve hikaye güncellendi." : "Yeni ürün ve hikaye eklendi.")
  }

  function handleDelete(product: ArtisanProduct) {
    if (editingProductId === product.id) {
      revokeLocalAsset(form.heroImage)
      revokeLocalAssets(form.galleryImages)
      revokeLocalAssets(form.storyImages)
      setEditingProductId(null)
      setForm(initialFormState)
    }

    revokeProductImages(product)
    onDeleteProduct(product.id)
    setSuccessMessage("Ürün ve ilişkili hikaye listeden kaldırıldı.")
    setErrorMessage("")
  }

  return (
    <div className="space-y-5">
      <Card className="border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle>{editingProductId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</CardTitle>
          <CardDescription>
            Ürün kartlarını aynı panelden yönetin; ürün detay ve hikaye sayfaları için gerekli bilgileri burada toplayın.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="product-name" className="text-sm font-medium">
                    Ürün Adı
                  </label>
                  <Input
                    id="product-name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Ürün adı"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-category" className="text-sm font-medium">
                    Kategori
                  </label>
                  <select
                    id="product-category"
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Kategori seçin</option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-sales-mode" className="text-sm font-medium">
                    Satış Modu
                  </label>
                  <select
                    id="product-sales-mode"
                    value={form.salesMode}
                    onChange={(event) => updateField("salesMode", event.target.value as ProductSalesMode)}
                    className={selectClassName}
                  >
                    {SALES_MODE_OPTIONS.map((salesMode) => (
                      <option key={salesMode} value={salesMode}>
                        {salesMode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-price" className="text-sm font-medium">
                    Fiyat
                  </label>
                  <Input
                    id="product-price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    placeholder="Fiyat"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-stock" className="text-sm font-medium">
                    Stok
                  </label>
                  <Input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => updateField("stock", event.target.value)}
                    placeholder="Stok"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="product-status" className="text-sm font-medium">
                    Ürün Durumu
                  </label>
                  <select
                    id="product-status"
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value as ProductStatus)}
                    className={selectClassName}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="product-summary" className="text-sm font-medium">
                  Kısa Özet
                </label>
                <Textarea
                  id="product-summary"
                  value={form.summary}
                  onChange={(event) => updateField("summary", event.target.value)}
                  placeholder="Ürün için kısa özet"
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="product-story-title" className="text-sm font-medium">
                  Hikaye Başlığı
                </label>
                <Input
                  id="product-story-title"
                  value={form.storyTitle}
                  onChange={(event) => updateField("storyTitle", event.target.value)}
                  placeholder="Ürünün hikaye başlığı"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hikaye Metni</label>
                <StoryEditor
                  value={form.storyContent}
                  onChange={(value) => updateField("storyContent", value)}
                  onSelectImages={() => storyImageInputRef.current?.click()}
                  editorRef={storyEditorRef}
                />
                <input
                  ref={storyImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleStoryImagesChange}
                />
              </div>

              <div className="space-y-3 rounded-xl border border-primary/10 bg-background/70 p-4">
                <div>
                  <p className="text-sm font-medium">Hikaye Görselleri</p>
                  <p className="text-xs text-muted-foreground">Bu alan ürün galerisi değil, yalnızca hikaye gövdesinde kullanılacak görseller içindir.</p>
                </div>

                {form.storyImages.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {form.storyImages.map((image) => (
                      <div key={image.previewUrl} className="overflow-hidden rounded-xl border border-primary/10 bg-muted/20">
                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                          <img src={image.previewUrl} alt={image.alt ?? image.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3">
                          <p className="truncate text-sm font-medium">{image.name}</p>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeStoryImage(image.previewUrl)}>
                            Kaldır
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Henüz hikaye görseli eklenmedi.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="product-material" className="text-sm font-medium">
                    Malzeme
                  </label>
                  <Input
                    id="product-material"
                    value={form.material}
                    onChange={(event) => updateField("material", event.target.value)}
                    placeholder="Malzeme"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-technique" className="text-sm font-medium">
                    Teknik
                  </label>
                  <Input
                    id="product-technique"
                    value={form.technique}
                    onChange={(event) => updateField("technique", event.target.value)}
                    placeholder="Teknik"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-production-duration" className="text-sm font-medium">
                    Üretim Süresi
                  </label>
                  <Input
                    id="product-production-duration"
                    value={form.productionDuration}
                    onChange={(event) => updateField("productionDuration", event.target.value)}
                    placeholder="Örn. 18 Gün"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-delivery-info" className="text-sm font-medium">
                    Teslimat Bilgisi
                  </label>
                  <Input
                    id="product-delivery-info"
                    value={form.deliveryInfo}
                    onChange={(event) => updateField("deliveryInfo", event.target.value)}
                    placeholder="Örn. Tahmini teslimat: 2-4 iş günü"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-height" className="text-sm font-medium">
                    Yükseklik
                  </label>
                  <Input
                    id="product-height"
                    value={form.height}
                    onChange={(event) => updateField("height", event.target.value)}
                    placeholder="Örn. 32 cm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product-width" className="text-sm font-medium">
                    Genişlik
                  </label>
                  <Input
                    id="product-width"
                    value={form.width}
                    onChange={(event) => updateField("width", event.target.value)}
                    placeholder="Örn. 22 cm"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="product-weight" className="text-sm font-medium">
                    Ağırlık
                  </label>
                  <Input
                    id="product-weight"
                    value={form.weight}
                    onChange={(event) => updateField("weight", event.target.value)}
                    placeholder="Örn. 1.4 kg"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-primary/10 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Ana Ürün Görseli</p>
                    <p className="text-xs text-muted-foreground">Kart ve ürün detayında kullanılacak ana görsel.</p>
                  </div>
                  {form.heroImage ? (
                    <Button type="button" variant="ghost" size="sm" onClick={removeHeroImage}>
                      Kaldır
                    </Button>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor="product-hero-image" className="text-sm font-medium">
                    Görsel Seç
                  </label>
                  <Input id="product-hero-image" type="file" accept="image/*" onChange={handleHeroImageChange} />
                </div>

                {form.heroImage ? (
                  <div className="overflow-hidden rounded-xl border border-primary/10 bg-muted/20">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img src={form.heroImage.previewUrl} alt={form.heroImage.alt ?? form.heroImage.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium">{form.heroImage.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Henüz ana ürün görseli seçilmedi.</p>
                )}
              </div>

              <div className="space-y-3 rounded-xl border border-primary/10 bg-background/70 p-4">
                <div>
                  <p className="text-sm font-medium">Galeri Görselleri</p>
                  <p className="text-xs text-muted-foreground">Detay sayfasındaki küçük görseller için birden fazla dosya ekleyebilirsiniz.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="product-gallery-images" className="text-sm font-medium">
                    Galeri Dosyalarını Seç
                  </label>
                  <Input
                    id="product-gallery-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                  />
                </div>

                {form.galleryImages.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {form.galleryImages.map((image) => (
                      <div key={image.previewUrl} className="overflow-hidden rounded-xl border border-primary/10 bg-muted/20">
                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                          <img src={image.previewUrl} alt={image.alt ?? image.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3">
                          <p className="truncate text-sm font-medium">{image.name}</p>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeGalleryImage(image.previewUrl)}>
                            Kaldır
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Henüz galeri görseli eklenmedi.</p>
                )}
              </div>
            </div>
          </div>

          {errorMessage ? <p className="text-sm font-medium text-destructive">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm font-medium text-primary">{successMessage}</p> : null}

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Formu Temizle
            </Button>
            <Button type="button" onClick={handleSave}>
              {editingProductId ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Ürün Listesi</h3>
          <p className="text-xs text-muted-foreground">Kategori seçerek görünümü daraltabilirsiniz.</p>
        </div>
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className={cn(selectClassName, "w-full sm:w-56")}
          aria-label="Kategoriye göre filtrele"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category === "Tümü" ? "Tüm kategoriler" : category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden border-primary/10 bg-background/80">
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              {product.heroImage ? (
                <img src={product.heroImage.previewUrl} alt={product.heroImage.alt ?? product.heroImage.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{product.name}</h3>
                    <Badge variant={getStatusVariant(product.status)}>{product.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.salesMode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-muted-foreground">Stok: {product.stock}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">{product.storyTitle}</p>
                <p className="line-clamp-3 text-sm text-muted-foreground">{product.summary}</p>
              </div>

              <div className="mt-5 grid gap-3 rounded-xl border border-primary/10 bg-muted/20 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Görüntülenme</p>
                  <p className="mt-1 text-sm font-semibold">{product.views}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Satış</p>
                  <p className="mt-1 text-sm font-semibold">{product.salesCount}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Gelir</p>
                  <p className="mt-1 text-sm font-semibold">{formatCurrency(product.revenue)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => populateForm(product)}>
                  Düzenle
                </Button>
                <Button type="button" variant="outline" onClick={() => handleDelete(product)}>
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
