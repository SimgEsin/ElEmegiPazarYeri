export type CancellationRequestStatus = "Beklemede" | "İşlendi"

export type CancellationRequest = {
  reason: string
  requestedAt: string
  status: CancellationRequestStatus
}
