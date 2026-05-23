import type { Metadata } from "next"
import Image from "next/image"
import {
  ArrowRight,
  Ellipsis,
  Home,
  MapPin,
  MessageCircle,
  Palette,
  Share2,
  ShoppingCart,
  Star,
  User,
  Verified,
} from "lucide-react"

import { ArtisanStoriesSection } from "@/components/site/artisan-stories-section"

const profileImage = {
  src: "/images/artisans/zeynep-yilmaz/profile.jpg",
  alt: "Gülümseyen kadın sanatçı portresi.",
}

const studioGallery = [
  {
    src: "/images/artisans/zeynep-yilmaz/studio-1.jpg",
    alt: "Atölyede seramik çarkında çalışan eller.",
  },
  {
    src: "/images/artisans/zeynep-yilmaz/studio-2.jpg",
    alt: "Atölye rafında kuruyan el yapımı vazolar.",
  },
  {
    src: "/images/artisans/zeynep-yilmaz/studio-3.jpg",
    alt: "Seramik boyama yapan sanatçının detay çekimi.",
  },
  {
    src: "/images/artisans/zeynep-yilmaz/studio-4.jpg",
    alt: "Atölyenin güneş alan masası ve araç gereçler.",
  },
]

const listings = [
  {
    title: "Toprak Tonlu El Yapımı Kase",
    price: "₺450",
    tag: "Yeni",
    description: "Mat dokulu, gıda ile temasa uygun, her biri benzersiz formda.",
    imageSrc: "/images/artisans/zeynep-yilmaz/product-1.jpg",
    imageAlt: "Mavi desenli modern seramik kase.",
  },
  {
    title: "Zen Serisi Vazo Takımı",
    price: "₺1.200",
    tag: "Sınırlı Sayıda",
    description: "3'lü set halinde sunulan, ince işçilikli modern dekoratif vazolar.",
    imageSrc: "/images/artisans/zeynep-yilmaz/product-2.jpg",
    imageAlt: "Minimalist beyaz porselen vazo seti.",
  },
]

export const metadata: Metadata = {
  title: "Üretici Profili | El Emeği Sanat",
  description: "Zeynep Yılmaz üretici profil ve güncel kategori sayfası.",
}

export default function ZeynepYilmazPage() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <section className="rounded-2xl border border-primary/10 bg-card shadow-sm">
        <header className="sticky top-20 z-20 flex items-center justify-between border-b border-primary/10 bg-background/80 px-4 py-4 backdrop-blur-md md:px-8">
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Profili paylaş"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              <Share2 className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Daha fazla"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              <Ellipsis className="size-5" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-4xl p-4 md:p-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="relative">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 shadow-xl md:h-40 md:w-40">
                <Image src={profileImage.src} alt={profileImage.alt} fill className="object-cover" sizes="160px" priority />
              </div>
              <div className="absolute right-2 bottom-1 rounded-full bg-primary p-1.5 text-white shadow-lg">
                <Verified className="size-4" />
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight">Zeynep Yılmaz</h2>
            <p className="mt-1 font-medium text-primary">Geleneksel Seramik Sanatçısı</p>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span>İstanbul, Türkiye</span>
            </div>

            <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-4">
              <button
                type="button"
                className="h-12 rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Takip Et
              </button>
              <button
                type="button"
                className="h-12 rounded-xl bg-primary/10 text-base font-bold text-primary transition-colors hover:bg-primary/20"
              >
                Mesaj Gönder
              </button>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-primary/10 bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-white/5">
              <p className="text-2xl font-bold">1.2k</p>
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Takipçi</p>
            </div>
            <div className="rounded-xl border border-primary/10 bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-white/5">
              <p className="text-2xl font-bold">48</p>
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Ürünler</p>
            </div>
            <div className="rounded-xl border border-primary/10 bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-white/5">
              <p className="text-2xl font-bold">4.9</p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <Star className="size-3.5 fill-primary text-primary" />
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Puan</p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold">
              Hikayem
            </h3>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                Toprakla tanışmam çocukluk yıllarıma, Anadolu&apos;nun kalbindeki dedemin küçük atölyesine dayanıyor. Çamurun ellerimin arasından kayıp
                giden o eşsiz dokusu, hayat boyu sürecek tutkumun başlangıcı oldu.
              </p>
              <p>
                Her bir parçada modern minimalizm ile geleneksel motifleri harmanlayarak, evinize sadece bir objeyi değil, bir hikayeyi taşımayı
                hedefliyorum. Sürdürülebilir yöntemler ve doğal boyalar kullanarak doğaya saygılı bir üretim sürecini benimsiyorum.
              </p>
            </div>
          </section>

          <ArtisanStoriesSection artisanSlug="zeynep-yilmaz" />

          <section className="mb-12">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Mutfaktan Kareler</h3>
              <p className="text-muted-foreground">Üretim sürecine ve atölyeme yakından bir bakış.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {studioGallery.map((item) => (
                <article key={item.src} className="group overflow-hidden rounded-xl shadow-md">
                  <div className="relative aspect-square">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Zanaatlerim</h3>
              <button type="button" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                Tümünü Gör
                <ArrowRight className="size-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {listings.map((listing, index) => (
                <article
                  key={listing.title}
                  className="group overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-background/40"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={listing.imageSrc}
                      alt={listing.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <span
                      className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white uppercase ${
                        index === 0 ? "bg-primary" : "bg-slate-900"
                      }`}
                    >
                      {listing.tag}
                    </span>
                    <button
                      type="button"
                      aria-label="Favorilere ekle"
                      className="absolute top-4 right-4 rounded-full bg-white/80 p-2 text-primary backdrop-blur-sm dark:bg-background/80"
                    >
                      <Star className="size-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <h4 className="text-lg font-bold">{listing.title}</h4>
                      <p className="font-bold text-primary">{listing.price}</p>
                    </div>
                    <p className="mb-6 text-sm text-muted-foreground">{listing.description}</p>
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white transition-colors hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90"
                    >
                      <ShoppingCart className="size-5" />
                      Sepete Ekle
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <footer className="fixed right-0 bottom-0 left-0 z-30 border-t border-primary/10 bg-background px-6 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Home className="size-5" />
            <span className="text-[10px] font-bold">Keşfet</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Palette className="size-5" />
            <span className="text-[10px] font-bold">Atölyeler</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <MessageCircle className="size-5" />
            <span className="text-[10px] font-bold">Mesajlar</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary">
            <User className="size-5" />
            <span className="text-[10px] font-bold">Profil</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
