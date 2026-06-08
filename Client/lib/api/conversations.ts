import apiClient from "@/lib/axios"
import type { AgreementStage, ConversationListItem, ConversationType } from "@/lib/api/types"

export type ConversationMessage = {
  id: string
  senderId: string
  senderRole: "Buyer" | "Artisan"
  content: string
  sentAt: string
}

export type Agreement = {
  id: string
  conversationId: string
  productId: string
  productName: string
  productSlug: string
  counterpartyName: string
  proposedPrice: number
  estimatedDeliveryDays: number
  productDetails: string
  status: "Pending" | "Accepted" | "Rejected"
  stage: AgreementStage
  finalProductNote?: string | null
  finalProductImageUrl?: string | null
  shippingTrackingInfo?: string | null
  updatedAt: string
}

export async function getMyAgreements(): Promise<Agreement[]> {
  const response = await apiClient.get<Agreement[]>("/conversations/agreements")
  return response.data
}

export async function getMyConversations(): Promise<ConversationListItem[]> {
  const response = await apiClient.get<ConversationListItem[]>("/conversations")
  return response.data
}

export async function getConversationMessages(conversationId: string): Promise<ConversationMessage[]> {
  const response = await apiClient.get<ConversationMessage[]>(`/conversations/${conversationId}/messages`)
  return response.data
}

export async function sendMessage(
  productId: string,
  artisanProfileId: string,
  content: string,
  type: ConversationType = "Message",
): Promise<string> {
  // POST binds SendMessageCommand(SendMessageDto Message).
  const response = await apiClient.post<string>("/conversations/messages", {
    message: { productId, artisanProfileId, content, type },
  })
  return response.data
}

export async function makeOffer(
  conversationId: string,
  proposedPrice: number,
  estimatedDeliveryDays: number,
  productDetails: string,
): Promise<string> {
  // POST binds MakeOfferCommand(MakeOfferDto Offer).
  const response = await apiClient.post<string>("/conversations/offers", {
    offer: { conversationId, proposedPrice, estimatedDeliveryDays, productDetails },
  })
  return response.data
}

export async function respondToOffer(offerId: string, isAccepted: boolean): Promise<void> {
  // PUT binds RespondToOfferDto directly.
  await apiClient.put(`/conversations/offers/${offerId}/respond`, { offerId, isAccepted })
}

export async function submitFinalProduct(offerId: string, note: string, imageUrl?: string): Promise<void> {
  // PUT binds SubmitFinalProductDto directly.
  await apiClient.put(`/conversations/offers/${offerId}/final-product`, { note, imageUrl })
}

export async function approveFinalProduct(offerId: string): Promise<void> {
  await apiClient.put(`/conversations/offers/${offerId}/approve-final`)
}

export async function requestRevision(offerId: string): Promise<void> {
  await apiClient.put(`/conversations/offers/${offerId}/request-revision`)
}

export async function markShipped(offerId: string, trackingInfo?: string): Promise<void> {
  // PUT binds MarkShippedDto directly.
  await apiClient.put(`/conversations/offers/${offerId}/ship`, { trackingInfo })
}

export async function markDelivered(offerId: string): Promise<void> {
  await apiClient.put(`/conversations/offers/${offerId}/deliver`)
}
