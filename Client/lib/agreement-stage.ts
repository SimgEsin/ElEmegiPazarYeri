import type { AgreementStage } from "@/lib/api/types"

export const STAGE_LABELS: Record<AgreementStage, string> = {
  None: "Süreç başlamadı",
  InProduction: "Üretimde",
  AwaitingApproval: "Onay bekliyor",
  Approved: "Onaylandı",
  Shipped: "Kargoda",
  Delivered: "Teslim edildi",
}

export function stageLabel(stage: AgreementStage): string {
  return STAGE_LABELS[stage] ?? STAGE_LABELS.None
}

const STAGE_ORDER: AgreementStage[] = [
  "InProduction",
  "AwaitingApproval",
  "Approved",
  "Shipped",
  "Delivered",
]

export function stageStepIndex(stage: AgreementStage): number {
  return STAGE_ORDER.indexOf(stage)
}

export const STAGE_STEPS = STAGE_ORDER
