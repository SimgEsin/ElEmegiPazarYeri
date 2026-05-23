"use client"

import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"

type CheckoutStepId = "delivery" | "shipping" | "payment"

type ShippingOption = {
  id: string
  name: string
  eta: string
  fee: number
}

type PaymentOption = {
  id: string
  name: string
  description: string
}

type DeliveryContact = {
  id: string
  address: string
  phone: string
  isDefault: boolean
}

const checkoutSteps: { id: CheckoutStepId; label: string }[] = [
  { id: "delivery", label: "Adres/İletişim" },
  { id: "shipping", label: "Kargo" },
  { id: "payment", label: "Ödeme" },
]

const shippingOptions: ShippingOption[] = [
  { id: "yurtici", name: "Yurtiçi Kargo", eta: "2-3 iş günü", fee: 89 },
  { id: "aras", name: "Aras Kargo", eta: "1-2 iş günü", fee: 119 },
  { id: "mng", name: "MNG Kargo", eta: "3-4 iş günü", fee: 69 },
]

const paymentOptions: PaymentOption[] = [
  { id: "card", name: "Kredi/Banka Kartı", description: "Tek çekim veya taksit seçenekleri" },
  { id: "eft", name: "Havale/EFT", description: "Ödemeyi banka transferi ile tamamlayın" },
  { id: "cod", name: "Kapıda Ödeme", description: "Teslimatta nakit veya kart ile ödeme" },
]

const productSummary = {
  title: "Stok Seramik Vazo",
  description: "Hazır stok ürün • doğrudan standart checkout",
  price: 1290,
}

const deliveryContactsStorageKey = "stok-seramik-vazo:delivery-contacts"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value)
}

function normalizeDeliveryContacts(contacts: DeliveryContact[]): DeliveryContact[] {
  if (contacts.length === 0) {
    return []
  }

  let hasDefault = false
  const normalized = contacts.map((contact) => {
    const normalizedContact = {
      ...contact,
      address: contact.address.trim(),
      phone: contact.phone.trim(),
    }

    if (!hasDefault && normalizedContact.isDefault) {
      hasDefault = true
      return normalizedContact
    }

    return { ...normalizedContact, isDefault: false }
  })

  if (!hasDefault) {
    normalized[0] = { ...normalized[0], isDefault: true }
  }

  return normalized.filter((contact) => contact.address.length > 0 && contact.phone.length > 0)
}

