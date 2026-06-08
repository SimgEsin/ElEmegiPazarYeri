import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Ellipsis, MapPin, Share2, ShoppingCart, Verified } from "lucide-react"

import { ArtisanStoriesSection } from "@/components/site/artisan-stories-section"
import { ArtisanActions } from "@/app/artisans/[slug]/artisan-actions"
import { getArtisanProfileBySlug } from "@/lib/api/artisans"
import { getProducts } from "@/lib/api/products"
import { formatTry } from "@/lib/format"

type ArtisanDetailPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

const FALLBACK_AVATAR = "/images/home/collection-ceramic.png"
const FALLBACK_PRODUCT_IMAGE = "/images/home/collection-ceramic.png"

export default async function ArtisanDetailPage({ params }: ArtisanDetailPageProps) {
  const { slug } = await params

  const profile = await getArtisanProfileBySlug(slug).catch(() => null)

  if (!profile) {
    notFound()
  }

  const listings = await getProducts({ artisanId: profile.userId }).catch(() => [])

  const avatarSrc = profile.avatarUrl?.trim() ? profile.avatarUrl : FALLBACK_AVATAR
  const galleryImages = [...profile.galleryImages].sort((a, b) => a.sortOrder - b.sortOrder)

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
                <Image src={avatarSrc} alt={`${profile.displayName} portresi`} fill unoptimized className="object-cover" sizes="160px" priority />
              </div>
              {profile.isVerified ? (
                <div className="absolute right-2 bottom-1 rounded-full bg-primary p-1.5 text-white shadow-lg">
                  <Verified className="size-4" />
                </div>
              ) : null}
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight">{profile.displayName}</h2>
            <p className="mt-1 font-medium text-primary">{profile.craft}</p>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span>{profile.city}</span>
            </div>

            <ArtisanActions
              artisanProfileId={profile.id}
              artisanUserId={profile.userId}
              artisanName={profile.displayName}
              followerCount={profile.followerCount}
              productCount={profile.productCount}
              ratingAvg={profile.ratingAvg}
              products={listings.map((listing) => ({ id: listing.id, name: listing.name }))}
            />
          </div>

          {profile.bio?.trim() ? (
            <section className="mb-12">
              <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold">Hikayem</h3>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>{profile.bio}</p>
              </div>
            </section>
          ) : null}

          <ArtisanStoriesSection artisanSlug={profile.slug} />

          {galleryImages.length > 0 ? (
            <section className="mb-12">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Atölyeden Kareler</h3>
                <p className="text-muted-foreground">Üretim sürecine ve atölyeye yakından bir bakış.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {galleryImages.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-xl shadow-md">
                    <div className="relative aspect-square">
                      <Image
                        src={item.url}
                        alt={item.altText ?? `${profile.displayName} atölye görseli`}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 768px) 25vw, 50vw"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Zanaatlerim</h3>
            </div>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/products/${listing.slug}`}
                    className="group overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-background/40"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={listing.primaryImageUrl?.trim() ? listing.primaryImageUrl : FALLBACK_PRODUCT_IMAGE}
                        alt={listing.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                      {listing.isSoldOut ? (
                        <span className="absolute top-4 left-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
                          Tükendi
                        </span>
                      ) : null}
                    </div>

                    <div className="p-6">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h4 className="text-lg font-bold">{listing.name}</h4>
                        <p className="font-bold text-primary">{formatTry(listing.price)}</p>
                      </div>
                      {listing.summary ? <p className="mb-6 text-sm text-muted-foreground">{listing.summary}</p> : null}
                      <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white transition-colors group-hover:bg-slate-800 dark:bg-primary dark:group-hover:bg-primary/90">
                        <ShoppingCart className="size-5" />
                        Ürünü İncele
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-primary/20 bg-card p-4 text-sm text-muted-foreground">
                Bu zanaatkarın henüz yayında ürünü yok.
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
