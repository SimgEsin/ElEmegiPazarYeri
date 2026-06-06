"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Input } from "@/components/ui/input"
import { getProducts } from "@/lib/api/products"
import { getArtisanProfiles } from "@/lib/api/artisans"
import { formatTry } from "@/lib/format"
import type { ArtisanProfile, ProductListItem } from "@/lib/api/types"

const MIN_CHARS = 2
const DEBOUNCE_MS = 300
const MAX_PRODUCTS = 5
const MAX_ARTISANS = 4

function matchesArtisan(artisan: ArtisanProfile, lowerQuery: string): boolean {
  return [artisan.displayName, artisan.craft, artisan.city]
    .join(" ")
    .toLocaleLowerCase("tr-TR")
    .includes(lowerQuery)
}

export function HeaderSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  // Zanaatkar listesi tek sefer çekilip önbelleğe alınır; her tuş vuruşunda
  // ağ isteği yapmak yerine bu liste istemci tarafında filtrelenir.
  const artisansCacheRef = useRef<ArtisanProfile[] | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < MIN_CHARS) {
      setProducts([])
      setArtisans([])
      setLoading(false)
      return
    }

    setLoading(true)
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const ensureArtisans = async () => {
          if (artisansCacheRef.current) {
            return artisansCacheRef.current
          }
          const data = await getArtisanProfiles({ signal: controller.signal })
          artisansCacheRef.current = data
          return data
        }

        const [productResults, allArtisans] = await Promise.all([
          getProducts({ search: trimmed, status: "Published" }, { signal: controller.signal }),
          ensureArtisans(),
        ])

        if (controller.signal.aborted) {
          return
        }

        const lowerQuery = trimmed.toLocaleLowerCase("tr-TR")
        setProducts(productResults.slice(0, MAX_PRODUCTS))
        setArtisans(allArtisans.filter((artisan) => matchesArtisan(artisan, lowerQuery)).slice(0, MAX_ARTISANS))
        setLoading(false)
      } catch {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const goToSearchPage = () => {
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    goToSearchPage()
  }

  const trimmedQuery = query.trim()
  const hasResults = products.length > 0 || artisans.length > 0
  const showDropdown = open && trimmedQuery.length >= MIN_CHARS

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <form
        className="group flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 transition-colors hover:border-primary/30 focus-within:border-primary/50"
        role="search"
        onSubmit={handleSubmit}
      >
        <button
          type="submit"
          aria-label="Ara"
          className="inline-flex size-5 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary"
        >
          <Search className="size-3.5" strokeWidth={2.25} />
        </button>
        <Input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false)
            }
          }}
          autoComplete="off"
          className="h-auto w-40 border-none bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground/80 focus:placeholder:text-transparent focus-visible:ring-0 md:w-52 lg:w-60"
          placeholder="Zanaatkar veya ürün ara..."
          aria-label="Ürün veya zanaatkar ara"
        />
      </form>

      {showDropdown ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg lg:w-96">
          {loading && !hasResults ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">Aranıyor…</p>
          ) : null}

          {!loading && !hasResults ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              “{trimmedQuery}” için sonuç bulunamadı.
            </p>
          ) : null}

          {products.length > 0 ? (
            <div className="border-b border-border py-1.5">
              <p className="px-4 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Ürünler</p>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/60"
                >
                  <span className="min-w-0 truncate font-medium">{product.name}</span>
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                    {product.salesMode === "MadeToOrder" ? "Siparişe özel" : formatTry(product.price)}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}

          {artisans.length > 0 ? (
            <div className="border-b border-border py-1.5">
              <p className="px-4 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Zanaatkarlar</p>
              {artisans.map((artisan) => (
                <Link
                  key={artisan.id}
                  href={`/artisans/${artisan.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/60"
                >
                  <span className="min-w-0 truncate font-medium">{artisan.displayName}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{artisan.craft}</span>
                </Link>
              ))}
            </div>
          ) : null}

          {hasResults ? (
            <button
              type="button"
              onClick={goToSearchPage}
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-primary transition-colors hover:bg-muted/60"
            >
              “{trimmedQuery}” için tüm sonuçları gör
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
