"use client"

import { useState, type FormEvent } from "react"
import { Flag, Mail, TriangleAlert, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ProductReportModalProps = {
  productName: string
}

const reportReasons = [
  "Yanıltıcı ürün açıklaması",
  "Uygunsuz görsel veya içerik",
  "Telif veya özgünlük ihlali şüphesi",
  "Güvenlik veya kalite endişesi",
  "Diğer",
] as const

export function ProductReportModal({ productName }: ProductReportModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reporterName, setReporterName] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState<(typeof reportReasons)[number]>(reportReasons[0])
  const [details, setDetails] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
    setIsSubmitted(false)
  }

  const openModal = () => {
    setIsOpen(true)
    setIsSubmitted(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    setReporterName("")
    setEmail("")
    setReason(reportReasons[0])
    setDetails("")
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-xl border-primary/20 text-muted-foreground hover:text-foreground"
        onClick={openModal}
      >
        <Flag className="size-4" />
        Ürünü Raporla
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={closeModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} için ürün raporu oluştur`}
            className="w-full max-w-xl rounded-3xl border border-primary/10 bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  <TriangleAlert className="size-3.5" />
                  Ürün Raporu
                </div>
                <div>
                  <h3 className="text-xl font-black">Bu ürünü neden raporlamak istiyorsunuz?</h3>
                  <p className="text-sm text-muted-foreground">
                    {productName} için gördüğünüz sorunu paylaşın. Gönderim statik demodur, kayıt oluşturmaz.
                  </p>
                </div>
              </div>

              <Button type="button" variant="ghost" size="icon-sm" onClick={closeModal} aria-label="Kapat">
                <X className="size-4" />
              </Button>
            </div>

            {isSubmitted ? (
              <div className="space-y-4 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                <p className="font-semibold text-primary">Raporunuz alındı.</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  İnceleme ekibi bu bildirim türünü ürün moderasyon kuyruğuna yönlendirir. Bu akış şimdilik statik arayüz olarak çalışıyor.
                </p>
                <Button type="button" className="w-full" onClick={closeModal}>
                  Kapat
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="product-report-name" className="text-sm font-semibold">
                      Ad Soyad
                    </label>
                    <Input
                      id="product-report-name"
                      value={reporterName}
                      onChange={(event) => setReporterName(event.target.value)}
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="product-report-email" className="text-sm font-semibold">
                      E-posta
                    </label>
                    <div className="relative">
                      <Input
                        id="product-report-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="size@ornek.com"
                        className="pr-10"
                        required
                      />
                      <Mail className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="product-report-reason" className="text-sm font-semibold">
                    Rapor Nedeni
                  </label>
                  <select
                    id="product-report-reason"
                    value={reason}
                    onChange={(event) => setReason(event.target.value as (typeof reportReasons)[number])}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                  >
                    {reportReasons.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="product-report-details" className="text-sm font-semibold">
                    Detaylar
                  </label>
                  <Textarea
                    id="product-report-details"
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    placeholder="Gördüğünüz sorunu, hangi içerik veya bilgi nedeniyle raporladığınızı açıklayın."
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-4 text-sm leading-6 text-muted-foreground">
                  Bu form ürün moderasyonu içindir. Sipariş veya teslimat sorunu yaşıyorsanız destek akışını kullanmanız gerekir.
                </div>

                <Button type="submit" className="w-full">
                  Raporu Gönder
                </Button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