function generateDeliveryContactId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function StokStandartSiparisClient() {
  const [deliveryContacts, setDeliveryContacts] = useState<DeliveryContact[]>([])
  const [selectedDeliveryContactId, setSelectedDeliveryContactId] = useState("")
  const [isDeliveryContactsHydrated, setIsDeliveryContactsHydrated] = useState(false)
  const [isNewContactPopupOpen, setIsNewContactPopupOpen] = useState(false)
  const [newContactAddress, setNewContactAddress] = useState("")
  const [newContactPhone, setNewContactPhone] = useState("")
  const [newContactIsDefault, setNewContactIsDefault] = useState(false)
  const [newContactError, setNewContactError] = useState("")
  const [note, setNote] = useState("")
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedShippingId, setSelectedShippingId] = useState("")
  const [selectedPaymentId, setSelectedPaymentId] = useState("")
  const [stepError, setStepError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const storedContacts = window.localStorage.getItem(deliveryContactsStorageKey)

    if (!storedContacts) {
      setIsDeliveryContactsHydrated(true)
      return
    }

    try {
      const parsed: unknown = JSON.parse(storedContacts)
      if (!Array.isArray(parsed)) {
        throw new Error("Kayıtlı adres verisi dizi formatında değil.")
      }

      const parsedContacts: DeliveryContact[] = parsed.flatMap((item) => {
        if (typeof item !== "object" || item === null) {
          return []
        }

        const record = item as Partial<DeliveryContact>
        if (typeof record.id !== "string" || typeof record.address !== "string" || typeof record.phone !== "string") {
          return []
        }

        return [
          {
            id: record.id,
            address: record.address,
            phone: record.phone,
            isDefault: Boolean(record.isDefault),
          },
        ]
      })

      setDeliveryContacts(normalizeDeliveryContacts(parsedContacts))
    } catch (error) {
      console.error("Kayıtlı adres/iletişim verisi okunamadı:", error)
      window.localStorage.removeItem(deliveryContactsStorageKey)
    }

    setIsDeliveryContactsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isDeliveryContactsHydrated) {
      return
    }

    try {
      window.localStorage.setItem(deliveryContactsStorageKey, JSON.stringify(deliveryContacts))
    } catch (error) {
      console.error("Adres/iletişim verisi kaydedilemedi:", error)
    }
  }, [deliveryContacts, isDeliveryContactsHydrated])

  useEffect(() => {
    if (deliveryContacts.length === 0) {
      if (selectedDeliveryContactId) {
        setSelectedDeliveryContactId("")
      }
      return
    }

    const hasSelectedContact = deliveryContacts.some((contact) => contact.id === selectedDeliveryContactId)
    if (hasSelectedContact) {
      return
    }

    const defaultContact = deliveryContacts.find((contact) => contact.isDefault) ?? deliveryContacts[0]
    setSelectedDeliveryContactId(defaultContact.id)
  }, [deliveryContacts, selectedDeliveryContactId])

  const selectedDeliveryContact = deliveryContacts.find((contact) => contact.id === selectedDeliveryContactId) ?? null
  const selectedShipping = shippingOptions.find((option) => option.id === selectedShippingId) ?? null
  const selectedPayment = paymentOptions.find((option) => option.id === selectedPaymentId) ?? null
  const activeStep = checkoutSteps[currentStepIndex]
  const grandTotal = productSummary.price + (selectedShipping?.fee ?? 0)
  const isCheckoutReady = Boolean(selectedDeliveryContact && selectedShipping && selectedPayment)

  const openNewContactPopup = () => {
    setNewContactAddress("")
    setNewContactPhone("")
    setNewContactIsDefault(deliveryContacts.length === 0)
    setNewContactError("")
    setIsNewContactPopupOpen(true)
  }

  const closeNewContactPopup = () => {
    setIsNewContactPopupOpen(false)
    setNewContactError("")
  }

  const handleCreateDeliveryContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!newContactAddress.trim() || !newContactPhone.trim()) {
      setNewContactError("Adres ve telefon bilgisi zorunludur.")
      return
    }

    const shouldBeDefault = deliveryContacts.length === 0 || newContactIsDefault
    const contactsBase = shouldBeDefault
      ? deliveryContacts.map((contact) => ({ ...contact, isDefault: false }))
      : deliveryContacts

    const nextContacts = normalizeDeliveryContacts([
      ...contactsBase,
      {
        id: generateDeliveryContactId(),
        address: newContactAddress,
        phone: newContactPhone,
        isDefault: shouldBeDefault,
      },
    ])

    setDeliveryContacts(nextContacts)

    const defaultContact = nextContacts.find((contact) => contact.isDefault) ?? nextContacts[0]
    setSelectedDeliveryContactId(defaultContact.id)
    closeNewContactPopup()
  }

  const moveToPreviousStep = () => {
    setStepError("")
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const moveToNextStep = () => {
    if (activeStep.id === "delivery" && !selectedDeliveryContact) {
      setStepError("Devam etmeden önce kayıtlı bir teslimat adresi/iletişim bilgisi seçin.")
      return
    }

    if (activeStep.id === "shipping" && !selectedShipping) {
      setStepError("Devam etmeden önce bir kargo firması seçin.")
      return
    }

    if (activeStep.id === "payment" && !selectedPayment) {
      setStepError("Devam etmeden önce bir ödeme yöntemi seçin.")
      return
    }

    setStepError("")
    setCurrentStepIndex((prev) => Math.min(prev + 1, checkoutSteps.length - 1))
  }

  const handleCreateOrder = () => {
    if (!isCheckoutReady) {
      setStepError("Siparişi oluşturmadan önce tüm adımları tamamlayın.")
      return
    }

    setStepError("")
    setIsSubmitted(true)
  }

  return (
    <section className="space-y-6 rounded-2xl border border-primary/10 bg-card p-8 shadow-sm">
      <Link
        href="/products/stok-seramik-vazo"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        <ArrowLeft className="size-4" />
        Ürüne dön
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-black">Sipariş Ver</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">Aşağıdaki adımları tamamlayarak ürününüz için sipariş oluşturabilirsiniz.</p>
      </div>

      <ol className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {checkoutSteps.map((step, index) => {
          const isActive = currentStepIndex === index
          const isCompleted = currentStepIndex > index
          return (
            <li
              key={step.id}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                isActive ? "border-primary bg-primary/10 text-primary" : isCompleted ? "border-green-200 bg-green-50 text-green-700" : "border-primary/10 bg-white text-muted-foreground"
              }`}
            >
              {index + 1}. {step.label}
            </li>
          )
        })}
      </ol>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="space-y-6">
            {activeStep.id === "delivery" ? (
              <section className="space-y-3 rounded-xl border border-primary/10 bg-white p-5">
                <h2 className="text-sm font-bold">1. Adres/İletişim Bilgileri</h2>

                {deliveryContacts.length === 0 ? (
                  <button
                    type="button"
                    onClick={openNewContactPopup}
                    className="inline-flex items-center rounded-xl border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Yeni adres/iletişim bilgisi ekle
                  </button>
                ) : (
                  <div className="space-y-3">
                    {deliveryContacts.map((contact) => {
                      const isSelected = selectedDeliveryContactId === contact.id

                      return (
                        <label
                          key={contact.id}
                          className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border px-4 py-3 transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-primary/15 hover:border-primary/30"}`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground">{contact.address}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Telefon: {contact.phone}</p>
                            {contact.isDefault ? (
                              <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">Varsayılan</span>
                            ) : null}
                          </div>
                          <input
                            type="radio"
                            name="delivery-contact"
                            value={contact.id}
                            checked={isSelected}
                            onChange={(event) => setSelectedDeliveryContactId(event.target.value)}
                            className="mt-1 size-4 accent-primary"
                          />
                        </label>
                      )
                    })}

                    <button
                      type="button"
                      onClick={openNewContactPopup}
                      className="inline-flex items-center rounded-xl border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      Yeni adres/iletişim bilgisi ekle
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="order-note" className="text-xs font-semibold text-muted-foreground">
                    Sipariş notu
                  </label>
                  <textarea
                    id="order-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm outline-none ring-primary/40 transition focus:ring-2"
                  />
                </div>
              </section>
            ) : null}

            {activeStep.id === "shipping" ? (
              <section className="space-y-3 rounded-xl border border-primary/10 bg-white p-5">
                <h2 className="text-sm font-bold">2. Kargo Seçimi</h2>
                <div className="space-y-3">
                  {shippingOptions.map((option) => {
                    const isSelected = selectedShippingId === option.id
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border px-4 py-3 transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-primary/15 hover:border-primary/30"}`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{option.name}</p>
                          <p className="text-xs text-muted-foreground">Teslim: {option.eta}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(option.fee)}</p>
                          <input
                            type="radio"
                            name="shipping-option"
                            value={option.id}
                            checked={isSelected}
                            onChange={(event) => setSelectedShippingId(event.target.value)}
                            className="mt-2 size-4 accent-primary"
                          />
                        </div>
                      </label>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {activeStep.id === "payment" ? (
              <section className="space-y-3 rounded-xl border border-primary/10 bg-white p-5">
                <h2 className="text-sm font-bold">3. Ödeme Yöntemi</h2>
                <div className="space-y-3">
                  {paymentOptions.map((option) => {
                    const isSelected = selectedPaymentId === option.id
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border px-4 py-3 transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-primary/15 hover:border-primary/30"}`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{option.name}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        <input
                          type="radio"
                          name="payment-option"
                          value={option.id}
                          checked={isSelected}
                          onChange={(event) => setSelectedPaymentId(event.target.value)}
                          className="mt-1 size-4 accent-primary"
                        />
                      </label>
                    )
                  })}
                </div>
              </section>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={moveToPreviousStep}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                >
                  Geri
                </button>
              ) : null}

              {activeStep.id !== "payment" ? (
                <button
                  type="button"
                  onClick={moveToNextStep}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                >
                  Devam Et
                </button>
              ) : null}
            </div>
          </div>

          {stepError ? <p className="text-xs font-semibold text-red-600">{stepError}</p> : null}

          {isNewContactPopupOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
              <section className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="new-contact-popup-title">
                <div className="mb-4 flex items-center justify-between">
                  <h3 id="new-contact-popup-title" className="text-sm font-bold">
                    Yeni Adres/İletişim Bilgisi
                  </h3>
                  <button
                    type="button"
                    onClick={closeNewContactPopup}
                    className="rounded-lg border border-primary/20 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Kapat
                  </button>
                </div>

                <form onSubmit={handleCreateDeliveryContact} className="space-y-3">
                  <div className="space-y-2">
                    <label htmlFor="new-contact-address" className="text-xs font-semibold text-muted-foreground">
                      Teslimat adresi
                    </label>
                    <textarea
                      id="new-contact-address"
                      value={newContactAddress}
                      onChange={(event) => setNewContactAddress(event.target.value)}
                      rows={3}
                      required
                      className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm outline-none ring-primary/40 transition focus:ring-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="new-contact-phone" className="text-xs font-semibold text-muted-foreground">
                      İletişim telefonu
                    </label>
                    <input
                      id="new-contact-phone"
                      type="tel"
                      value={newContactPhone}
                      onChange={(event) => setNewContactPhone(event.target.value)}
                      required
                      className="h-10 w-full rounded-lg border border-primary/20 px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={newContactIsDefault}
                      onChange={(event) => setNewContactIsDefault(event.target.checked)}
                      disabled={deliveryContacts.length === 0}
                      className="size-4 accent-primary disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    Varsayılan adres yap
                  </label>

                  {deliveryContacts.length === 0 ? <p className="text-xs text-muted-foreground">İlk kayıt otomatik olarak varsayılan adrese atanır.</p> : null}
                  {newContactError ? <p className="text-xs font-semibold text-red-600">{newContactError}</p> : null}

                  <button
                    type="submit"
                    className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    Adresi Kaydet
                  </button>
                </form>
              </section>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-xl border border-primary/10 bg-white p-5 xl:sticky xl:top-6 xl:h-fit">
          <h2 className="text-sm font-bold">Sipariş Özeti</h2>
          <dl className="space-y-3 text-xs">
            <div className="space-y-1">
              <dt className="font-semibold text-muted-foreground">Ürün</dt>
              <dd className="leading-relaxed text-foreground">{productSummary.title}</dd>
            </div>
            
            <div className="space-y-1">
              <dt className="font-semibold text-muted-foreground">Seçilen Ödeme</dt>
              <dd className="text-foreground">{selectedPayment?.name ?? "Henüz seçilmedi"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="font-semibold text-muted-foreground">Sipariş Notu</dt>
              <dd className="text-foreground">{note.trim() ? note : "Henüz girilmedi"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="font-semibold text-muted-foreground">Ürün Tutarı</dt>
              <dd className="text-foreground">{formatCurrency(productSummary.price)}</dd>
            </div>
            <div className="space-y-1">
              <dt className="font-semibold text-muted-foreground">Seçilen Kargo</dt>
              <dd className="text-foreground">{selectedShipping ? `${selectedShipping.name} (${formatCurrency(selectedShipping.fee)})` : "Henüz seçilmedi"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="font-semibold text-muted-foreground">Genel Toplam</dt>
              <dd className="font-bold text-primary">{formatCurrency(grandTotal)}</dd>
            </div>
            {isSubmitted ? (
              <>
                <div className="space-y-1 border-t border-primary/10 pt-3">
                  <dt className="font-semibold text-muted-foreground">Sipariş Durumu</dt>
                  <dd className="text-foreground">Oluşturuldu</dd>
                </div>
              </>
            ) : null}
          </dl>
          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={!isCheckoutReady || isSubmitted}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingBag className="size-4" />
            Siparişi Oluştur
          </button>
        </aside>
      </div>
    </section>
  )
}
