import type { Metadata } from "next"

import { CartPageClient } from "@/app/cart/cart-page-client"

export const metadata: Metadata = {
  title: "Sepet",
  description: "Sepetinizdeki ürünleri düzenleyin ve sipariş özetinizi görüntüleyin.",
}

export default function CartPage() {
  return <CartPageClient />
}
