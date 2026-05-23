import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const experienceEntries = [
  {
    customer: "Ece S.",
    subject: "Hasır Sunum Tepsisi",
    mood: "5/5",
    note: "Paket açılışındaki kart notu ve doğal doku beklentimin üstündeydi.",
  },
  {
    customer: "Mert A.",
    subject: "Gün Batımı Cam Koleksiyonu",
    mood: "4/5",
    note: "Teslimat aşaması biraz uzadı ama ürünün rengi ve işçiliği çok başarılı.",
  },
]

export default function CustomerExperienceManagementModule() {
  return (
    <Card className="border-primary/10 bg-background/85">
      <CardHeader>
        <CardTitle>Müşteri Deneyim Listesi</CardTitle>
        <CardDescription>Yayınlanan müşteri deneyimleri.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {experienceEntries.map((item) => (
          <div key={item.customer + item.subject} className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.customer}</p>
                <p className="text-xs text-muted-foreground">{item.subject}</p>
              </div>
              <Badge variant="secondary" className="border border-primary/10 bg-primary/10 text-primary">
                {item.mood}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
