import type { Metadata } from "next"

import { CartPageClient } from "@/app/cart/cart-page-client"
import { getInitialCartLineItems } from "@/lib/cart-view"

export const metadata: Metadata = {
  title: "Sepet",
  description: "Sepetinizdeki ürünleri düzenleyin ve sipariş özetinizi görüntüleyin.",
}

export default function CartPage() {
  const initialItems = getInitialCartLineItems()

  return <CartPageClient initialItems={initialItems} />
}
