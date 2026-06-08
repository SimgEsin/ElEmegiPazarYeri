"use client"

import Link from "next/link"
import { BadgeCheck, Ban, CheckCheck, Compass, Eye, ShieldCheck, UserPlus2, X } from "lucide-react"

import type { ArtisanProfile } from "@/lib/api/types"
import type { WorkshopApplication } from "@/lib/api/workshop-applications"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ArtisanManagementModuleProps = {
  artisans: ArtisanProfile[]
  applications: WorkshopApplication[]
  onBanArtisan: (artisanId: string) => void
  onApproveApplication: (application: WorkshopApplication) => void
  onRejectApplication: (application: WorkshopApplication) => void
}

function isPendingStatus(status: string) {
  return status.toLocaleLowerCase("en-US") === "pending"
}

export default function ArtisanManagementModule({
  artisans,
  applications,
  onBanArtisan,
  onApproveApplication,
  onRejectApplication,
}: ArtisanManagementModuleProps) {
  const pendingApplications = applications.filter((application) => isPendingStatus(application.status))
  const verifiedCount = artisans.filter((artisan) => artisan.isVerified).length

  const artisanStats = [
    { label: "Aktif zanaatkar", value: artisans.length, detail: "Platformda kayıtlı zanaatkar hesapları", icon: BadgeCheck },
    { label: "Başvuru kuyruğu", value: pendingApplications.length, detail: "Onay veya red kararı bekleyen başvurular", icon: UserPlus2 },
    { label: "Doğrulanmış hesap", value: verifiedCount, detail: "Doğrulama rozeti verilmiş zanaatkarlar", icon: ShieldCheck },
  ]

  function artisanNameForProfile(artisanProfileId: string) {
    return artisans.find((artisan) => artisan.id === artisanProfileId)?.displayName ?? "Başvuru sahibi"
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        {artisanStats.map((item) => {
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

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="border-primary/10 bg-background/85">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Zanaatkar Hesapları</CardTitle>
                <CardDescription>Adminin görüntüleme ve yasaklama aksiyonu uygulayabildiği hesap görünümü.</CardDescription>
              </div>
              <Badge variant="secondary" className="border border-primary/10 bg-primary/10 text-primary">
                Yönetici Denetimi
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {artisans.length > 0 ? (
              artisans.map((artisan) => (
                <div key={artisan.id} className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{artisan.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {artisan.city} • {artisan.craft}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-primary/15 bg-background/80">
                      {artisan.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild type="button" variant="outline" size="sm">
                      <Link href={`/artisans/${artisan.slug}`}>
                        <Eye className="size-4" />
                        Zanaatkarı Görüntüle
                      </Link>
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => onBanArtisan(artisan.id)}>
                      <Ban className="size-4" />
                      Zanaatkarı Yasakla
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-primary/15 bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
                Kayıtlı zanaatkar hesabı bulunamadı.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-primary/[0.04]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Compass className="size-5" />
              </span>
              <div>
                <CardTitle>Başvuru Kuyruğu</CardTitle>
                <CardDescription>Zanaatkarlık/atölye talepleri için admin onay ve red alanı.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApplications.length > 0 ? (
              pendingApplications.map((application) => (
                <div key={application.id} className="rounded-2xl border border-primary/10 bg-background/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{artisanNameForProfile(application.artisanProfileId)}</p>
                    <Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">
                      Beklemede
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{application.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={() => onApproveApplication(application)}>
                      <CheckCheck className="size-4" />
                      Onayla
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => onRejectApplication(application)}>
                      <X className="size-4" />
                      Reddet
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-primary/15 bg-background/60 p-4 text-sm text-muted-foreground">
                Bekleyen başvuru yok.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
