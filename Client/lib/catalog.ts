import type { ArtisanProduct, ProductImage, ProductStory } from "@/app/artisan-panel/panel-types"

export const DEFAULT_ARTISAN_SLUG = "zeynep-yilmaz"
export const DEFAULT_ARTISAN_NAME = "Zeynep Yılmaz"

const allowedStoryImageFallbacks: ProductImage[] = [
  {
    name: "Atölye Masası",
    previewUrl: "/images/artisans/zeynep-yilmaz/studio-1.jpg",
    alt: "Atölyede seramik çarkında çalışan eller.",
  },
  {
    name: "Kuruyan Parçalar",
    previewUrl: "/images/artisans/zeynep-yilmaz/studio-2.jpg",
    alt: "Atölye rafında kuruyan el yapımı vazolar.",
  },
  {
    name: "Boyama Süreci",
    previewUrl: "/images/artisans/zeynep-yilmaz/studio-3.jpg",
    alt: "Seramik boyama yapan sanatçının detay çekimi.",
  },
  {
    name: "Gün Işığı Atölyesi",
    previewUrl: "/images/artisans/zeynep-yilmaz/studio-4.jpg",
    alt: "Atölyenin güneş alan masası ve araç gereçler.",
  },
]

export const initialCatalogProducts: ArtisanProduct[] = [
  {
    id: "product-1",
    slug: "gunesin-gozyasi-vazo",
    pageHref: "/products/gunesin-gozyasi-vazo",
    artisanSlug: DEFAULT_ARTISAN_SLUG,
    artisanName: DEFAULT_ARTISAN_NAME,
    name: "Güneşin Gözyaşı Vazo",
    category: "Seramik",
    price: 2450,
    stock: 6,
    status: "Yayında",
    salesMode: "Siparişe Özel Üretim",
    summary: "Kapadokya toprağından üretilen, her biri tekil desen taşıyan el yapımı seramik vazo.",
    storyTitle: "Gün Batımının Topraktaki İzleri",
    storyContent: [
      "<p>Bu vazo, gün batımında Kapadokya vadilerinin aldığı sıcak renkten doğdu. Çamuru yoğururken ilk niyetim yalnızca bir form üretmek değil, ışığın toprağın üzerinde bıraktığı izi saklayabilmekti.</p>",
      `<p><img src="${allowedStoryImageFallbacks[0].previewUrl}" alt="${allowedStoryImageFallbacks[0].alt}" /></p>`,
      "<p>Boyun kısmını özellikle dar bıraktım; böylece sır akarken yüzeyde daha yavaş hareket etti ve her pişirimde başka bir iz bıraktı. Hiçbir yüzeyin diğerine benzememesini seviyorum, çünkü bu parçada kusursuz tekrar değil, canlılık arıyorum.</p>",
      "<p><strong>Her fırın açılışı</strong> bana aynı şeyi hatırlatıyor: aynı reçete bile başka bir gün başka bir karaktere dönüşebilir.</p>",
    ].join(""),
    storyImages: allowedStoryImageFallbacks.slice(0, 2),
    material: "Avanos Kızıl Kili",
    technique: "Geleneksel Çark ve Sırlama",
    productionDuration: "18 Gün",
    deliveryInfo: "Tahmini teslimat: 25-30 gün",
    dimensions: {
      height: "32 cm",
      width: "22 cm",
      weight: "1.4 kg",
    },
    heroImage: {
      name: "Güneşin Gözyaşı Hero",
      previewUrl: "/images/products/gunesin-gozyasi-vazo/hero.jpg",
      alt: "Turuncu sır detayına sahip el yapımı seramik vazonun yakın plan görüntüsü.",
    },
    galleryImages: [
      {
        name: "Doku Yakın Plan",
        previewUrl: "/images/products/gunesin-gozyasi-vazo/thumb-texture.jpg",
        alt: "Seramik yüzey dokusunun detay görüntüsü.",
      },
      {
        name: "Çarkta Şekillendirme",
        previewUrl: "/images/products/gunesin-gozyasi-vazo/thumb-wheel.jpg",
        alt: "Çömlekçi çarkında kil şekillendirme anı.",
      },
      {
        name: "Fırın Süreci",
        previewUrl: "/images/products/gunesin-gozyasi-vazo/thumb-kiln.jpg",
        alt: "Fırınlama sürecinden bir kare.",
      },
    ],
    views: 428,
    salesCount: 19,
    revenue: 46550,
  },
  {
    id: "product-2",
    slug: "stok-seramik-vazo",
    pageHref: "/products/stok-seramik-vazo",
    artisanSlug: DEFAULT_ARTISAN_SLUG,
    artisanName: DEFAULT_ARTISAN_NAME,
    name: "Stok Seramik Vazo",
    category: "Seramik",
    price: 1290,
    stock: 14,
    status: "Yayında",
    salesMode: "Hazır Eser",
    summary: "Atölyede üretimi tamamlanmış, hazır stokta bekleyen el yapımı seramik vazo.",
    storyTitle: "Beklemeden Eve Gelen Parça",
    storyContent: [
      "<p>Hazır eserlerimde de üretim ritmini görünür bırakmak istiyorum. Bu vazo, özel sipariş bekleme süresi olmadan eve ulaşsa da atölyedeki sakin üretim temposunu üzerinde taşıyor.</p>",
      `<p><img src="${allowedStoryImageFallbacks[2].previewUrl}" alt="${allowedStoryImageFallbacks[2].alt}" /></p>`,
      "<p><em>Stokta hazır</em> olması benim için acele üretilmiş olması anlamına gelmiyor; tam tersine, önce atölyede yaşayıp sonra doğru evini bulan bir parça gibi düşünüyorum.</p>",
      "<p>Sade formu sayesinde masada, konsolda ya da pencere önünde farklı roller üstlenebiliyor. Hikayesinin bir kısmı atölyede yazıldıysa, geri kalanı kullanıldığı evde tamamlanıyor.</p>",
    ].join(""),
    storyImages: allowedStoryImageFallbacks.slice(2, 4),
    material: "Avanos Kızıl Kili",
    technique: "Geleneksel Çark ve Sırlama",
    productionDuration: "2 Gün",
    deliveryInfo: "Tahmini teslimat: 2-4 iş günü",
    dimensions: {
      height: "29 cm",
      width: "18 cm",
      weight: "1.1 kg",
    },
    heroImage: {
      name: "Stok Seramik Hero",
      previewUrl: "/images/products/gunesin-gozyasi-vazo/related-mini-kase.jpg",
      alt: "Hazır stok seramik vazonun doğal ışıkta çekilmiş ürün görseli.",
    },
    galleryImages: [
      {
        name: "Yandan Görünüm",
        previewUrl: "/images/products/gunesin-gozyasi-vazo/related-terra-tabak.jpg",
        alt: "Stok seramik ürünün yandan görünümü.",
      },
      {
        name: "Doku Detayı",
        previewUrl: "/images/products/gunesin-gozyasi-vazo/hero.jpg",
        alt: "Seramik yüzey dokusunu gösteren yakın plan.",
      },
      {
        name: "Yaşam Alanı Kullanımı",
        previewUrl: "/images/products/gunesin-gozyasi-vazo/related-deniz-kup.jpg",
        alt: "Vazonun farklı bir yaşam alanında kullanımı.",
      },
    ],
    views: 302,
    salesCount: 24,
    revenue: 30960,
  },
  {
    id: "product-3",
    slug: "oyma-servis-tahtasi",
    pageHref: null,
    artisanSlug: DEFAULT_ARTISAN_SLUG,
    artisanName: DEFAULT_ARTISAN_NAME,
    name: "Oyma Servis Tahtası",
    category: "Ahşap",
    price: 980,
    stock: 3,
    status: "Stokta Az",
    salesMode: "Hazır Eser",
    summary: "Günlük servislerde kullanılmak üzere doğal damar yapısı korunarak üretilmiş ahşap servis tahtası.",
    storyTitle: "Damarı Saklamadan Şekillendirmek",
    storyContent: [
      "<p>Bu tahtayı yaparken yüzeyi fazla düzleştirmemeye karar verdim. Ahşabın kendi yönünü belli eden damar çizgileri, parçanın en dürüst kısmı.</p>",
      "<p>Keskin hatlar yerine elde tutuşta yumuşak bir akış hedefledim. Böylece sadece servis objesi değil, günlük mutfağın yaşayan bir parçası oldu.</p>",
      `<p><img src="${allowedStoryImageFallbacks[1].previewUrl}" alt="${allowedStoryImageFallbacks[1].alt}" /></p>`,
      "<p>Her yağlama katmanında yüzey biraz daha koyulaştı ve çizgiler daha görünür hale geldi. En sevdiğim an tam da bu: malzemenin kendi sesinin yükseldiği an.</p>",
    ].join(""),
    storyImages: [allowedStoryImageFallbacks[1]],
    material: "Zeytin Ağacı",
    technique: "El Oyması ve Doğal Yağ Bitirme",
    productionDuration: "4 Gün",
    deliveryInfo: "Tahmini teslimat: 3-5 iş günü",
    dimensions: {
      height: "42 cm",
      width: "18 cm",
      weight: "0.8 kg",
    },
    heroImage: {
      name: "Oyma Servis Tahtası",
      previewUrl: "/images/home/collection-wood.png",
      alt: "Ahşap sunum ürünleri ve oyma detaylar.",
    },
    galleryImages: [
      {
        name: "Damar Detayı",
        previewUrl: "/images/home/collection-wood.png",
        alt: "Ahşap damar desenini gösteren yakın plan.",
      },
    ],
    views: 196,
    salesCount: 11,
    revenue: 10780,
  },
]

