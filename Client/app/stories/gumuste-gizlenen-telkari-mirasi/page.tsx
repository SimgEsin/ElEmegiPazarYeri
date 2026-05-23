import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock3 } from "lucide-react"

import { productStories } from "@/lib/homepage-data"

const story = productStories.find((item) => item.href === "/stories/gumuste-gizlenen-telkari-mirasi")

const paragraphs = [
  "Telkariyi sadece bir takı tekniği olarak görmüyorum; benim için sabrın elle görünür hale gelmiş hali. İnce gümüş tellerin her biri benden ayrı bir nefes temposu istiyor.",
  "Mardin'deki atölyemde önce kalın tel çekiyor, sonra bu teli birkaç aşamada inceltip dantel gibi örülebilecek seviyeye getiriyorum.",
  "Desenleri hazır kalıplarla kurmuyorum; her parçayı tek tek elde kuruyorum. Bu yüzden aynı motifi çalışsam bile çizgi akışında küçük farklılıklar bırakıyorum.",
  "En zor aşama, tellerin birbiriyle temas ettiği noktaları fazla ısıtmadan sabitlemek. Bir saniyelik dikkatsizlikte desenin ritmi bozulabiliyor; bu yüzden lehim aşamasında atölyedeki tüm dikkat tek bir noktada toplanıyor.",
  "Geometrik motiflerle çalışırken önce ana iskeleti kuruyor, sonra iç dolguyu milim milim örüyorum. Dış formu erken bitirmek kolay ama asıl kimlik, içerideki ince örgüde ortaya çıkıyor.",
  "Parça tamamlandığında yüzeyi kimyasal parlatıcılarla değil, kontrollü fırça ve bez işlemleriyle açıyorum. Bu yöntem daha uzun sürüyor ama metalin doğallığını koruduğu için telkarinin yaşını hissettiren bir görünüm bırakıyor.",
  "Çıraklarıma ilk öğrettiğim şey hız değil ritim. Telkari aceleyle öğrenilen bir zanaat değil; elin hafızası, ancak tekrar ve dikkatle oluşuyor.",
  "Bugün yaptığım tasarımlarda geleneksel Mardin motiflerini modern formlarla birleştiriyorum. Böylece parça geçmişe ait bir iz taşırken, bugünün kullanımına da rahatça eşlik edebiliyor.",
]

export const metadata: Metadata = {
  title: "Gümüşte Gizlenen Telkari Mirası",
  description: "Mardin telkari sanatının geleneksel tekniklerle bugüne taşınan hikayesi.",
}

export default function TelkariStoryPage() {
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
          &quot;Telkari yaparken metalin sertliğini değil, esnekliğini dinliyorum; çizgi orada canlı kalıyor.&quot;
        </blockquote>
      </section>
    </article>
  )
}
