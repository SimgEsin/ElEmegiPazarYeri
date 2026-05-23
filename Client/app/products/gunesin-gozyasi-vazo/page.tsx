import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Clock3, Hammer, Heart, House, Leaf, Share2, ShieldCheck, ShoppingBag, SquareLibrary, Star } from "lucide-react"

import { ProductStoryTeaser } from "@/components/site/product-story-teaser"
import { ExperienceShareModal } from "@/components/site/experience-share-modal"
import { ProductReportModal } from "@/components/site/product-report-modal"

const productImages = {
  hero: {
    src: "/images/products/gunesin-gozyasi-vazo/hero.jpg",
    alt: "Turuncu sır detayına sahip el yapımı seramik vazonun yakın plan görüntüsü.",
  },
  thumbnails: [
    {
      src: "/images/products/gunesin-gozyasi-vazo/thumb-texture.jpg",
      alt: "Seramik yüzey dokusunun detay görüntüsü.",
    },
    {
      src: "/images/products/gunesin-gozyasi-vazo/thumb-wheel.jpg",
      alt: "Çömlekçi çarkında kil şekillendirme anı.",
    },
    {
      src: "/images/products/gunesin-gozyasi-vazo/thumb-kiln.jpg",
      alt: "Fırınlama sürecinden bir kare.",
    },
    {
      src: "/images/products/gunesin-gozyasi-vazo/thumb-painting.jpg",
      alt: "Vazonun elde boyanma aşaması.",
    },
  ],
  artisan: {
    src: "/images/products/gunesin-gozyasi-vazo/artisan-elif.jpg",
    alt: "Seramik sanatçısı Elif Taner'in portresi.",
  },
}

type ProductMode = "ready_stock" | "made_to_order"

type ProductReview = {
  author: string
  avatarInitial: string
  rating: number
  isVerifiedBuyer: boolean
  userExperience: string
}

type ProductDetail = {
  mode?: string
  title: string
  subtitleByMode: Record<ProductMode, string>
  summary: string
  quote: string
  story: string
  material: string
  technique: string
  productionDuration: string
  handcraftDuration: string
  deliveryByMode: Record<ProductMode, string>
  price?: string
  dimensions: {
    height: string
    width: string
    weight: string
  }
  reviewSummary: {
    averageRating: number
    totalCount: number
  }
  reviews: ProductReview[]
}

const relatedProducts = [
  {
    title: "Mini Toprak Kase",
    price: "850 TL",
    imageSrc: "/images/products/gunesin-gozyasi-vazo/related-mini-kase.jpg",
    imageAlt: "El yapımı küçük toprak kase.",
  },
  {
    title: "Deniz Kabuğu Kupa",
    price: "540 TL",
    imageSrc: "/images/products/gunesin-gozyasi-vazo/related-deniz-kup.jpg",
    imageAlt: "Mavi sırla kaplanmış seramik kupa.",
  },
  {
    title: "Terra Tabak Seti",
    price: "1,200 TL",
    imageSrc: "/images/products/gunesin-gozyasi-vazo/related-terra-tabak.jpg",
    imageAlt: "Toprak tonlarında seramik tabak seti.",
  },
  {
    title: "Sütun Vazo",
    price: "1,950 TL",
    imageSrc: "/images/products/gunesin-gozyasi-vazo/related-sutun-vazo.jpg",
    imageAlt: "Uzun ve dar formlu seramik sütun vazo.",
  },
]

const productionSteps = [
  "Kilin 3 gün boyunca dinlendirilmesi",
  "El çarkında 4 saatlik form verme süreci",
  "1 hafta yavaş kurutma işlemi",
  "İlk pişirim (Bisküvi) - 900 derece",
  "Elde boyama ve daldırma sırlama",
  "Final pişirim - 1220 derece",
]

const ownerGalleryPhotos = [
  {
    src: "/images/products/gunesin-gozyasi-vazo/hero.jpg",
    alt: "Güneşin Gözyaşı Vazo'nun oturma odasında sergilendiği kullanıcı fotoğrafı.",
  },
  {
    src: "/images/products/gunesin-gozyasi-vazo/thumb-texture.jpg",
    alt: "Vazonun kullanıcı evinde çekilmiş doku detayı.",
  },
  {
    src: "/images/products/gunesin-gozyasi-vazo/thumb-wheel.jpg",
    alt: "Vazonun kitaplık üzerinde kullanıldığı kullanıcı karesi.",
  },
  {
    src: "/images/products/gunesin-gozyasi-vazo/thumb-kiln.jpg",
    alt: "Vazonun yemek masası orta dekoru olarak kullanıldığı fotoğraf.",
  },
  {
    src: "/images/products/gunesin-gozyasi-vazo/related-mini-kase.jpg",
    alt: "Vazo ile birlikte kullanılan seramik ürünlerden kullanıcı paylaşımı.",
  },
  {
    src: "/images/products/gunesin-gozyasi-vazo/related-sutun-vazo.jpg",
    alt: "Güneş ışığında vazonun formunu gösteren kullanıcı fotoğrafı.",
  },
]

