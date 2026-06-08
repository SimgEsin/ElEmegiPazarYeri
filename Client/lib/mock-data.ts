import type { CancellationRequest } from "@/lib/order-types"

export type Artisan = {
  name: string
  city: string
  craft: string
  yearsOfPractice: number
}

export type Product = {
  id: string
  slug: string
  name: string
  categorySlug: string
  categoryName: string
  shortDescription: string
  story: string
  productionTime: string
  price: number
  originalPrice?: number
  isSoldOut?: boolean
  customizable: boolean
  artisan: Artisan
}

export type Category = {
  slug: string
  name: string
  description: string
  mood: string
}

export type CartItem = {
  productSlug: string
  quantity: number
  buyerNote: string
}

export type AccountOrder = {
  id: string
  referenceId: string
  date: string
  status: "Hazırlanıyor" | "Kargoda" | "Teslim Edildi"
  productSlug: string
  total: number
  cancellationRequest?: CancellationRequest
}

export const categories: Category[] = [
  {
    slug: "dokuma",
    name: "Dokuma",
    description: "El tezgahında üretilen masa ve yaşam tekstilleri.",
    mood: "Doğal dokular, sıcak tonlar",
  },
  {
    slug: "seramik",
    name: "Seramik",
    description: "Gündelik kullanım için özgün seramik ürünler.",
    mood: "Toprak hissi, yalın form",
  },
  {
    slug: "ahsap-oyma",
    name: "Ahşap Oyma",
    description: "Ustalık gerektiren oymalı dekoratif ürünler.",
    mood: "Geleneksel detay, modern yorum",
  },
  {
    slug: "takilar",
    name: "Takılar",
    description: "Küçük serili, hikayesi olan elde üretilmiş aksesuarlar.",
    mood: "Kişisel ve benzersiz",
  },
]

