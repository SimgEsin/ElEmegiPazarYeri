import apiClient from "@/lib/axios"

export type FollowedArtisan = {
  followId: string
  artisanProfileId: string
  slug: string
  displayName: string
  craft: string
  city: string
  ratingAvg: number
  productCount: number
}

export async function getMyFollowing(): Promise<FollowedArtisan[]> {
  const response = await apiClient.get<FollowedArtisan[]>("/artisanprofiles/me/following")
  return response.data
}

export async function isFollowing(artisanProfileId: string): Promise<boolean> {
  const response = await apiClient.get<boolean>(`/artisanprofiles/${artisanProfileId}/is-following`)
  return response.data
}

export async function followArtisan(artisanProfileId: string): Promise<void> {
  await apiClient.post(`/artisanprofiles/${artisanProfileId}/follow`, {})
}

export async function unfollowArtisan(artisanProfileId: string): Promise<void> {
  await apiClient.delete(`/artisanprofiles/${artisanProfileId}/follow`)
}
