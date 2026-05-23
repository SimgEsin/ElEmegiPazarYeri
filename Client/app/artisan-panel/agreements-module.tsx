"use client"

import { AgreementsList } from "@/components/site/communication-modules"
import type { ConsensusItem } from "@/lib/mock-data"

type AgreementsModuleProps = {
  items: ConsensusItem[]
  highlightedItemId?: string | null
}

export default function AgreementsModule({ items, highlightedItemId }: AgreementsModuleProps) {
  return (
    <AgreementsList
      title="Mutabakatlar"
      description="Detay alanı açmadan, hangi görüşmenin hangi karar aşamasında olduğunu hızla görün."
      items={items}
      highlightedItemId={highlightedItemId}
    />
  )
}
