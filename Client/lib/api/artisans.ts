import apiClient from "@/lib/axios"
import type { ArtisanProfile, ArtisanProfileDetails } from "@/lib/api/types"

export async function getArtisanProfiles(options?: { signal?: AbortSignal }): Promise<ArtisanProfile[]> {
  const response = await apiClient.get<ArtisanProfile[]>("/artisanprofiles", { signal: options?.signal })
  return response.data
}

export async function getArtisanProfileById(id: string): Promise<ArtisanProfile> {
  const response = await apiClient.get<ArtisanProfile>(`/artisanprofiles/${id}`)
  return response.data
}

export async function getArtisanProfileBySlug(slug: string): Promise<ArtisanProfile | null> {
  const response = await apiClient.get<ArtisanProfile>(`/artisanprofiles/slug/${slug}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
  })
  return response.status === 404 ? null : response.data
}

export async function getMyArtisanProfile(): Promise<ArtisanProfileDetails | null> {
  const response = await apiClient.get<ArtisanProfileDetails>("/artisanprofiles/me", {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
  })
  return response.status === 404 ? null : response.data
}

export type ArtisanProfileImageInput = {
  name: string
  url: string
  altText?: string
  sortOrder?: number
}

export type ArtisanProfilePayload = {
  slug: string
  displayName: string
  craft: string
  city: string
  bio?: string
  avatarUrl?: string
  ratingAvg?: number
  followerCount?: number
  productCount?: number
  isVerified?: boolean
  galleryImages?: ArtisanProfileImageInput[]
}

export async function createArtisanProfile(payload: ArtisanProfilePayload): Promise<string> {
  // POST binds CreateArtisanProfileCommand(CreateArtisanProfileDto ArtisanProfile).
  const response = await apiClient.post<string>("/artisanprofiles", { artisanProfile: payload })
  return response.data
}

export async function updateArtisanProfile(id: string, payload: ArtisanProfilePayload): Promise<void> {
  // PUT binds UpdateArtisanProfileDto directly.
  await apiClient.put(`/artisanprofiles/${id}`, payload)
}

export async function deleteArtisanProfile(id: string): Promise<void> {
  await apiClient.delete(`/artisanprofiles/${id}`)
}