export const products: Product[] = [
  {
    id: "p-01",
    slug: "anadolu-dokuma-sofra-ortusu",
    name: "Anadolu Dokuma Sofra Örtüsü",
    categorySlug: "dokuma",
    categoryName: "Dokuma",
    shortDescription: "Keten ve pamuk karışımlı, tezgah dokuma sofra örtüsü.",
    story:
      "Bu parça, dokuma desenlerinde Kapadokya kayalarından esinlenen geçişler kullanılarak hazırlanıyor.",
    productionTime: "4-6 gün",
    price: 1850,
    originalPrice: 2200,
    customizable: true,
    artisan: {
      name: "Hatice Yıldız",
      city: "Nevşehir",
      craft: "Geleneksel dokuma",
      yearsOfPractice: 12,
    },
  },
  {
    id: "p-02",
    slug: "ceviz-oyma-sunum-tepsisi",
    name: "Ceviz Oyma Sunum Tepsisi",
    categorySlug: "ahsap-oyma",
    categoryName: "Ahşap Oyma",
    shortDescription: "Tek parça cevizden elde oyulan sunum tepsisi.",
    story:
      "Oyma motifleri, ustanın çocukluğunda gördüğü eski sandık kapaklarından ilham alıyor.",
    productionTime: "7-9 gün",
    price: 2400,
    customizable: true,
    artisan: {
      name: "Mehmet Çınar",
      city: "Kütahya",
      craft: "Ahşap oyma",
      yearsOfPractice: 18,
    },
  },
  {
    id: "p-03",
    slug: "mat-seramik-kahve-fincani-seti",
    name: "Mat Seramik Kahve Fincanı Seti",
    categorySlug: "seramik",
    categoryName: "Seramik",
    shortDescription: "4'lü, elde şekillendirilmiş kahve fincanı seti.",
    story:
      "Fincanların içi parlak, dışı mat bırakılarak kahve seremonisine sakin bir denge kazandırılıyor.",
    productionTime: "5-7 gün",
    price: 1650,
    customizable: false,
    artisan: {
      name: "Selin Erdem",
      city: "Çanakkale",
      craft: "Seramik şekillendirme",
      yearsOfPractice: 9,
    },
  },
  {
    id: "p-04",
    slug: "lale-islemeli-ipek-sal",
    name: "Lale İşlemeli İpek Şal",
    categorySlug: "dokuma",
    categoryName: "Dokuma",
    shortDescription: "İnce ipek yüzey üzerine elde işlenmiş lale motifi.",
    story:
      "Her şalda tek bir ana motif seçiliyor, renk geçişleri ürün bazında farklı çalışılıyor.",
    productionTime: "6-8 gün",
    price: 2100,
    customizable: true,
    artisan: {
      name: "Fadime Koç",
      city: "Bursa",
      craft: "İpek işleme",
      yearsOfPractice: 15,
    },
  },
  {
    id: "p-05",
    slug: "ham-bakir-detayli-seramik-vazo",
    name: "Ham Bakır Detaylı Seramik Vazo",
    categorySlug: "seramik",
    categoryName: "Seramik",
    shortDescription: "Toprak tonlu seramik gövde ve bakır dokunuşlu kenarlar.",
    story:
      "Vazo kenarında kullanılan bakır detay, elde patina ile yaşlandırılarak daha sıcak bir görünüm veriyor.",
    productionTime: "8-10 gün",
    price: 2750,
    isSoldOut: true,
    customizable: false,
    artisan: {
      name: "Ayşe Bostan",
      city: "Eskişehir",
      craft: "Seramik yüzey tekniği",
      yearsOfPractice: 11,
    },
  },
  {
    id: "p-06",
    slug: "gumus-telkari-yuzuk",
    name: "Gümüş Telkari Yüzük",
    categorySlug: "takilar",
    categoryName: "Takılar",
    shortDescription: "İnce telkari örgülü, ayarlanabilir gümüş yüzük.",
    story:
      "Yüzük deseni Mardin telkari geleneğinden esinleniyor; her parça farklı örgü yoğunluğuna sahip.",
    productionTime: "3-5 gün",
    price: 1420,
    customizable: true,
    artisan: {
      name: "Nergis Aydın",
      city: "Mardin",
      craft: "Telkari",
      yearsOfPractice: 14,
    },
  },
  {
    id: "p-07",
    slug: "keceden-duvar-panosi",
    name: "Keçeden Duvar Panosu",
    categorySlug: "dokuma",
    categoryName: "Dokuma",
    shortDescription: "Doğal boyalı yünden oluşan katmanlı duvar panosu.",
    story:
      "Paneldeki renk geçişleri doğal kök boyalarla elde ediliyor ve her panel için yeniden karıştırılıyor.",
    productionTime: "6-7 gün",
    price: 1960,
    customizable: true,
    artisan: {
      name: "Belgin Uçar",
      city: "Ankara",
      craft: "Keçecilik",
      yearsOfPractice: 10,
    },
  },
  {
    id: "p-08",
    slug: "zeytin-agaci-kahvalti-seti",
    name: "Zeytin Ağacı Kahvaltı Seti",
    categorySlug: "ahsap-oyma",
    categoryName: "Ahşap Oyma",
    shortDescription: "6 parça, elde şekillendirilmiş zeytin ağacı servis seti.",
    story:
      "Ağacın damar yapısı ürün formunu belirliyor; bu nedenle her set tamamen farklı bir iz taşıyor.",
    productionTime: "5-6 gün",
    price: 2250,
    customizable: false,
    artisan: {
      name: "Murat Akay",
      city: "İzmir",
      craft: "Doğal ağaç işleme",
      yearsOfPractice: 16,
    },
  },
]

export const featuredCategorySlugs = ["dokuma", "seramik", "ahsap-oyma"]
export const featuredProductSlugs = [
  "anadolu-dokuma-sofra-ortusu",
  "ceviz-oyma-sunum-tepsisi",
  "mat-seramik-kahve-fincani-seti",
  "gumus-telkari-yuzuk",
]

export const favoriteProductSlugs = [
  "lale-islemeli-ipek-sal",
  "zeytin-agaci-kahvalti-seti",
  "gumus-telkari-yuzuk",
]

export const cartItems: CartItem[] = [
  {
    productSlug: "anadolu-dokuma-sofra-ortusu",
    quantity: 1,
    buyerNote: "Kenar işlemelerinde toprak tonu ağırlıklı olabilir mi?",
  },
  {
    productSlug: "mat-seramik-kahve-fincani-seti",
    quantity: 2,
    buyerNote: "Pakete hediye notu eklensin: 'Yeni eviniz kutlu olsun'.",
  },
]

