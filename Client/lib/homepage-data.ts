export type CuratedCategory = {
  title: string
  slug: string
  description: string
  imageSrc: string
  imageAlt: string
}

export type ProductStory = {
  href: string
  title: string
  category: string
  summary: string
  readTime: string
  author: string
  imageSrc: string
  imageAlt: string
  authorImageSrc: string
  authorImageAlt: string
}

export type HomepageCategoryProduct = {
  title: string
  description: string
  pricing:
    | { type: "fixed"; amount: number }
    | { type: "custom"; label: string }
  imageSrc: string
  imageAlt: string
  orderType: "custom" | "stock"
  href: string
}

export type HomepageCategorySection = {
  title: string
  slug: string
  description: string
  products: HomepageCategoryProduct[]
}

export const heroStory = {
  badge: "Haftanın Hikayesi",
  title: "Tezgahın Ruhu: Elena'nın Yolculuğu",
  description:
    "Geleneksel dokuma sanatının modern tasarımla nasıl buluştuğunu Elena'nın dağ stüdyosunda keşfedin. Her ilmek bir asırlık mirası taşıyor.",
  ctaLabel: "Hikayeyi Oku",
  ctaHref: "/stories/tezgahin-ruhu-elena",
  imageSrc:
    "/images/home/hero-story.png",
  imageAlt: "Geleneksel ahşap tezgahta dokuma yapan usta.",
}

export const curatedCategories: CuratedCategory[] = [
  {
    title: "Dokuma ve Tekstil",
    slug: "dokuma-ve-tekstil",
    description: "Yün, keten ve ipekten doğan zamansız dokumalar.",
    imageSrc:
      "/images/home/collection-weaving.png",
    imageAlt: "El dokuması kumaşların düzenlendiği kategori görünümü.",
  },
  {
    title: "Toprak ve Ateş",
    slug: "toprak-ve-ates",
    description: "Ateşle terbiye edilmiş el yapımı seramik eserler.",
    imageSrc:
      "/images/home/collection-ceramic.png",
    imageAlt: "Ahşap masa üzerinde seramik kaseler.",
  },
  {
    title: "Ahşap Ustalığı",
    slug: "ahsap-ustaligi",
    description: "Sürdürülebilir ormanlardan gelen ahşap tasarımlar.",
    imageSrc:
      "/images/home/collection-wood.png",
    imageAlt: "Minimal ahşap mobilya ve dekor ürünleri.",
  },
  {
    title: "Deri Ustalığı",
    slug: "deri-ustaligi",
    description: "Bitkisel tabaklanmış deriden işlevsel sanat.",
    imageSrc:
      "/images/home/collection-leather.png",
    imageAlt: "El yapımı deri çanta ve işleme araçları.",
  },
]

