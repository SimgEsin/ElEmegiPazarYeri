import type { ProductReview } from "@/lib/api/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type CustomerExperienceManagementModuleProps = {
  reviews: ProductReview[]
}

export default function CustomerExperienceManagementModule({ reviews }: CustomerExperienceManagementModuleProps) {
  return (
    <Card className="border-primary/10 bg-background/85">
      <CardHeader>
        <CardTitle>Müşteri Deneyim Listesi</CardTitle>
        <CardDescription>Yayınlanan müşteri değerlendirmeleri.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{review.userFullName ?? "Müşteri"}</p>
                  {review.isVerifiedBuyer ? (
                    <p className="text-xs text-muted-foreground">Doğrulanmış alıcı</p>
                  ) : null}
                </div>
                <Badge variant="secondary" className="border border-primary/10 bg-primary/10 text-primary">
                  {review.rating}/5
                </Badge>
              </div>
              {review.comment ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/15 bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
            Henüz yayınlanmış müşteri değerlendirmesi yok.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