export const accountOrders: AccountOrder[] = [
  {
    id: "ELI-24031",
    referenceId: "ORD-24031",
    date: "2026-02-17",
    status: "Teslim Edildi",
    productSlug: "ceviz-oyma-sunum-tepsisi",
    total: 2400,
  },
  {
    id: "ELI-24122",
    referenceId: "ORD-24122",
    date: "2026-03-04",
    status: "Kargoda",
    productSlug: "lale-islemeli-ipek-sal",
    total: 2100,
  },
  {
    id: "ELI-24188",
    referenceId: "ORD-24188",
    date: "2026-03-10",
    status: "Hazırlanıyor",
    productSlug: "gumus-telkari-yuzuk",
    total: 1420,
  },
]

export type UserProfile = {
  name: string
  email: string
  phone: string
  birthDate: string
  memberSince: string
  avatarSrc: string
}

export type AccountAddress = {
  id: string
  label: string
  fullAddress: string
  city: string
  postalCode: string
  isDefault: boolean
}

export type FollowedArtisan = {
  id: string
  name: string
  craft: string
  city: string
  avatarSrc: string
  followerCount: number
  productCount: number
  rating: number
  slug: string
  followedAt: string
}

export const userProfile: UserProfile = {
  name: "Elif Kaya",
  email: "elif.kaya@email.com",
  phone: "+90 532 123 45 67",
  birthDate: "1994-04-12",
  memberSince: "2025-09-15",
  avatarSrc: "/images/home/profile.png",
}

export const accountAddresses: AccountAddress[] = [
  {
    id: "addr-1",
    label: "Ev Adresi",
    fullAddress: "Çankaya Mah. Atatürk Bulvarı No:42 Daire:5",
    city: "Ankara",
    postalCode: "06690",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "İş Adresi",
    fullAddress: "Levent Mah. Büyükdere Cad. No:185 Kat:12",
    city: "İstanbul",
    postalCode: "34394",
    isDefault: false,
  },
  {
    id: "addr-3",
    label: "Yazlık",
    fullAddress: "Alaçatı Mah. Bağ Yolu Sok. No:8",
    city: "İzmir",
    postalCode: "35937",
    isDefault: false,
  },
]

export const followedArtisans: FollowedArtisan[] = [
  {
    id: "artisan-1",
    name: "Zeynep Yılmaz",
    craft: "Geleneksel Seramik",
    city: "İstanbul",
    avatarSrc: "/images/artisans/zeynep-yilmaz/profile.jpg",
    followerCount: 1200,
    productCount: 48,
    rating: 4.9,
    slug: "zeynep-yilmaz",
    followedAt: "2026-01-10",
  },
  {
    id: "artisan-2",
    name: "Hatice Yıldız",
    craft: "Geleneksel Dokuma",
    city: "Nevşehir",
    avatarSrc: "/images/home/profile.png",
    followerCount: 870,
    productCount: 32,
    rating: 4.8,
    slug: "hatice-yildiz",
    followedAt: "2026-02-05",
  },
  {
    id: "artisan-3",
    name: "Nergis Aydın",
    craft: "Telkari",
    city: "Mardin",
    avatarSrc: "/images/home/profile.png",
    followerCount: 650,
    productCount: 21,
    rating: 4.7,
    slug: "nergis-aydin",
    followedAt: "2026-03-18",
  },
]

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug)
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price)
}

export type ThreadParticipantRole = "artisan" | "customer"

export type ThreadSender = "artisan" | "customer"

export type ThreadStatus =
  | "Aktif"
  | "Okunmamış"
  | "Cevap Bekliyor"
  | "Mutabakata Döndü"
  | "Arşivlendi"
  | "Kapatıldı"

export type ThreadMessage = {
  id: string
  sender: ThreadSender
  text: string
  timeLabel: string
}

export type MessageThread = {
  id: string
  subject: string
  participantName: string
  participantRole: ThreadParticipantRole
  productName: string
  status: ThreadStatus
  unreadCount: number
  updatedAt: string
  messages: ThreadMessage[]
}

export type ConsensusStatus =
  | "İnceleme Bekliyor"
  | "Revize Gönderildi"
  | "Teklif Hazırlandı"
  | "Onay Bekliyor"
  | "Reddedildi"
  | "Süresi Doldu"
  | "Siparişe Dönüştü"

export type ConsensusItem = {
  id: string
  title: string
  counterpartyName: string
  productName: string
  summary: string
  status: ConsensusStatus
  updatedAt: string
  ctaLabel?: string
  href?: string
}

export type NotificationType = "message" | "agreement" | "system"

export type NotificationTargetModule = "messages" | "agreements"

export type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  description: string
  createdAt: string
  isRead: boolean
  targetModule: NotificationTargetModule
  targetId: string
}

