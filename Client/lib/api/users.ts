import apiClient from "@/lib/axios"

export type UserProfileDto = {
  fullName: string
  email: string
  phoneNumber?: string | null
  dateOfBirth?: string | null
  avatarUrl?: string | null
  registerDate: string
}

export type UpdateUserProfilePayload = {
  fullName: string | null
  phoneNumber: string | null
  dateOfBirth: string | null
  avatarUrl: string | null
}

export async function getMyProfile(): Promise<UserProfileDto> {
  const response = await apiClient.get<UserProfileDto>("/Users/me")
  return response.data
}

export async function updateMyProfile(payload: UpdateUserProfilePayload): Promise<void> {
  await apiClient.put("/Users/me", payload)
}
