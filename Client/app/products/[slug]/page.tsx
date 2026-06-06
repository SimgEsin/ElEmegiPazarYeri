import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock3, Hammer, Heart, House, Leaf, Share2, ShieldCheck, ShoppingBag, SquareLibrary, Star } from "lucide-react"

import { ProductStoryTeaser } from "@/components/site/product-story-teaser"
import { ExperienceShareModal } from "@/components/site/experience-share-modal"
import { ProductReportModal } from "@/components/site/product-report-modal"
import { getProductBySlug, getProducts } from "@/lib/api/products"
import { getProductReviews } from "@/lib/api/reviews"
import { formatTry } from "@/lib/format"

type ProductMode = "ready_stock" | "made_to_order"

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>
}

// Ürün verisi API'den geliyor; tasarım gunesin-gozyasi-vazo sayfasının birebir kopyası.
export const dynamic = "force-dynamic"

const FALLBACK_IMAGE = "/images/home/collection-ceramic.png"

const subtitleByMode: Record<ProductMode, string> = {
  ready_stock: "El Yapımı Hazır Eser",
  made_to_order: "El Yapımı Siparişe Özel Üretim",
}

const productTypeLabelByMode: Record<ProductMode, string> = {
  ready_stock: "Hazır Eser",
  made_to_order: "Siparişe Özel Üretim",
}

const ctaLabelByMode: Record<ProductMode, string> = {
  ready_stock: "Sepete Ekle",
  made_to_order: "Siparişi Başlat",
}