export const artisanMessageThreads: MessageThread[] = [
  {
    id: "artisan-thread-1",
    subject: "Güneş Motifli Vazo / özel üretim",
    participantName: "Merve Kaya",
    participantRole: "customer",
    productName: "Güneş Motifli Vazo",
    status: "Okunmamış",
    unreadCount: 2,
    updatedAt: "2026-04-24T10:18:00+03:00",
    messages: [
      {
        id: "artisan-thread-1-msg-1",
        sender: "customer",
        text: "Renk paletinde daha kiremit ağırlıklı bir geçiş deneyebilir miyiz?",
        timeLabel: "09:58",
      },
      {
        id: "artisan-thread-1-msg-2",
        sender: "artisan",
        text: "Evet, sır tonunu sıcaklaştırıp omuz çizgisini biraz daha belirgin yapabilirim.",
        timeLabel: "10:04",
      },
      {
        id: "artisan-thread-1-msg-3",
        sender: "customer",
        text: "Harika, bu versiyonla mutabakata yaklaşmış olduk. Teslim süresi de aynı kalıyor mu?",
        timeLabel: "10:18",
      },
    ],
  },
  {
    id: "artisan-thread-2",
    subject: "Dokuma runner kenar işlemesi",
    participantName: "Ayşe Demir",
    participantRole: "customer",
    productName: "Anadolu Dokuma Runner",
    status: "Cevap Bekliyor",
    unreadCount: 0,
    updatedAt: "2026-04-24T09:02:00+03:00",
    messages: [
      {
        id: "artisan-thread-2-msg-1",
        sender: "customer",
        text: "Kenar bordüründe daha ince bir desen tercih ediyorum.",
        timeLabel: "08:42",
      },
      {
        id: "artisan-thread-2-msg-2",
        sender: "artisan",
        text: "İnce bordürlü ikinci bir örnek hazırlayıp bugün görsel paylaşacağım.",
        timeLabel: "09:02",
      },
    ],
  },
  {
    id: "artisan-thread-3",
    subject: "Oyma servis tahtası gravür notu",
    participantName: "Deniz Tunç",
    participantRole: "customer",
    productName: "Oyma Servis Tahtası",
    status: "Mutabakata Döndü",
    unreadCount: 0,
    updatedAt: "2026-04-23T18:40:00+03:00",
    messages: [
      {
        id: "artisan-thread-3-msg-1",
        sender: "customer",
        text: "Üst bölüme kısa bir tarih gravürü eklenmesini rica ediyorum.",
        timeLabel: "18:21",
      },
      {
        id: "artisan-thread-3-msg-2",
        sender: "artisan",
        text: "Metni ve puntoyu netleştirdikten sonra mutabakat kartına geçiriyorum.",
        timeLabel: "18:40",
      },
    ],
  },
  {
    id: "artisan-thread-4",
    subject: "Bakır detaylı vazo paket notu",
    participantName: "Selin Aras",
    participantRole: "customer",
    productName: "Ham Bakır Detaylı Seramik Vazo",
    status: "Aktif",
    unreadCount: 0,
    updatedAt: "2026-04-22T16:12:00+03:00",
    messages: [
      {
        id: "artisan-thread-4-msg-1",
        sender: "customer",
        text: "Hediye kartı eklenebiliyor mu diye sormak istedim.",
        timeLabel: "16:06",
      },
      {
        id: "artisan-thread-4-msg-2",
        sender: "artisan",
        text: "Evet, kısa notu kutuya ekleyebiliyoruz.",
        timeLabel: "16:12",
      },
    ],
  },
]

