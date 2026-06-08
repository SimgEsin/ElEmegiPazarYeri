import apiClient from "@/lib/axios"

export type ProductReport = {
  id: string
  userId: string
  productId: string
  reason: string
  description?: string | null
  isResolved: boolean
  createdAt: string
  updatedAt?: string | null
}

export async function createProductReport(
  productId: string,
  reason: string,
  description?: string,
): Promise<string> {
  // POST binds CreateProductReportCommand(CreateProductReportDto ProductReport).
  const response = await apiClient.post<string>("/productreports", {
    productReport: { productId, reason, description },
  })
  return response.data
}

export async function getProductReports(options?: { signal?: AbortSignal }): Promise<ProductReport[]> {
  const response = await apiClient.get<ProductReport[]>("/productreports", { signal: options?.signal })
  return response.data
}

export async function resolveProductReport(report: ProductReport): Promise<void> {
  // PUT binds UpdateProductReportDto directly -> send flat.
  await apiClient.put(`/productreports/${report.id}`, {
    productId: report.productId,
    reason: report.reason,
    description: report.description ?? undefined,
    isResolved: true,
  })
}
