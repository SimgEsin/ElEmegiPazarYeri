"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type HeroCarouselSlide = {
  id: string
  imageSrc: string
  alt: string
}

type HeroCarouselProps = {
  slides: HeroCarouselSlide[]
  autoPlayMs?: number
}

export function HeroCarousel({ slides, autoPlayMs = 6000 }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slideCount = slides.length
  const canSlide = slideCount > 1
  const currentIndex = slideCount ? activeIndex % slideCount : 0

  useEffect(() => {
    if (!canSlide || isPaused) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, autoPlayMs)

    return () => window.clearInterval(intervalId)
  }, [autoPlayMs, canSlide, isPaused, slideCount])

  if (!slideCount) {
    return null
  }

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slideCount)
  }

  const previousSlide = () => {
    setActiveIndex((current) => (current - 1 + slideCount) % slideCount)
  }

  return (
    <div className="space-y-3" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="relative h-[220px] overflow-hidden rounded-xl border bg-muted sm:h-[280px] lg:h-[320px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            aria-hidden={index !== currentIndex}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              index === currentIndex ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image src={slide.imageSrc} alt={slide.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}

        {canSlide ? (
          <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between px-2">
            <Button type="button" variant="secondary" size="icon-sm" aria-label="Önceki banner" onClick={previousSlide}>
              <ArrowLeft className="size-4" />
            </Button>
            <Button type="button" variant="secondary" size="icon-sm" aria-label="Sonraki banner" onClick={nextSlide}>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>

      {canSlide ? (
        <div className="flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${index + 1}. bannera git`}
              aria-current={index === currentIndex}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
