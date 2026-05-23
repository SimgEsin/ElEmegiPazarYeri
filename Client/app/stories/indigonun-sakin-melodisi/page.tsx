import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock3 } from "lucide-react"

import { productStories } from "@/lib/homepage-data"

const story = productStories.find((item) => item.href === "/stories/indigonun-sakin-melodisi")

const paragraphs = [
  "Benim için indigo, bir renkten çok daha fazlası. Suyun, havanın ve sabrın birlikte çalıştığı yaşayan bir sürecin içindeyim.",
  "Atölyede her sabah önce boyama küpünün yüzeyini kontrol ediyorum. Indigo banyosunun dengesi, gece boyunca nasıl dinlendiğine göre değişiyor.",
  "Kumaşı boyadan çıkardığımda ilk anda yeşilimsi görünüyor. Hava ile temas ettikçe yavaş yavaş maviye dönmesi, beni her seferinde aynı heyecanla yakalıyor.",
  "Bu dönüşümün hızı mevsime göre değişiyor. Kışın daha ağır, yazın daha hızlı ilerleyen oksidasyon süreci, aynı reçeteyi kullansam bile tona küçük karakter farkları katıyor.",
  "İpliği tek seferde koyu maviye zorlamıyorum; katman katman boyuyorum. Her kat arasında kumaşı dinlendirip lifin nefes almasına izin verdiğimde renk daha derin ve daha kalıcı oluyor.",
  "Atölye defterimde her gün su sıcaklığını, pH değerini ve bekleme süresini not alıyorum. Bu kayıtlar sayesinde bir parçanın hikayesini sadece görselinden değil, üretim ritminden de okuyabiliyorum.",
  "Bitmiş kumaşları gölgede kurutuyor, ardından sade suyla birkaç kez duruluyorum. Fazla pigmenti aceleyle uzaklaştırmak yerine yavaşça arındırdığımda yüzeydeki doğal geçişler korunuyor.",
  "Müşterilerime teslim ettiğim her parçada küçük bir bakım notu da veriyorum: güçlü deterjandan kaçın, gölgede kurut, kumaşa zaman tanı. Çünkü doğal boyama bir sonuç değil, kullanım boyunca devam eden bir yolculuk.",
]

export const metadata: Metadata = {
  title: "Indigo'nun Sakin Melodisi",
  description: "Doğal boyama atölyesinde indigo renginin doğuş hikayesi.",
}

export default function IndigoStoryPage() {
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
          &quot;Doğal boyamada hata aramam; iz ararım. Her iz, kumaşın karakterini birlikte kurduğumuz bir hatıradır.&quot;
        </blockquote>
      </section>
    </article>
  )
}
