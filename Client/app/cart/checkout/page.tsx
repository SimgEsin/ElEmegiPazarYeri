import type { Metadata } from "next"

import { CartCheckoutClient } from "@/app/cart/checkout/cart-checkout-client"
import { getInitialCartLineItems } from "@/lib/cart-view"

export const metadata: Metadata = {
  title: "Sepet Checkout",
  description: "Sepetteki ürünler için adres, kargo ve ödeme adımlarıyla sipariş oluşturun.",
}

export default function CartCheckoutPage() {
  const initialItems = getInitialCartLineItems()

  return <CartCheckoutClient initialItems={initialItems} />
}
