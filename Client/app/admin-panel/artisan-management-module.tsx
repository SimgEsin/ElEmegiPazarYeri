import { BadgeCheck, Ban, CheckCheck, Compass, Eye, UserPlus2, Wrench, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const artisanStats = [
  { label: "Aktif zanaatkar", value: "42", detail: "Platformda satış yapmaya yetkili hesaplar", icon: BadgeCheck },
  { label: "Başvuru kuyruğu", value: "8", detail: "Onay veya red kararı bekleyen adaylar", icon: UserPlus2 },
  { label: "Kısıtlı hesap", value: "6", detail: "Admin kararıyla yakın izlemeye alınmış kayıtlar", icon: Wrench },
]

const artisanRoster = [
  {
    name: "Kum Çizgisi",
    city: "İzmir",
    focus: "Seramik ve sofra objeleri",
    health: "Uyarı kaydı yok",
  },
  {
    name: "Amber Cam Evi",
    city: "Bursa",
    focus: "Alevle şekillenen cam işler",
    health: "Belge güncellemesi istendi",
  },
  {
    name: "Narin Atölye",
    city: "Balıkesir",
    focus: "Doğal dokuma ve masa tekstili",
    health: "Şikayet incelemesi kapatıldı",
  },
]

const onboardingQueue = [
  { name: "Ladin Oyma", step: "Belge kontrolü", note: "Başvuru evrakları tamamlandı, son admin onayı bekleniyor." },
  { name: "Mavi Fırın", step: "Portfolyo inceleme", note: "Ürün kalite standardı için ek görsel istendi." },
  { name: "Sarnıç Bakır", step: "Sözleşme kontrolü", note: "Platform kurallarına uyum maddeleri yeniden değerlendiriliyor." },
]

export default function ArtisanManagementModule() {
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
            {artisanRoster.map((artisan) => (
              <div key={artisan.name} className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{artisan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {artisan.city} • {artisan.focus}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-primary/15 bg-background/80">
                    {artisan.health}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm">
                    <Eye className="size-4" />
                    Zanaatkarı Görüntüle
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <Ban className="size-4" />
                    Zanaatkarı Yasakla
                  </Button>
                </div>
              </div>
            ))}
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
                <CardDescription>Zanaatkarlık talepleri için admin onay ve red alanı.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {onboardingQueue.map((item) => (
              <div key={item.name} className="rounded-2xl border border-primary/10 bg-background/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">
                    {item.step}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.note}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" size="sm">
                    <CheckCheck className="size-4" />
                    Onayla
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <X className="size-4" />
                    Reddet
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
