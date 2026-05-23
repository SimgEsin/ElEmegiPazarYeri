import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock3 } from "lucide-react"

import { productStories } from "@/lib/homepage-data"

const story = productStories.find((item) => item.href === "/stories/zeytin-dalindan-bir-sofra-hikayesi")

const paragraphs = [
  "Budama döneminde ayrılan zeytin dallarını atık olarak değil, yeni bir malzeme olarak görüyorum. Her dalın damar yapısı farklı olduğu için yaptığım her kase başka bir karakter taşıyor.",
  "Kütükleri önce gölgede dinlendiriyorum. Ahşabın iç nemi doğru seviyeye gelmeden işleme alırsam, ileride çatlak riski yükseliyor.",
  "Tornada kaba formu verdikten sonra yüzeyi çoğu zaman zımpara yerine elle bıçakla temizliyorum. Böyle yaptığımda ahşabın doğal dalgası daha görünür kalıyor.",
  "Zeytin ağacının sertliği, işleme sırasında sabit bir tempo istiyor. Ucu biraz fazla bastırırsam damar kırılıyor, az bastırırsam yüzeyde istenmeyen izler kalıyor; bu dengeyi her parçada yeniden kuruyorum.",
  "Kasenin dudak kısmını özellikle ince bırakmıyorum; kullanımda dayanıklılık için kontrollü bir kalınlık koruyorum. Böylece parça hem gündelik sofrada rahat kullanılıyor hem de elde ağır durmuyor.",
  "Yüzeyi tamamladıktan sonra doğal yağ karışımıyla birkaç kat besliyorum. Ahşap bu yağı yavaş yavaş emdikçe rengi koyulaşıyor, damarın çizgileri daha net ortaya çıkıyor ve parça zamanla daha da güzelleşiyor.",
  "Her üretim gününün sonunda atölyeyi temizlerken çıkan küçük talaşları da ayırıyorum. İnce talaşları kompost için, iri parçaları ise tütsüleme denemelerinde kullanıyorum; süreçte neredeyse hiç israf bırakmamaya çalışıyorum.",
  "Bir kaseyi bitirdiğimde onu yalnızca biçim olarak değil, yaşam süresiyle birlikte düşünüyorum. Çatal bıçak izi alacak mı, sıcak çorbaya dayanacak mı, elde nasıl hissedilecek; bütün bu sorular tasarımın son halini belirliyor.",
]

export const metadata: Metadata = {
  title: "Zeytin Dalından Bir Sofra Hikayesi",
  description: "Budanan zeytin dallarından elde yapılan kaselerin üretim yolculuğu.",
}

export default function OliveStoryPage() {
  if (!story) {
    return null
  }

  return (
    <article className="mx-auto w-full max-w-5xl space-y-10 pb-10">
      <section className="space-y-4">
        <Link href="/stories" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" />
          Hikaye arşivine dön
        </Link>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-primary/15">
          <Image src={story.imageSrc} alt={story.imageAlt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 space-y-3 p-7 text-white">
            <p className="text-xs font-bold tracking-wide uppercase">{story.category}</p>
            <h1 className="max-w-3xl text-3xl leading-tight font-black sm:text-5xl">{story.title}</h1>
            <p className="flex items-center gap-2 text-sm text-slate-200">
              <Clock3 className="size-4" />
              {story.readTime} • {story.author}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 text-lg leading-relaxed text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <blockquote className="rounded-xl border-l-4 border-primary bg-primary/5 p-6 text-base italic text-foreground">
          &quot;Ahşapla yarışmam; ritmine eşlik ederim. Parça ne söylüyorsa elim ona göre yön bulur.&quot;
        </blockquote>
      </section>
    </article>
  )
}
