import apiClient from "@/lib/axios"

export type WorkshopApplicationStatus = "Pending" | "Approved" | "Rejected"

export type WorkshopApplication = {
  id: string
  userId: string
  artisanProfileId: string
  message: string
  status: string
  createdAt: string
  updatedAt?: string | null
}

export async function getWorkshopApplications(options?: { signal?: AbortSignal }): Promise<WorkshopApplication[]> {
  const response = await apiClient.get<WorkshopApplication[]>("/workshopapplications", { signal: options?.signal })
  return response.data
}

export async function updateWorkshopApplicationStatus(
  application: WorkshopApplication,
  status: WorkshopApplicationStatus,
): Promise<void> {
  // PUT binds UpdateWorkshopApplicationDto directly -> send flat.
  await apiClient.put(`/workshopapplications/${application.id}`, {
    artisanProfileId: application.artisanProfileId,
    message: application.message,
    status,
  })
}
