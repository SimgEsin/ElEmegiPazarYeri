import type { Metadata } from "next"

import { CartCheckoutClient } from "@/app/cart/checkout/cart-checkout-client"

export const metadata: Metadata = {
  title: "Sepet Checkout",
  description: "Sepetteki ürünler için adres, kargo ve ödeme adımlarıyla sipariş oluşturun.",
}

export default function CartCheckoutPage() {
  return <CartCheckoutClient initialItems={[]} />
}
