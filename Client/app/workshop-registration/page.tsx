import type { Metadata } from "next"

import WorkshopRegistrationClient from "./workshop-registration-client"

export const metadata: Metadata = {
  title: "Atölye Kaydı",
  description: "Zanaatkarlık hesabı başvuru formu.",
}

export default function WorkshopRegistrationPage() {
  return <WorkshopRegistrationClient />
}
