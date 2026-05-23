"use client"

import { AgreementsList } from "@/components/site/communication-modules"
import type { ConsensusItem } from "@/lib/mock-data"

type AgreementsSectionProps = {
  items: ConsensusItem[]
  highlightedItemId?: string | null
}

export default function AgreementsSection({ items, highlightedItemId }: AgreementsSectionProps) {
  return (
    <AgreementsList
      title="Mutabakatlar"
      description="Karar bekleyen, reddedilen veya siparişe dönüşen kayıtları tek listede görün."
      items={items}
      highlightedItemId={highlightedItemId}
    />
  )
}
