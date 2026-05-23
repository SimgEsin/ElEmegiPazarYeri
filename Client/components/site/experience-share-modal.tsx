"use client"

import { useState, type FormEvent } from "react"
import { Star, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ExperienceShareModalProps = {
  productName: string
}

export function ExperienceShareModal({ productName }: ExperienceShareModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [rating, setRating] = useState(5)
  const [experience, setExperience] = useState("")
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
    setFullName("")
    setRating(5)
    setExperience("")
  }

  const handleRatingChange = (value: string) => {
    const parsedValue = Number(value)
    if (Number.isNaN(parsedValue)) {
      setRating(1)
      return
    }
    setRating(Math.max(1, Math.min(5, parsedValue)))
  }

  return (
    <>
      <button
        type="button"
        className="rounded-xl border border-primary/20 bg-primary/10 px-6 py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white"
        onClick={openModal}
      >
        Deneyiminizi Paylaşın
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} için deneyiminizi paylaşın`}
            className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">Deneyiminizi Paylaşın</h3>
                <p className="text-sm text-muted-foreground">{productName} için yorumunuzu bırakın.</p>
              </div>
              <Button type="button" variant="ghost" size="icon-sm" onClick={closeModal} aria-label="Kapat">
                <X className="size-4" />
              </Button>
            </div>

            {isSubmitted ? (
              <div className="space-y-4 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm">
                <p className="font-semibold text-primary">Paylaşımınız alındı. Teşekkür ederiz!</p>
                <Button type="button" className="w-full" onClick={closeModal}>
                  Kapat
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="experience-full-name" className="text-sm font-semibold">
                    Ad Soyad
                  </label>
                  <Input
                    id="experience-full-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Adınız ve soyadınız"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience-rating" className="text-sm font-semibold">
                    Puan
                  </label>
                  <div className="relative">
                    <Input
                      id="experience-rating"
                      type="number"
                      min={1}
                      max={5}
                      step={1}
                      value={rating}
                      onChange={(event) => handleRatingChange(event.target.value)}
                      required
                    />
                    <Star className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience-text" className="text-sm font-semibold">
                    Deneyiminiz
                  </label>
                  <Textarea
                    id="experience-text"
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    placeholder="Ürünle ilgili deneyiminizi yazın."
                    className="min-h-28"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Gönder
                </Button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