export const customerMessageThreads: MessageThread[] = [
  {
    id: "customer-thread-1",
    subject: "Güneş Motifli Vazo / detay görüşmesi",
    participantName: "Elif Usta",
    participantRole: "artisan",
    productName: "Güneş Motifli Vazo",
    status: "Okunmamış",
    unreadCount: 1,
    updatedAt: "2026-04-24T10:24:00+03:00",
    messages: [
      {
        id: "customer-thread-1-msg-1",
        sender: "customer",
        text: "38 cm yüksekliğe sadık kalalım, ağız formunu biraz genişletelim istiyorum.",
        timeLabel: "10:07",
      },
      {
        id: "customer-thread-1-msg-2",
        sender: "artisan",
        text: "Formu güncelledim. Yeni siluet, gün batımı tonlarıyla daha dengeli duracak.",
        timeLabel: "10:24",
      },
    ],
  },
  {
    id: "customer-thread-2",
    subject: "İpek şal renk geçişi",
    participantName: "Fadime Koç",
    participantRole: "artisan",
    productName: "Lale İşlemeli İpek Şal",
    status: "Cevap Bekliyor",
    unreadCount: 0,
    updatedAt: "2026-04-24T08:36:00+03:00",
    messages: [
      {
        id: "customer-thread-2-msg-1",
        sender: "artisan",
        text: "Toz pembe yerine daha nar çiçeği bir ton denemek ister misiniz?",
        timeLabel: "08:20",
      },
      {
        id: "customer-thread-2-msg-2",
        sender: "customer",
        text: "Evet, nar çiçeği tonunu deneyebiliriz. Fotoğraf paylaşırsanız çok iyi olur.",
        timeLabel: "08:36",
      },
    ],
  },
  {
    id: "customer-thread-3",
    subject: "Telkari yüzük ölçü teyidi",
    participantName: "Nergis Aydın",
    participantRole: "artisan",
    productName: "Gümüş Telkari Yüzük",
    status: "Mutabakata Döndü",
    unreadCount: 0,
    updatedAt: "2026-04-23T20:10:00+03:00",
    messages: [
      {
        id: "customer-thread-3-msg-1",
        sender: "artisan",
        text: "Ölçü ve taş yoğunluğu netleştiğinde mutabakatı açıyorum.",
        timeLabel: "19:55",
      },
      {
        id: "customer-thread-3-msg-2",
        sender: "customer",
        text: "Ölçü 14, taş yoğunluğu ise daha minimal olsun.",
        timeLabel: "20:10",
      },
    ],
  },
]

export const artisanConsensusItems: ConsensusItem[] = [
  {
    id: "artisan-consensus-1",
    title: "Güneş Motifli Vazo / renk ve form mutabakatı",
    counterpartyName: "Merve Kaya",
    productName: "Güneş Motifli Vazo",
    summary: "38 cm yükseklik, kiremit-turuncu geçiş, mat yüzey ve geniş ağız formu netleşti.",
    status: "Onay Bekliyor",
    updatedAt: "2026-04-24T10:20:00+03:00",
    ctaLabel: "Alıcı Onayı Bekleniyor",
  },
  {
    id: "artisan-consensus-2",
    title: "Dokuma runner / yeni bordür revizyonu",
    counterpartyName: "Ayşe Demir",
    productName: "Anadolu Dokuma Runner",
    summary: "İnce bordürlü ikinci varyasyon müşteriye iletildi, son karar bekleniyor.",
    status: "Revize Gönderildi",
    updatedAt: "2026-04-24T09:05:00+03:00",
    ctaLabel: "Revizeyi Görüntüledi",
  },
  {
    id: "artisan-consensus-3",
    title: "Oyma servis tahtası / gravür metni",
    counterpartyName: "Deniz Tunç",
    productName: "Oyma Servis Tahtası",
    summary: "Gravür metni ve konumlandırması netleşti, teklif taslağı hazırlanıyor.",
    status: "Teklif Hazırlandı",
    updatedAt: "2026-04-23T18:48:00+03:00",
    ctaLabel: "Teklif Taslağı Hazır",
  },
  {
    id: "artisan-consensus-4",
    title: "Bakır detaylı vazo / teslimat bilgisi",
    counterpartyName: "Selin Aras",
    productName: "Ham Bakır Detaylı Seramik Vazo",
    summary: "Paket notu ve teslimat penceresi netleşti, son inceleme bekleniyor.",
    status: "İnceleme Bekliyor",
    updatedAt: "2026-04-22T16:18:00+03:00",
    ctaLabel: "İncelemeye Gönderildi",
  },
]

