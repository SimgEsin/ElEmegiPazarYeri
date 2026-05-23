import { cartItems, getProductBySlug, type Product } from "@/lib/mock-data"

export type CartLineItem = {
  product: Product
  quantity: number
  buyerNote: string
}

export const CART_SHIPPING_FEE = 120
export const CART_CHECKOUT_ITEMS_STORAGE_KEY = "cart:checkout-items"

export function getInitialCartLineItems(): CartLineItem[] {
  return cartItems
    .map((item) => {
      const product = getProductBySlug(item.productSlug)
      if (!product) return null

      return {
        product,
        quantity: Math.max(1, item.quantity),
        buyerNote: item.buyerNote,
      }
    })
    .filter((item): item is CartLineItem => Boolean(item))
}