export const homepageCategorySections: HomepageCategorySection[] = [
  {
    title: "Dokuma ve Tekstil",
    slug: "dokuma-ve-tekstil",
    description: "Yün, keten ve ipekten doğan zamansız dokumalar.",
    products: [
      {
        title: "Anadolu Dokuma Masa Örtüsü",
        description: "Keten ve pamuk karışımlı, sıcak tonlu el tezgahı dokuması.",
        pricing: { type: "fixed", amount: 1850 },
        imageSrc: "/images/home/collection-weaving.png",
        imageAlt: "Doğal tonlarda el dokuması masa örtüsü.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "İndigo Boya Duvar Panosu",
        description: "Doğal kök boya geçişleriyle üretilen katmanlı tekstil pano.",
        pricing: { type: "custom", label: "Özel Tasarım" },
        imageSrc: "/images/home/story-indigo.png",
        imageAlt: "İndigo tonlarında tekstil yüzey detayları.",
        orderType: "custom",
        href: "/products/gunesin-gozyasi-vazo",
      },
      {
        title: "Dağ Tezgahı Runner",
        description: "Dar dokuma tezgahında işlenen günlük kullanım sofra koşusu.",
        pricing: { type: "fixed", amount: 1350 },
        imageSrc: "/images/home/collection-weaving.png",
        imageAlt: "Tezgah başında çalışan dokuma ustası.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Keten Servis Seti",
        description: "Her biri elde kesilip kenarları tek tek işlenen 4'lü set.",
        pricing: { type: "fixed", amount: 990 },
        imageSrc: "/images/home/story-indigo.png",
        imageAlt: "Doğal dokulu tekstil ürünlerinin yakın planı.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
    ],
  },
  {
    title: "Toprak ve Ateş",
    slug: "toprak-ve-ates",
    description: "Ateşle terbiye edilmiş el yapımı seramik eserler.",
    products: [
      {
        title: "Güneşin Gözyaşı Vazosu",
        description: "Organik formlu, toprak tonlarında imza seramik vazo.",
        pricing: { type: "custom", label: "Özel Tasarım" },
        imageSrc: "/images/products/gunesin-gozyasi-vazo/hero.jpg",
        imageAlt: "Toprak tonlarında büyük seramik vazo.",
        orderType: "custom",
        href: "/products/gunesin-gozyasi-vazo",
      },
      {
        title: "Mini Toprak Kase",
        description: "Kahvaltı ve meze sunumu için elde şekillendirilmiş küçük kase.",
        pricing: { type: "fixed", amount: 780 },
        imageSrc: "/images/products/gunesin-gozyasi-vazo/related-mini-kase.jpg",
        imageAlt: "Mat yüzeyli mini seramik kase.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Terra Tabak Seti",
        description: "Gündelik kullanıma uygun, sıcak renk paletinde 3'lü tabak seti.",
        pricing: { type: "fixed", amount: 1650 },
        imageSrc: "/images/products/gunesin-gozyasi-vazo/related-terra-tabak.jpg",
        imageAlt: "El yapımı seramik tabak seti.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Sütun Vazo",
        description: "Mimari formdan ilham alan, yüksek boy seramik dekor vazosu.",
        pricing: { type: "custom", label: "Özel Tasarım" },
        imageSrc: "/images/products/gunesin-gozyasi-vazo/related-sutun-vazo.jpg",
        imageAlt: "Uzun formda seramik sütun vazo.",
        orderType: "custom",
        href: "/products/gunesin-gozyasi-vazo",
      },
    ],
  },
  {
    title: "Ahşap Ustalığı",
    slug: "ahsap-ustaligi",
    description: "Sürdürülebilir ormanlardan gelen ahşap tasarımlar.",
    products: [
      {
        title: "Ceviz Oyma Sunum Tepsisi",
        description: "Tek parça cevizden oyularak çıkarılan doğal damar desenli tepsi.",
        pricing: { type: "fixed", amount: 2400 },
        imageSrc: "/images/home/collection-wood.png",
        imageAlt: "Ahşap sunum ürünleri ve oyma detaylar.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Zeytin Dalı Servis Kasesi",
        description: "Budanan zeytin dallarından elde biçimlendirilmiş servis kasesi.",
        pricing: { type: "custom", label: "Özel Tasarım" },
        imageSrc: "/images/home/story-olive.png",
        imageAlt: "Ahşap oyma sürecinden bir görüntü.",
        orderType: "custom",
        href: "/products/gunesin-gozyasi-vazo",
      },
      {
        title: "Oyma Kahvaltı Seti",
        description: "Kahvaltı sofraları için 6 parçalık elde oyulmuş servis seti.",
        pricing: { type: "fixed", amount: 2850 },
        imageSrc: "/images/home/collection-wood.png",
        imageAlt: "Atölyede oyma için hazırlanan ahşap parçalar.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Doğal Doku Kesme Tahtası",
        description: "Her damar çizgisi farklı, tekil formda mutfak tahtası.",
        pricing: { type: "custom", label: "Özel Tasarım" },
        imageSrc: "/images/home/story-olive.png",
        imageAlt: "Doğal dokuya sahip işlenmiş yüzey detayı.",
        orderType: "custom",
        href: "/products/gunesin-gozyasi-vazo",
      },
    ],
  },
  {
    title: "Deri Ustalığı",
    slug: "deri-ustaligi",
    description: "Bitkisel tabaklanmış deriden işlevsel sanat.",
    products: [
      {
        title: "Atölye Deri Omuz Çantası",
        description: "Bitkisel tabaklama ve elde dikişle üretilen günlük çanta.",
        pricing: { type: "fixed", amount: 3200 },
        imageSrc: "/images/home/collection-leather.png",
        imageAlt: "El yapımı deri çanta ve atölye araçları.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Seyyah Kartlık",
        description: "Kompakt ölçüde, doğal yağlarla parlatılmış deri kartlık.",
        pricing: { type: "fixed", amount: 950 },
        imageSrc: "/images/home/collection-leather.png",
        imageAlt: "Deri ürünler yanında profil fotoğrafı.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Zımbalı Anahtarlık",
        description: "Kalıp kesim ve bakır zımba detaylı, tekli deri anahtarlık.",
        pricing: { type: "fixed", amount: 520 },
        imageSrc: "/images/home/collection-leather.png",
        imageAlt: "Deri anahtarlık ve işleme ekipmanları.",
        orderType: "stock",
        href: "/products/stok-seramik-vazo",
      },
      {
        title: "Saddle Dikiş Cüzdan",
        description: "Uzun ömürlü kullanım için saddle stitch tekniğiyle işlenmiş cüzdan.",
        pricing: { type: "custom", label: "Özel Tasarım" },
        imageSrc: "/images/home/collection-leather.png",
        imageAlt: "El işçiliği detayına sahip deri ürün yakın planı.",
        orderType: "custom",
        href: "/products/gunesin-gozyasi-vazo",
      },
    ],
  },
]

export const makerOfWeek = {
  badge: "Haftanın Koleksiyonu",
  name: "Toprak ve Ateş Seçkisi",
  quote:
    '"Fırının ateşiyle şekillenen bu seçki, gündelik kullanım için üretilmiş ama her parçasında ustalığın izini taşıyan seramiklerden oluşuyor."',
  experience: "18",
  experienceLabel: "Parçalık Seçki",
  uniqueWorkCount: "4",
  uniqueWorkLabel: "Alt Kategori",
  primaryAction: "Koleksiyonu Gör",
  secondaryAction: "Ürünleri İncele",
}

export const makerGallery = [
  {
    imageSrc:
      "/images/home/maker-1.png",
    imageAlt: "Cam üfleyen usta sanatçı.",
  },
  {
    imageSrc:
      "/images/home/maker-2.png",
    imageAlt: "Raf üstünde sergilenen cam heykel.",
  },
  {
    imageSrc:
      "/images/home/maker-3.png",
    imageAlt: "Fırın ve araçlarla dolu cam atölyesi.",
  },
  {
    imageSrc:
      "/images/home/maker-4.png",
    imageAlt: "Erimiş camın yakından detay görünümü.",
  },
]

export const productStories: ProductStory[] = [
  {
    href: "/stories/indigonun-sakin-melodisi",
    title: "Indigo'nun Sakin Melodisi: Doğal Boyama Sanatı",
    category: "Kumaş Boyama",
    summary:
      "Bitkisel boyaların kumaşla buluşma anı, kimyasal süreçlerden uzak, doğanın kendi ritminde gerçekleşir. Bu hikayede rengin doğuşunu izliyoruz.",
    readTime: "7 dk okuma",
    author: "Ayşe Nur",
    imageSrc:
      "/images/home/story-indigo.png",
    imageAlt: "Indigo ile boyanmış kumaş örnekleri.",
    authorImageSrc:
      "/images/home/author-ayse.png",
    authorImageAlt: "Usta Ayşe Nur portresi.",
  },
  {
    href: "/stories/zeytin-dalindan-bir-sofra-hikayesi",
    title: "Zeytin Dalından Bir Sofra Hikayesi",
    category: "Oymacılık",
    summary:
      "Yüzlerce yıllık zeytin ağaçlarının budanan dalları, bir ustanın elinde nasıl sofralarınızın baş tacı olan bir kaseye dönüşür?",
    readTime: "8 dk okuma",
    author: "Caner Bey",
    imageSrc:
      "/images/home/story-olive.png",
    imageAlt: "Geleneksel ahşap oyma araçları.",
    authorImageSrc:
      "/images/home/author-caner.png",
    authorImageAlt: "Usta Caner Bey portresi.",
  },
  {
    href: "/stories/gumuste-gizlenen-telkari-mirasi",
    title: "Gümüşte Gizlenen Telkari Mirası",
    category: "Kuyumculuk",
    summary:
      "İncecik gümüş tellerin bir dantel gibi işlenmesiyle ortaya çıkan telkari sanatı, Mardin'in dar sokaklarından dünyaya açılıyor.",
    readTime: "7 dk okuma",
    author: "Leyla Hanım",
    imageSrc:
      "/images/home/story-telkari.png",
    imageAlt: "Elle işlenen gümüş takı detayları.",
    authorImageSrc:
      "/images/home/author-leyla.png",
    authorImageAlt: "Usta Leyla Hanım portresi.",
  },
]

const homepagePriceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
})

export function formatHomepageProductPricing(product: HomepageCategoryProduct) {
  if (product.pricing.type === "fixed") {
    return homepagePriceFormatter.format(product.pricing.amount)
  }

  return product.pricing.label
}