export const customerConsensusItems: ConsensusItem[] = [
  {
    id: "customer-consensus-1",
    title: "Güneş Motifli Vazo / üretim öncesi onay",
    counterpartyName: "Elif Usta",
    productName: "Güneş Motifli Vazo",
    summary: "38 cm ölçü, gün batımı tonları ve mat sır yüzeyi için son onayınız bekleniyor.",
    status: "Onay Bekliyor",
    updatedAt: "2026-04-24T10:25:00+03:00",
    ctaLabel: "Kararınızı Bekliyor",
  },
  {
    id: "customer-consensus-2",
    title: "İpek şal / renk geçişi revizyonu",
    counterpartyName: "Fadime Koç",
    productName: "Lale İşlemeli İpek Şal",
    summary: "Nar çiçeği tonuna geçildi; önceki kombinasyon reddedildi ve yeni revizyon açıldı.",
    status: "Reddedildi",
    updatedAt: "2026-04-23T17:14:00+03:00",
    ctaLabel: "Yeni Revizyon Bekleniyor",
  },
  {
    id: "customer-consensus-3",
    title: "Telkari yüzük / teklif süresi",
    counterpartyName: "Nergis Aydın",
    productName: "Gümüş Telkari Yüzük",
    summary: "Ölçü ve taş yoğunluğu netleşti ancak teklif süresi dolduğu için yeni versiyon açılacak.",
    status: "Süresi Doldu",
    updatedAt: "2026-04-22T20:42:00+03:00",
    ctaLabel: "Yeni Teklif Bekleniyor",
  },
  {
    id: "customer-consensus-4",
    title: "Ceviz sunum tepsisi / gravür onayı",
    counterpartyName: "Mehmet Çınar",
    productName: "Ceviz Oyma Sunum Tepsisi",
    summary: "Gravür metni onaylandı ve standart siparişe dönüştürüldü.",
    status: "Siparişe Dönüştü",
    updatedAt: "2026-04-21T14:10:00+03:00",
    ctaLabel: "Sipariş Oluşturuldu",
  },
]

export const artisanNotifications: NotificationItem[] = [
  {
    id: "artisan-notification-1",
    type: "message",
    title: "Merve Kaya yeni mesaj gönderdi",
    description: "Güneş Motifli Vazo görüşmesinde teslim süresini yeniden sordu.",
    createdAt: "2026-04-24T10:21:00+03:00",
    isRead: false,
    targetModule: "messages",
    targetId: "artisan-thread-1",
  },
  {
    id: "artisan-notification-2",
    type: "agreement",
    title: "Bir mutabakat alıcı onayı bekliyor",
    description: "Güneş Motifli Vazo için son onay adımına geçildi.",
    createdAt: "2026-04-24T10:20:00+03:00",
    isRead: false,
    targetModule: "agreements",
    targetId: "artisan-consensus-1",
  },
  {
    id: "artisan-notification-3",
    type: "agreement",
    title: "Revize gönderilen runner kaydı güncellendi",
    description: "Ayşe Demir yeni bordür varyasyonunu görüntüledi.",
    createdAt: "2026-04-24T09:08:00+03:00",
    isRead: true,
    targetModule: "agreements",
    targetId: "artisan-consensus-2",
  },
  {
    id: "artisan-notification-4",
    type: "message",
    title: "Deniz Tunç görüşmesi mutabakata döndü",
    description: "Gravür metni netleşti; konuşma artık mutabakat sürecinde.",
    createdAt: "2026-04-23T18:49:00+03:00",
    isRead: true,
    targetModule: "messages",
    targetId: "artisan-thread-3",
  },
]

export const customerNotifications: NotificationItem[] = [
  {
    id: "customer-notification-1",
    type: "message",
    title: "Elif Usta yeni mesaj gönderdi",
    description: "Güneş Motifli Vazo için güncellenmiş form bilgisini paylaştı.",
    createdAt: "2026-04-24T10:24:00+03:00",
    isRead: false,
    targetModule: "messages",
    targetId: "customer-thread-1",
  },
  {
    id: "customer-notification-2",
    type: "agreement",
    title: "Bir mutabakat kararınızı bekliyor",
    description: "Güneş Motifli Vazo üretim öncesi onay adımında.",
    createdAt: "2026-04-24T10:25:00+03:00",
    isRead: false,
    targetModule: "agreements",
    targetId: "customer-consensus-1",
  },
  {
    id: "customer-notification-3",
    type: "agreement",
    title: "Telkari yüzük teklif süresi doldu",
    description: "Yeni teklif versiyonu açılana kadar kayıt izleme modunda kaldı.",
    createdAt: "2026-04-22T20:45:00+03:00",
    isRead: true,
    targetModule: "agreements",
    targetId: "customer-consensus-3",
  },
  {
    id: "customer-notification-4",
    type: "message",
    title: "Fadime Koç sizden yanıt bekliyor",
    description: "İpek şal renk revizyonu için geri dönüşünüz isteniyor.",
    createdAt: "2026-04-24T08:38:00+03:00",
    isRead: true,
    targetModule: "messages",
    targetId: "customer-thread-2",
  },
]
