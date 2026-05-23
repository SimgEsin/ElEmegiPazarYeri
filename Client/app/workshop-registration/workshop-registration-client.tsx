"use client"

import Image from "next/image"
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { BadgeCheck, Headset, ImagePlus, PencilLine, ShieldCheck, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type RegistrationView = "editing" | "submitted"

type RegistrationFormValues = {
  fullName: string
  email: string
  title: string
  location: string
  story: string
}

type PhotoPreview = {
  file: File
  previewUrl: string
}

type StepItem = {
  title: string
  description: string
  icon: LucideIcon
}

const initialFormValues: RegistrationFormValues = {
  fullName: "",
  email: "",
  title: "",
  location: "",
  story: "",
}

const steps: StepItem[] = [
  {
    title: "Başvuru Bilgileri",
    description: "Bilgilerini ve hikayeni paylaş",
    icon: PencilLine,
  },
  {
    title: "Onay Al",
    description: "Başvurun incelemeye alınsın",
    icon: BadgeCheck,
  },
]

export default function WorkshopRegistrationClient() {
  const [view, setView] = useState<RegistrationView>("editing")
  const [formValues, setFormValues] = useState<RegistrationFormValues>(initialFormValues)
  const [kitchenPhotos, setKitchenPhotos] = useState<PhotoPreview[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  function updateField(field: keyof RegistrationFormValues, value: string) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))

    if (errorMessage) {
      setErrorMessage("")
    }
  }

  function handleKitchenPhotosChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"))

    if (files.length === 0) {
      setKitchenPhotos((current) => {
        current.forEach((item) => URL.revokeObjectURL(item.previewUrl))
        return []
      })
      return
    }

    setKitchenPhotos((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl))

      return files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }))
    })

    setErrorMessage("")
  }

  function validateForm() {
    const values = Object.values(formValues)
    const hasEmptyValue = values.some((value) => value.trim().length === 0)

    if (hasEmptyValue) {
      setErrorMessage("Lütfen tüm alanları doldurun.")
      return false
    }

    if (kitchenPhotos.length === 0) {
      setErrorMessage("Lütfen Mutfaktan Kareler bölümüne en az bir görsel ekleyin.")
      return false
    }

    return true
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setErrorMessage("")
    setView("submitted")
  }

  useEffect(() => {
    return () => {
      kitchenPhotos.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [kitchenPhotos])

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 pb-6">
      <section className="group relative min-h-[320px] overflow-hidden rounded-xl">
        <Image
          src="/images/home/hero-story.png"
          alt="Geleneksel zanaat atölyesinde çalışan usta."
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 960px, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#221610]/90 via-[#221610]/50 to-transparent" />

        <div className="relative flex min-h-[320px] flex-col justify-end p-8">
          <span className="mb-3 inline-flex w-fit rounded bg-primary px-3 py-1 text-xs font-bold tracking-widest text-primary-foreground uppercase">
            Yeni Başvuru
          </span>
          <h1 className="text-4xl leading-tight font-black tracking-tight text-white md:text-5xl">Atölyeni Dünyaya Aç</h1>
          <p className="mt-2 max-w-2xl text-lg text-slate-200">
            Hikayeni paylaş, sanatını dünyaya duyur ve binlerce sanatseverle buluş.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-primary/10 bg-card p-6 shadow-sm md:p-10">
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = view === "editing" ? index === 0 : index === 1
            const isCompleted = view === "submitted" && index === 0

            return (
              <article
                key={step.title}
                className={
                  isActive
                    ? "flex items-start gap-4 rounded-lg border border-primary/15 bg-primary/5 p-4"
                    : isCompleted
                      ? "flex items-start gap-4 rounded-lg border border-primary/10 bg-background p-4"
                      : "flex items-start gap-4 rounded-lg border border-border bg-muted/35 p-4 opacity-70"
                }
              >
                <div
                  className={
                    isActive
                      ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      : isCompleted
                        ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                        : "flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                  }
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-bold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </article>
            )
          })}
        </div>

        {view === "editing" ? (
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <UserRound className="size-5 text-primary" />
                Kişisel Bilgiler ve Hikayen
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="full-name" className="text-sm font-semibold text-foreground/90">
                    Adınız Soyadınız
                  </label>
                  <Input
                    id="full-name"
                    value={formValues.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground/90">
                    E-posta Adresiniz
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formValues.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="ahmet@zanaat.com"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-foreground/90">
                    Ünvan
                  </label>
                  <Input
                    id="title"
                    value={formValues.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Örn: Seramik Sanatçısı"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-semibold text-foreground/90">
                    Konum
                  </label>
                  <Input
                    id="location"
                    value={formValues.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    placeholder="Örn: İstanbul / Kadıköy"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="story" className="text-sm font-semibold text-foreground/90">
                    Zanaat Hikayeniz
                  </label>
                  <Textarea
                    id="story"
                    rows={5}
                    value={formValues.story}
                    onChange={(event) => updateField("story", event.target.value)}
                    placeholder="Bu işe nasıl başladınız? Sizi diğerlerinden ayıran nedir?"
                    className="min-h-32"
                  />
                  <p className="text-xs text-muted-foreground">En az birkaç cümle ile kendinizi ifade edin.</p>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label htmlFor="kitchen-photos" className="text-sm font-semibold text-foreground/90">
                    Mutfaktan Kareler
                  </label>
                  <label
                    htmlFor="kitchen-photos"
                    className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-6 py-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/10"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ImagePlus className="size-6" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold">Birden fazla görsel yükleyin</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG veya WEBP formatlarındaki görselleri seçin.
                      </p>
                    </div>
                  </label>
                  <Input
                    id="kitchen-photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleKitchenPhotosChange}
                    className="sr-only"
                  />

                  {kitchenPhotos.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {kitchenPhotos.map((item) => (
                        <div
                          key={`${item.file.name}-${item.file.size}`}
                          className="overflow-hidden rounded-2xl border border-border bg-muted/20"
                        >
                          <div className="relative aspect-[4/3]">
                            <Image src={item.previewUrl} alt={item.file.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="px-3 py-2 text-xs text-muted-foreground">{item.file.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
              <Button type="submit" className="h-12 px-8 text-sm font-bold shadow-md shadow-primary/20">
                Başvuruyu Gönder
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 rounded-3xl border border-primary/15 bg-primary/5 p-8">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BadgeCheck className="size-7" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Başvurunuz alındı</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Zanaatkârlık hesabı başvurunuz ekibimize iletildi. Bilgileriniz ve paylaştığınız görseller
                incelendikten sonra sizinle e-posta üzerinden iletişime geçeceğiz.
              </p>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Şu anda herhangi bir ek işlem yapmanıza gerek yok. Onay süreci tamamlandığında tarafınıza
                bilgilendirme yapılacaktır.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-6 pb-4 md:grid-cols-2">
        <article className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/10 p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <ShieldCheck className="size-7" />
          </div>
          <div>
            <h3 className="font-bold">Güvenli ve Şeffaf</h3>
            <p className="text-sm text-muted-foreground">
              Verileriniz ve eserleriniz telif haklarınız korunarak saklanır.
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Headset className="size-7" />
          </div>
          <div>
            <h3 className="font-bold">Yardıma mı ihtiyacınız var?</h3>
            <p className="text-sm text-muted-foreground">
              Başvuru sürecinde destek almak için ekibimize ulaşın.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