const productDetail: ProductDetail = {
  mode: "made_to_order",
  title: "Güneşin Gözyaşı Vazo",
  subtitleByMode: {
    ready_stock: "El Yapımı Hazır Eser",
    made_to_order: "El Yapımı Siparişe Özel Üretim",
  },
  summary: "Kapadokya toprağından üretilen, her biri tekil desen taşıyan el yapımı seramik vazo.",
  quote:
    "\"Bu eser, sadece çamur ve sudan ibaret değil. Her bir kıvrımında parmak izlerimi, her bir fırça darbesinde Anadolu'nun kızıl topraklarının hikayesini bulacaksınız. Kusursuz değil, yaşayan bir parça.\"",
  story:
    "Kapadokya'nın kalbinde, güneşin batarken kızıla boyadığı o eşsiz anı yakalamak istedik. Bu vazo, geleneksel yöntemlerle 1200 derecelik fırınlarda pişen toprağın, modern formlarla buluşmasını temsil eder. Sır tekniğimizde kullandığımız doğal mineraller, her üründe farklı bir desen oluşturarak aldığınız parçayı dünyada eşsiz kılar.",
  material: "Avanos Kızıl Kili",
  technique: "Geleneksel Çark ve Sırlama",
  productionDuration: "18 Gün",
  handcraftDuration: "54 Saat",
  deliveryByMode: {
    ready_stock: "Tahmini teslimat: 3-5 iş günü",
    made_to_order: "Tahmini teslimat: 25-30 gün",
  },
  price: "2,450 TL",
  dimensions: {
    height: "32 cm",
    width: "22 cm",
    weight: "1.4 kg",
  },
  reviewSummary: {
    averageRating: 4.9,
    totalCount: 24,
  },
  reviews: [
    {
      author: "Aslı K.",
      avatarInitial: "A",
      rating: 5,
      isVerifiedBuyer: true,
      userExperience:
        "\"Vazoyu elime aldığımda o toprağın kokusunu ve sıcaklığını hissettim. Salonumun en güzel köşesine yerleşti, sanki hep oradaymış gibi. Elif Hanım yapım aşamasında bir fotoğraf paylaştı; bu bağı hissetmek çok özel ve gerçek bir sanat eserine sahip olduğumu hissettiriyor.\"",
    },
    {
      author: "Murat T.",
      avatarInitial: "M",
      rating: 5,
      isVerifiedBuyer: true,
      userExperience:
        "\"Modern bir evimiz var ama bu vazo o kadar zamansız ki her tarza uyum sağlıyor. Sırın üzerindeki dokular büyüleyici, paketleme de bir sanat eseri gibiydi; her detay düşünülmüş ve beklediğim süreye fazlasıyla değdi.\"",
    },
  ],
}

const productTypeLabelByMode: Record<ProductMode, string> = {
  ready_stock: "Hazır Eser",
  made_to_order: "Siparişe Özel Üretim",
}

const ctaLabelByMode: Record<ProductMode, string> = {
  ready_stock: "Sepete Ekle",
  made_to_order: "Siparişi Başlat",
}

const artisanProfileHref = "/artisans/zeynep-yilmaz"

export const metadata: Metadata = {
  title: "Anadolu Esintisi - El Yapımı Seramik Vazo",
  description: "Güneşin Gözyaşı Vazo ürün detay sayfası.",
}

function isProductMode(mode: string | undefined): mode is ProductMode {
  return mode === "ready_stock" || mode === "made_to_order"
}

function clampRating(rating: number): number {
  return Math.max(0, Math.min(5, rating))
}

