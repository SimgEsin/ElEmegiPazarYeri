import apiClient from "@/lib/axios"
import type { ConversationListItem, ConversationType } from "@/lib/api/types"

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
  counterpartyName: string
  proposedPrice: number
  status: "Pending" | "Accepted" | "Rejected"
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

export async function makeOffer(conversationId: string, proposedPrice: number): Promise<string> {
  // POST binds MakeOfferCommand(MakeOfferDto Offer).
  const response = await apiClient.post<string>("/conversations/offers", {
    offer: { conversationId, proposedPrice },
  })
  return response.data
}

export async function respondToOffer(offerId: string, isAccepted: boolean): Promise<void> {
  // PUT binds RespondToOfferDto directly.
  await apiClient.put(`/conversations/offers/${offerId}/respond`, { offerId, isAccepted })
}
