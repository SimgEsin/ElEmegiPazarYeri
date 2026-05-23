"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SalesFormState = {
  taxNumber: string
  taxOffice: string
  companyTitle: string
  accountHolder: string
  iban: string
  bankName: string
  shippingCompanies: string
}

const shippingCompanyOptions = ["Yurtiçi Kargo", "MNG Kargo", "Aras Kargo", "Sürat Kargo", "PTT Kargo"] as const

const initialSalesState: SalesFormState = {
  taxNumber: "",
  taxOffice: "",
  companyTitle: "",
  accountHolder: "",
  iban: "",
  bankName: "",
  shippingCompanies: "",
}

function normalizeIban(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase()
}

function isLikelyValidIban(value: string): boolean {
  const normalized = normalizeIban(value)
  return /^TR\d{24}$/.test(normalized)
}

export default function SalesManagementModule() {
  const [form, setForm] = useState<SalesFormState>(initialSalesState)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  function updateField<K extends keyof SalesFormState>(field: K, value: SalesFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrorMessage("")
    setSuccessMessage("")
  }

  function handleSave() {
    if (!form.taxNumber.trim() || !form.taxOffice.trim() || !form.companyTitle.trim()) {
      setErrorMessage("Vergi alanlarını eksiksiz doldurun.")
      return
    }

    if (!form.accountHolder.trim() || !form.bankName.trim() || !form.iban.trim()) {
      setErrorMessage("Banka hesabı alanlarını eksiksiz doldurun.")
      return
    }

    if (!isLikelyValidIban(form.iban)) {
      setErrorMessage("IBAN formatı geçersiz. TR ile başlayan 26 karakter girin.")
      return
    }

    if (!form.shippingCompanies.trim()) {
      setErrorMessage("Kargo alanını eksiksiz doldurun.")
      return
    }

    updateField("iban", normalizeIban(form.iban))
    setSuccessMessage("Satış yönetimi bilgileri kaydedildi.")
  }

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <div className="space-y-3 rounded-xl border border-primary/10 bg-muted/20 p-4">
          <h3 className="text-sm font-bold">Vergi</h3>
          <Input
            value={form.companyTitle}
            onChange={(event) => updateField("companyTitle", event.target.value)}
            placeholder="Şirket Ünvanı"
          />
          <Input
            value={form.taxNumber}
            onChange={(event) => updateField("taxNumber", event.target.value)}
            placeholder="Vergi Numarası"
          />
          <Input
            value={form.taxOffice}
            onChange={(event) => updateField("taxOffice", event.target.value)}
            placeholder="Vergi Dairesi"
          />
        </div>

        <div className="space-y-3 rounded-xl border border-primary/10 bg-muted/20 p-4">
          <h3 className="text-sm font-bold">Banka Hesabı</h3>
          <Input
            value={form.accountHolder}
            onChange={(event) => updateField("accountHolder", event.target.value)}
            placeholder="Hesap Sahibi"
          />
          <Input value={form.iban} onChange={(event) => updateField("iban", event.target.value)} placeholder="IBAN (TR...)" />
          <Input value={form.bankName} onChange={(event) => updateField("bankName", event.target.value)} placeholder="Banka Adı" />
        </div>

        <div className="space-y-3 rounded-xl border border-primary/10 bg-muted/20 p-4">
          <h3 className="text-sm font-bold">Kargo</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Kargo Firması</label>
            <select
              value={form.shippingCompanies}
              onChange={(event) => updateField("shippingCompanies", event.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <option value="">Kargo firması seçin</option>
              {shippingCompanyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {errorMessage ? <p className="text-sm font-medium text-destructive">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm font-medium text-primary">{successMessage}</p> : null}

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave}>
          Satış Bilgilerini Kaydet
        </Button>
      </div>
    </div>
  )
}
