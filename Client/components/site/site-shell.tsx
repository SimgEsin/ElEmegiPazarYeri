"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Search, Send, ShoppingBag, Store } from "lucide-react"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getIsLoggedInSnapshot,
  getServerIsLoggedInSnapshot,
  getServerUserTypeSnapshot,
  getUserTypeSnapshot,
  setIsLoggedIn,
  setUserType,
  subscribeToIsLoggedIn,
  subscribeToUserType,
  type UserType,
} from "@/lib/auth-storage"

const primaryLinks = [
  { href: "/categories", label: "Kategoriler" },
  { href: "/stories", label: "Hikayeler" },
]

const userTypeOptions: { value: UserType; label: string }[] = [
  { value: "customer", label: "Müşteri" },
  { value: "artisan", label: "Zanaatkar" },
  { value: "admin", label: "Admin" },
]

const footerGroups = [
  {
    title: "Keşfet",
    links: [
      { href: "/new", label: "Yeni Eklenenler" },
      { href: "/artisans", label: "Popüler Zanaatkarlar" },
      { href: "/stories", label: "Hikaye Arşivi" },
      { href: "/gift-guide", label: "Hediye Rehberi" },
    ],
  },
  {
    title: "Topluluk",
    links: [
      { href: "/join-artisan", label: "Zanaatkar Ol" },
      { href: "/workshop-registration", label: "Atölye Kaydı" },
      { href: "/blog", label: "Blog" },
      { href: "/sustainability", label: "Sürdürülebilirlik" },
    ],
  },
]

const legalLinks = [
  { href: "/terms", label: "Kullanım Koşulları" },
  { href: "/privacy", label: "Gizlilik Politikası" },
  { href: "/cookies", label: "Çerezler" },
]

const profileImage =
  "/images/home/profile.png"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()
  const isLoggedIn = useSyncExternalStore(
    subscribeToIsLoggedIn,
    getIsLoggedInSnapshot,
    getServerIsLoggedInSnapshot,
  )
  const userType = useSyncExternalStore(
    subscribeToUserType,
    getUserTypeSnapshot,
    getServerUserTypeSnapshot,
  )
  const isAdmin = userType === "admin"
  const isArtisan = userType === "artisan"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-12">
              <Link href="/" className="inline-flex items-center gap-2.5 text-primary">
                <Image src="/logo.svg" alt="El Emeği logosu" width={32} height={32} className="size-8" priority />
                <span className="whitespace-nowrap text-[1.15rem] font-semibold tracking-tight text-foreground">El Emeği</span>
              </Link>

              <nav className="hidden items-center gap-7 md:flex">
                {primaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-5">
              <form
                className="group hidden items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 transition-colors hover:border-primary/30 focus-within:border-primary/50 sm:flex"
                role="search"
                action="#"
              >
                <span className="inline-flex size-5 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Search className="size-3.5" strokeWidth={2.25} />
                </span>
                <Input
                  className="h-auto w-40 border-none bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground/80 focus:placeholder:text-transparent focus-visible:ring-0 md:w-52 lg:w-60"
                  placeholder="Zanaatkar veya ürün ara..."
                  aria-label="Ürün veya zanaatkar ara"
                />
              </form>

              <div className="flex gap-1.5">
                <label className="flex items-center gap-2 rounded-full border border-input bg-background px-2.5 py-1.5 text-muted-foreground transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
                  <span className="hidden text-xs font-medium sm:inline">Kullanıcı Türü</span>
                  <select
                    aria-label="Kullanıcı türü seç"
                    value={userType}
                    onChange={(event) => setUserType(event.target.value as UserType)}
                    className="min-w-0 bg-transparent text-xs font-medium text-foreground outline-none sm:text-sm"
                  >
                    {userTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                {isAdmin ? (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full px-2 text-muted-foreground hover:text-foreground sm:px-3"
                  >
                    <Link href="/admin-panel" aria-label="Admin Paneli">
                      <span className="hidden sm:inline">Admin Paneli</span>
                      <span className="sm:hidden">Admin</span>
                    </Link>
                  </Button>
                ) : null}
                {isArtisan ? (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full px-2 text-muted-foreground hover:text-foreground sm:px-3"
                  >
                    <Link href="/artisan-panel" aria-label="Zanaatkar Paneli">
                      <Store className="size-4" />
                      <span className="hidden sm:inline">Zanaatkar Paneli</span>
                      <span className="sm:hidden">Panel</span>
                    </Link>
                  </Button>
                ) : null}
                <Button
                  asChild
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <Link href="/cart" aria-label="Sepet">
                    <ShoppingBag />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <Link href="/favorites" aria-label="Favoriler">
                    <Heart />
                  </Link>
                </Button>
              </div>

              {isLoggedIn ? (
                <Link href="/profile" className="hidden size-9 overflow-hidden rounded-full border border-border bg-muted/40 transition-shadow hover:shadow-md sm:block">
                  <Image src={profileImage} alt="Gülümseyen kullanıcı profil fotoğrafı." width={40} height={40} />
                </Link>
              ) : (
                <Link
                  href="/"
                  onClick={() => setIsLoggedIn(true)}
                  className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
                >
                  Giriş yap
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-background md:hidden">
          <nav className="no-scrollbar mx-auto flex w-full max-w-7xl items-center gap-5 overflow-x-auto px-4 py-2.5 text-sm sm:px-6">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>

      <footer className="border-t border-primary/10 bg-card/60 py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-primary">
              <Image src="/logo.svg" alt="El Emeği logosu" width={32} height={32} className="size-8" />
              <span className="text-xl font-bold tracking-tight">El Emeği</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Gerçek hikayesi olan ürünlerin, gerçek ustalar tarafından üretildiği butik bir pazar yeri.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-bold">{group.title}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <h2 className="text-sm font-bold">Bülten</h2>
            <p className="text-xs text-muted-foreground">Ustalardan hikayeler ve özel kategoriler posta kutunuzda.</p>
            <form className="flex gap-2" action="#">
              <Input type="email" placeholder="E-posta adresi" aria-label="E-posta adresi" />
              <Button type="submit" size="icon" aria-label="Bültene kaydol">
                <Send />
              </Button>
            </form>
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-primary/10 px-4 pt-8 text-xs text-muted-foreground sm:px-6 md:flex-row lg:px-8">
          <p>© {year} El Emeği. Her parça bir hikaye anlatır.</p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
