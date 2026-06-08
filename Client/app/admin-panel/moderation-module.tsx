"use client"

import { useState } from "react"

import type { ProductReport } from "@/lib/api/reports"
import type { ProductListItem } from "@/lib/api/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type ModerationModuleProps = {
  reports: ProductReport[]
  products: ProductListItem[]
  onResolveReport: (report: ProductReport) => void
}

export default function ModerationModule({ reports, products, onResolveReport }: ModerationModuleProps) {
  const [moderationSearch, setModerationSearch] = useState("")

  const openReports = reports.filter((report) => !report.isResolved)
  const productNameById = new Map(products.map((product) => [product.id, product.name]))
  const normalizedModerationSearch = moderationSearch.trim().toLocaleLowerCase("tr-TR")
  const visibleReports = openReports.filter((report) =>
    [productNameById.get(report.productId) ?? "", report.reason, report.description ?? ""].some((value) =>
      value.toLocaleLowerCase("tr-TR").includes(normalizedModerationSearch),
    ),
  )

  return (
    <Card className="border-primary/10 bg-primary/[0.04]">
      <CardHeader>
        <CardTitle>Moderasyon Kuyruğu</CardTitle>
        <CardDescription>Kullanıcı raporları nedeniyle admin incelemesine düşen ürünler.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={moderationSearch}
          onChange={(event) => setModerationSearch(event.target.value)}
          placeholder="Ürün, rapor nedeni veya açıklama ara"
          aria-label="Moderasyon kuyruğunda ara"
        />

        {visibleReports.length > 0 ? (
          visibleReports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-primary/10 bg-background/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{productNameById.get(report.productId) ?? "Bilinmeyen ürün"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{report.reason}</p>
                </div>
                <Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">
                  Açık
                </Badge>
              </div>
              {report.description ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{report.description}</p>
              ) : null}
              <div className="mt-4">
                <Button type="button" size="sm" variant="outline" onClick={() => onResolveReport(report)}>
                  Raporu Kapat
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/15 bg-background/60 p-4 text-sm text-muted-foreground">
            Açık kullanıcı raporu bulunamadı.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
