import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock3 } from "lucide-react"

import { heroStory, makerGallery } from "@/lib/homepage-data"

export const metadata: Metadata = {
  title: "Tezgahın Ruhu: Elena'nın Yolculuğu",
  description: "Geleneksel dokuma sanatının modern tasarımla buluştuğu Elena'nın hikayesi.",
}

const storyParagraphs = [
  "Karadeniz'in yüksek bir dağ köyünde büyüdüm. Çocukluğumda duyduğum ilk ritim, tezgahın ahşap gövdesine çarpan mekik sesi oldu.",
  "Yıllar içinde şehirde tasarım eğitimi aldım; ama ne zaman bir kumaşa dokunsam, ninemin atölyesindeki doğal yün kokusunu hatırladım. Geri dönüş kararım böyle doğdu.",
  "Bugün stüdyomda ürettiğim her parçada, eski tekniklerle yeni formları bir araya getiriyorum. Her ilmekte geçmişimden bir iz, her desen geçişinde bugüne ait bir yorum bırakıyorum.",
  "İşe başlamadan önce ipliği yalnızca renge göre değil, büküm karakterine göre seçiyorum. Sık bükümlü iplik daha net desen verirken, gevşek bükümlü iplik yüzeye daha yumuşak bir akış kazandırıyor.",
  "Doğal boyamada ton tutarlılığını korumak için küçük numuneler dokuyor ve ışığın farklı saatlerinde kumaşı yeniden kontrol ediyorum. Sabah gördüğüm bej ile akşam gördüğüm bej her zaman aynı davranmıyor.",
  "Tezgahta çalışma sırasında en çok önem verdiğim şey gerilim dengesi. Çözgü ipleri bir noktada fazla sıkı kaldığında desen kırılıyor; bu yüzden üretim boyunca sık sık durup elde kontrol yapıyorum.",
  "Koleksiyon hazırlarken önce bütün parçaları yan yana serip ritimlerine bakıyorum. Bazen teknik olarak kusursuz bir kumaş, diğerlerinin yanında fazla gürültülü kalabiliyor; o zaman onu bir sonraki seriye bırakıyorum.",
  "Benim için iyi bir dokuma, yalnızca göze güzel görünen değil, elde de doğru hissedilen dokumadır. Kumaşın düşüşü, tenle temasındaki sıcaklık ve kullanım sırasında aldığı form, hikayenin en önemli kısmını oluşturuyor.",
]

export default function TezgahinRuhuElenaPage() {
  return (
    <article className="mx-auto w-full max-w-5xl space-y-12 pb-10">
      <section className="space-y-5">
        <Link href="/stories" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" />
          Hikaye arşivine dön
        </Link>

        <div className="overflow-hidden rounded-2xl border border-primary/15">
          <div className="relative min-h-[460px] overflow-hidden">
            <Image src={heroStory.imageSrc} alt={heroStory.imageAlt} fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 space-y-3 p-8 text-white">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase backdrop-blur">
                {heroStory.badge}
              </span>
              <h1 className="max-w-3xl text-3xl leading-tight font-black sm:text-5xl">{heroStory.title}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <Clock3 className="size-4" />
                <span>9 dk okuma</span>
                <span>•</span>
                <span>Yazan: Elena Kaya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 text-lg leading-relaxed text-muted-foreground">
        {storyParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <blockquote className="rounded-xl border-l-4 border-primary bg-primary/5 p-6 text-base italic text-foreground">
          &quot;Dokuma benim için sadece bir üretim değil; zamanı yavaşlatma biçimi. Mekik her geçtiğinde, aceleden biraz daha uzaklaşıyorum.&quot;
        </blockquote>

        <p>
          Son koleksiyonumda kullandığım çizgiler, dağ yamacındaki tarla sınırlarından ilham alıyor. Renk paletimi ise gün doğumundaki sisin tonlarıyla
          kuruyorum: kırık beyaz, toprak beji, yumuşak indigo.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {makerGallery.slice(0, 2).map((item) => (
          <div key={item.imageSrc} className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src={item.imageSrc} alt={item.imageAlt} fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
        ))}
      </section>
    </article>
  )
}