function clampRating(rating: number): number {
  return Math.max(0, Math.min(5, rating))
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug).catch(() => null)

  if (!product) {
    notFound()
  }

  const [reviews, related] = await Promise.all([
    getProductReviews(product.id).catch(() => []),
    getProducts({ categorySlug: product.categorySlug ?? undefined }).catch(() => []),
  ])

  const productMode: ProductMode = product.salesMode === "MadeToOrder" ? "made_to_order" : "ready_stock"

  const heroImageSrc = product.images.find((image) => image.type === "Hero")?.url ?? product.images[0]?.url ?? FALLBACK_IMAGE
  const heroImageAlt = product.images.find((image) => image.type === "Hero")?.altText ?? product.name
  const thumbnails = product.images.filter((image) => image.type === "Gallery")
  const ownerGalleryPhotos = product.images.filter((image) => image.type === "OwnerGallery")

  const relatedProducts = related.filter((item) => item.slug !== product.slug).slice(0, 4)

  const normalizedReviews = reviews.map((review) => ({
    author: review.userFullName ?? "El Emeği Müşterisi",
    avatarInitial: (review.userFullName ?? "E").charAt(0).toUpperCase(),
    safeRating: clampRating(review.rating),
    isVerifiedBuyer: review.isVerifiedBuyer,
    userExperience: review.comment ?? "",
  }))
  const hasReviews = normalizedReviews.length > 0
  const summaryAverageRating = clampRating(product.reviewAverage)
  const storyText = product.storyContentHtml ? stripHtml(product.storyContentHtml) : product.summary ?? ""
  const artisanHref = product.artisanSlug ? `/artisans/${product.artisanSlug}` : "#"
  const artisanAvatar = product.artisanAvatarUrl?.trim() ? product.artisanAvatarUrl : FALLBACK_IMAGE
  const deliveryText = product.deliveryInfoText ?? ""

  return (
    <div className="space-y-14 pb-10">
      <section className="rounded-2xl border border-primary/10 bg-card shadow-sm">
        <div className="grid grid-cols-1 gap-12 p-6 lg:grid-cols-2 lg:p-8">

          <div className="space-y-6">

            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted shadow-xl">
              <Image src={heroImageSrc} alt={heroImageAlt} fill priority unoptimized className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>

            {thumbnails.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={thumbnail.id}
                    className={`relative aspect-square overflow-hidden rounded-lg ${index === 0 ? "border-2 border-primary/25" : "opacity-70 transition-opacity hover:opacity-100"}`}
                  >
                    <Image src={thumbnail.url} alt={thumbnail.altText ?? product.name} fill unoptimized className="object-cover" sizes="(min-width: 1024px) 140px, 25vw" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-primary/20 p-4 text-center text-xs text-muted-foreground">
                Ek ürün görseli henüz eklenmedi.
              </div>
            )}
          </div>



          <div className="flex flex-col">

            <nav className="mb-4 flex gap-2 text-sm text-muted-foreground">
              <span>Kategori</span>
              <span>/</span>
              <span>{product.categoryName ?? "Tüm Ürünler"}</span>
              <span>/</span>
              <span>{product.name}</span>
            </nav>


            <h2 className="mb-2 text-4xl leading-tight font-black lg:text-5xl">{product.name}</h2>
            <p className="mb-4 text-lg font-semibold text-primary">{subtitleByMode[productMode]}</p>



            <div className="mb-8 flex items-center gap-6 border-y border-primary/10 py-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {
                    productMode === "ready_stock" ?
                    "Üretim Süresi" :
                    "Ortalama Üretim Süresi"
                  }

                </span>
                <span className="mt-1 flex items-center gap-2 text-xl font-bold">
                  <Clock3 className="size-5 text-primary" />
                  {product.productionDurationText ?? "Belirtilmedi"}
                </span>
              </div>
              <div className="h-10 w-px bg-primary/10" />
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Favorilere ekle"
                  className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <Heart className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Paylaş"
                  className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <Share2 className="size-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="leading-relaxed italic text-muted-foreground">
                  {product.quote ?? product.summary ?? ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="min-w-[140px] flex-1 rounded-xl bg-primary/5 p-4">
                  <Leaf className="mb-2 size-5 text-primary" />
                  <h4 className="text-sm font-bold">Malzeme</h4>
                  <p className="text-xs text-muted-foreground">{product.material ?? "—"}</p>
                </div>
                <div className="min-w-[140px] flex-1 rounded-xl bg-primary/5 p-4">
                  <Hammer className="mb-2 size-5 text-primary" />
                  <h4 className="text-sm font-bold">Teknik</h4>
                  <p className="text-xs text-muted-foreground">{product.technique ?? "—"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <div className={`mb-2 flex items-center ${productMode === "ready_stock" ? "justify-between" : "justify-start"}`}>
                  {productMode === "ready_stock" ? <span className="text-3xl font-bold">{formatTry(product.price)}</span> : null}
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">{productTypeLabelByMode[productMode]}</span>
                </div>
                {productMode === "made_to_order" ? (
                  <Link
                    href={`/products/${product.slug}/siparis-baslat`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                  >
                    <ShoppingBag className="size-5" />
                    {ctaLabelByMode[productMode]}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                  >
                    <ShoppingBag className="size-5" />
                    {ctaLabelByMode[productMode]}
                  </button>
                )}
                <ProductReportModal productName={product.name} />
                <p className="text-center text-[10px] tracking-widest text-muted-foreground uppercase">{deliveryText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <article className="space-y-8 lg:col-span-2">
          <h3 className="text-3xl font-black">Eserin Hikayesi</h3>
          <ProductStoryTeaser productSlug={product.slug} fallbackText={storyText} />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-primary">
                <SquareLibrary className="size-5" />
                Yapım Aşaması
              </h4>
              {product.productionSteps.length > 0 ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.productionSteps.map((step) => (
                    <li key={step}>• {step}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Yapım aşaması bilgisi henüz eklenmedi.</p>
              )}
            </div>

            <div className="rounded-xl border border-primary/10 bg-card p-6">
              <h4 className="mb-4 font-bold">Ürün Ölçüleri</h4>
              {productMode === "ready_stock" ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yükseklik</span>
                    <span>{product.heightText ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genişlik</span>
                    <span>{product.widthText ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ağırlık</span>
                    <span>{product.weightText ?? "—"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Ölçüler sipariş detaylarına göre değişebilir. Atölye ekibi, üretim başlamadan önce sizinle birlikte netleştirir.
                </p>
              )}
            </div>
          </div>
        </article>

        <aside className="self-start rounded-2xl border border-primary/10 bg-card p-8 text-center shadow-sm">
          <Link
            href={artisanHref}
            className="mx-auto mb-6 block size-32 overflow-hidden rounded-full border-4 border-primary/20 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Image src={artisanAvatar} alt={product.artisanDisplayName ?? "Zanaatkar"} width={128} height={128} unoptimized className="h-full w-full object-cover" />
          </Link>
          <h3 className="mb-1 text-xl font-bold">
            <Link href={artisanHref} className="transition-colors hover:text-primary">
              {product.artisanDisplayName ?? "Zanaatkar"}
            </Link>
          </h3>
          <p className="mb-4 text-sm font-semibold text-primary italic">{product.artisanCraft ?? "Zanaatkar"}</p>
          {product.artisanBio ? (
            <p className="mb-6 text-sm text-muted-foreground">{product.artisanBio}</p>
          ) : null}

          <div className="flex justify-center gap-8 border-t border-primary/10 pt-6">
            <div>
              <div className="text-lg font-bold">{product.artisanProductCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Eser</div>
            </div>
            <div>
              <div className="text-lg font-bold">{product.artisanRatingAvg.toFixed(1)}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Puan</div>
            </div>
          </div>
        </aside>
      </section>
      <section className="mt-24 mb-20 border-t border-primary/10 pt-16">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-3xl font-black text-stone-900 dark:text-stone-100">Müşteri Yorumları</h2>
            <div className="flex items-center gap-4">
              <div className="flex text-primary">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={`summary-star-${index}`}
                    className={`size-5 ${index < Math.round(summaryAverageRating) ? "fill-primary text-primary" : "text-primary/30"}`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{summaryAverageRating.toFixed(1)} / 5.0</span>
              <span className="text-sm text-stone-500">({product.reviewCount} Değerlendirme)</span>
            </div>
          </div>
          <ExperienceShareModal productName={product.name} />
        </div>

        {ownerGalleryPhotos.length > 0 ? (
          <div className="mb-16">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
              <House className="size-5 text-primary" />
              Evinizden Kareler
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {ownerGalleryPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={photo.url}
                    alt={photo.altText ?? product.name}
                    width={240}
                    height={240}
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {hasReviews ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {normalizedReviews.map((review, index) => (
              <li key={`${review.author}-${index}`} className="space-y-4 rounded-2xl border border-primary/5 bg-white p-8 shadow-sm dark:bg-stone-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">{review.avatarInitial}</div>
                    <div>
                      <div className="font-bold">{review.author}</div>
                      <div className="text-[10px] text-stone-500 uppercase">{review.isVerifiedBuyer ? "Onaylı Alıcı" : "Alıcı"}</div>
                    </div>
                  </div>
                  <div className="flex text-sm text-primary">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={`${review.author}-card-star-${index}`}
                        className={`size-4 ${index < Math.round(review.safeRating) ? "fill-primary text-primary" : "text-primary/30"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{review.userExperience}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-primary/20 bg-card p-4 text-sm text-muted-foreground">Henüz yorum yok.</div>
        )}
      </section>
      <section className="rounded-xl border border-primary/10 bg-card p-6">
        <h4 className="mb-3 flex items-center gap-2 font-bold">
          <ShieldCheck className="size-5 text-primary" />
          İade ve Hasar Politikası Özeti
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Ürün hasarlı ulaştıysa 48 saat içinde bildirimle destek süreci başlatılır.</li>
          <li>• Atölye kaynaklı belirgin üretim kusurlarında onarım veya değişim sağlanır.</li>
          <li>• Özel üretim siparişlerde iade koşulları ürün kişiselleştirme düzeyine göre değerlendirilir.</li>
        </ul>
      </section>
      <section className="space-y-8">
        <h3 className="text-2xl font-bold">Benzer Ruhlu Eserler</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <Link key={item.id} href={`/products/${item.slug}`} className="group cursor-pointer">
              <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
                <Image
                  src={item.primaryImageUrl?.trim() ? item.primaryImageUrl : FALLBACK_IMAGE}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1280px) 280px, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <h4 className="text-sm font-bold">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{formatTry(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
