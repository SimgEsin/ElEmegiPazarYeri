import apiClient from "@/lib/axios"
import type { Cart } from "@/lib/api/types"

export async function getMyCart(): Promise<Cart> {
  const response = await apiClient.get<Cart>("/carts/me")
  return response.data
}

export async function addToCart(productId: string, quantity: number): Promise<string> {
  // POST binds AddToCartCommand(AddToCartDto Item).
  const response = await apiClient.post<string>("/carts/items", { item: { productId, quantity } })
  return response.data
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
  await apiClient.put(`/carts/items/${itemId}`, { quantity })
}

export async function removeCartItem(itemId: string): Promise<void> {
  await apiClient.delete(`/carts/items/${itemId}`)
}