export function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function createExcerptFromHtml(html: string, maxLength = 180) {
  const plainText = stripHtml(html)

  if (plainText.length <= maxLength) {
    return plainText
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`
}

export function createSlug(input: string) {
  return input
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function calculateReadTimeLabel(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 180))
  return `${minutes} dk okuma`
}

export function sanitizeStoryHtml(html: string) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\son\w+=\{[^}]*\}/gi, "")

  return withoutScripts.replace(/<(\/?)([a-z0-9-]+)([^>]*)>/gi, (_, slash: string, tagName: string, attrs: string) => {
    const allowedTag = tagName.toLowerCase()

    if (!["p", "strong", "em", "ul", "ol", "li", "blockquote", "img", "br"].includes(allowedTag)) {
      return ""
    }

    if (slash) {
      return `</${allowedTag}>`
    }

    if (allowedTag === "img") {
      const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i)
      const altMatch = attrs.match(/\salt=["']([^"']*)["']/i)
      const src = srcMatch?.[1] ?? ""
      const alt = altMatch?.[1] ?? ""

      if (!src) {
        return ""
      }

      return `<img src="${src}" alt="${alt}" />`
    }

    return allowedTag === "br" ? "<br />" : `<${allowedTag}>`
  })
}

export function createProductStory(product: ArtisanProduct, featuredStoryId?: string | null): ProductStory {
  const sanitizedContent = sanitizeStoryHtml(product.storyContent)
  const coverImage = product.storyImages[0] ?? product.heroImage ?? null
  const slugBase = product.storyTitle.trim() || product.name.trim()
  const slug = createSlug(slugBase)

  return {
    id: `story-${product.id}`,
    slug,
    title: product.storyTitle.trim(),
    excerpt: createExcerptFromHtml(sanitizedContent),
    contentHtml: sanitizedContent,
    coverImage,
    storyImages: product.storyImages,
    artisanSlug: product.artisanSlug,
    artisanName: product.artisanName,
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    productPageHref: product.pageHref,
    category: product.category,
    readTime: calculateReadTimeLabel(sanitizedContent),
    isFeatured: featuredStoryId ? featuredStoryId === `story-${product.id}` : product.id === initialCatalogProducts[0]?.id,
  }
}

export function createStoriesFromProducts(products: ArtisanProduct[], featuredStoryId?: string | null) {
  return products.map((product) => createProductStory(product, featuredStoryId))
}

export function getInitialStories() {
  return createStoriesFromProducts(initialCatalogProducts)
}