export default function GunesinGozyasiVazoPage() {
  if (!isProductMode(productDetail.mode)) {
    return (
      <section className="rounded-2xl border border-primary/10 bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Ürün bilgisi eksik</h1>
        <p className="mt-2 text-sm text-muted-foreground">Bu ürün için satış modu tanımlı değil.</p>
      </section>
    )
  }

  const productMode = productDetail.mode
  const fallbackImageSrc = "/images/home/collection-ceramic.png"
  const heroImageSrc = productImages.hero.src || fallbackImageSrc
  const heroImageAlt = productImages.hero.alt || "Ürün görseli"
  const normalizedReviews = productDetail.reviews.map((review) => ({
    ...review,
    safeRating: clampRating(review.rating),
  }))
  const hasReviews = normalizedReviews.length > 0
  const summaryAverageRating = clampRating(productDetail.reviewSummary.averageRating)
  const storyText = productDetail.story || productDetail.summary

  return (
    <div className="space-y-14 pb-10">
      <section className="rounded-2xl border border-primary/10 bg-card shadow-sm">
        <div className="grid grid-cols-1 gap-12 p-6 lg:grid-cols-2 lg:p-8">

          <div className="space-y-6">

            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted shadow-xl">
              <Image src={heroImageSrc} alt={heroImageAlt} fill priority className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>

            {productImages.thumbnails.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {productImages.thumbnails.map((thumbnail, index) => (
                  <div
                    key={thumbnail.src}
                    className={`relative aspect-square overflow-hidden rounded-lg ${index === 0 ? "border-2 border-primary/25" : "opacity-70 transition-opacity hover:opacity-100"}`}
                  >
                    <Image src={thumbnail.src} alt={thumbnail.alt} fill className="object-cover" sizes="(min-width: 1024px) 140px, 25vw" />
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
              <span>Toprak Serisi</span>
              <span>/</span>
              <span>Vazo</span>
            </nav>


            <h2 className="mb-2 text-4xl leading-tight font-black lg:text-5xl">{productDetail.title}</h2>
            <p className="mb-4 text-lg font-semibold text-primary">{productDetail.subtitleByMode[productMode]}</p>



            <div className="mb-8 flex items-center gap-6 border-y border-primary/10 py-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {
                    productDetail.mode == "ready_stock" ?
                    "Üretim Süresi" :
                    "Ortalama Üretim Süresi"
                  }
                  
                </span>
                <span className="mt-1 flex items-center gap-2 text-xl font-bold">
                  <Clock3 className="size-5 text-primary" />
                  {productDetail.productionDuration}
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
                  {productDetail.quote}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="min-w-[140px] flex-1 rounded-xl bg-primary/5 p-4">
                  <Leaf className="mb-2 size-5 text-primary" />
                  <h4 className="text-sm font-bold">Malzeme</h4>
                  <p className="text-xs text-muted-foreground">{productDetail.material}</p>
                </div>
                <div className="min-w-[140px] flex-1 rounded-xl bg-primary/5 p-4">
                  <Hammer className="mb-2 size-5 text-primary" />
                  <h4 className="text-sm font-bold">Teknik</h4>
                  <p className="text-xs text-muted-foreground">{productDetail.technique}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <div className={`mb-2 flex items-center ${productMode === "ready_stock" ? "justify-between" : "justify-start"}`}>
                  {productMode === "ready_stock" && productDetail.price ? <span className="text-3xl font-bold">{productDetail.price}</span> : null}
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">{productTypeLabelByMode[productMode]}</span>
                </div>
                {productMode === "made_to_order" ? (
                  <Link
                    href="/products/gunesin-gozyasi-vazo/siparis-baslat"
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
                <ProductReportModal productName={productDetail.title} />
                <p className="text-center text-[10px] tracking-widest text-muted-foreground uppercase">{productDetail.deliveryByMode[productMode]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <article className="space-y-8 lg:col-span-2">
          <h3 className="text-3xl font-black">Eserin Hikayesi</h3>
          <ProductStoryTeaser productSlug="gunesin-gozyasi-vazo" fallbackText={storyText} />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-primary">
                <SquareLibrary className="size-5" />
                Yapım Aşaması
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {productionSteps.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-primary/10 bg-card p-6">
              <h4 className="mb-4 font-bold">Ürün Ölçüleri</h4>
              {productMode === "ready_stock" ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yükseklik</span>
                    <span>{productDetail.dimensions.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genişlik</span>
                    <span>{productDetail.dimensions.width}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ağırlık</span>
                    <span>{productDetail.dimensions.weight}</span>
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
            href={artisanProfileHref}
            className="mx-auto mb-6 block size-32 overflow-hidden rounded-full border-4 border-primary/20 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Image src={productImages.artisan.src} alt={productImages.artisan.alt} width={128} height={128} className="h-full w-full object-cover" />
          </Link>
          <h3 className="mb-1 text-xl font-bold">
            <Link href={artisanProfileHref} className="transition-colors hover:text-primary">
              Elif Taner
            </Link>
          </h3>
          <p className="mb-4 text-sm font-semibold text-primary italic">Seramik Sanatçısı</p>
          <p className="mb-6 text-sm text-muted-foreground">
            &quot;15 yıldır toprakla konuşuyorum. Her eserimde bir parça huzur ve doğanın ham enerjisini evinize getirmeyi amaçlıyorum.&quot;
          </p>

          <div className="flex justify-center gap-8 border-t border-primary/10 pt-6">
            <div>
              <div className="text-lg font-bold">142</div>
              <div className="text-[10px] text-muted-foreground uppercase">Eser</div>
            </div>
            <div>
              <div className="text-lg font-bold">4.9</div>
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
              <span className="text-sm text-stone-500">({productDetail.reviewSummary.totalCount} Değerlendirme)</span>
            </div>
          </div>
          <ExperienceShareModal productName={productDetail.title} />
        </div>

        <div className="mb-16">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
            <House className="size-5 text-primary" />
            Evinizden Kareler
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {ownerGalleryPhotos.map((photo) => (
              <div key={photo.src} className="aspect-square overflow-hidden rounded-xl bg-muted">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={240}
                  height={240}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>

        {hasReviews ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {normalizedReviews.map((review) => (
              <li key={`${review.author}-${review.userExperience}`} className="space-y-4 rounded-2xl border border-primary/5 bg-white p-8 shadow-sm dark:bg-stone-800/50">
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
          {relatedProducts.map((product) => (
            <article key={product.title} className="group cursor-pointer">
              <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1280px) 280px, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <h4 className="text-sm font-bold">{product.title}</h4>
              <p className="text-xs text-muted-foreground">{product.price}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
