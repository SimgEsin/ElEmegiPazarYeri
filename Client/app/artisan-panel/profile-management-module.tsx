"use client"
/* eslint-disable @next/next/no-img-element */

import type { ChangeEvent } from "react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createArtisanProfile,
  getMyArtisanProfile,
  updateArtisanProfile,
  type ArtisanProfilePayload,
} from "@/lib/api/artisans"
import type { ArtisanProfileDetails } from "@/lib/api/types"
import { createSlug } from "@/lib/catalog"

type ImageAsset = {
  file?: File
  previewUrl: string
  name: string
  origin: "saved" | "local"
}

type ProfileFormState = {
  name: string
  title: string
  location: string
  story: string
}

const initialFormState: ProfileFormState = {
  name: "",
  title: "",
  location: "",
  story: "",
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "")
    reader.onerror = () => reject(new Error("Görsel okunamadı."))
    reader.readAsDataURL(file)
  })
}

async function resolveAssetUrl(asset: ImageAsset): Promise<string> {
  if (asset.origin === "local" && asset.file) {
    return fileToDataUrl(asset.file)
  }
  return asset.previewUrl
}

export default function ProfileManagementModule() {
  const [form, setForm] = useState<ProfileFormState>(initialFormState)
  const [profileImage, setProfileImage] = useState<ImageAsset | null>(null)
  const [kitchenMoments, setKitchenMoments] = useState<ImageAsset[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [existingProfile, setExistingProfile] = useState<ArtisanProfileDetails | null>(null)
  const profileImageRef = useRef<ImageAsset | null>(null)
  const kitchenMomentsRef = useRef<ImageAsset[]>([])

  useEffect(() => {
    profileImageRef.current = profileImage
  }, [profileImage])

  useEffect(() => {
    kitchenMomentsRef.current = kitchenMoments
  }, [kitchenMoments])

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const profile = await getMyArtisanProfile()
        if (!isMounted || !profile) {
          return
        }

        setExistingProfile(profile)
        setForm({
          name: profile.displayName ?? "",
          title: profile.craft ?? "",
          location: profile.city ?? "",
          story: profile.bio ?? "",
        })
        setProfileImage(
          profile.avatarUrl
            ? { previewUrl: profile.avatarUrl, name: "Profil görseli", origin: "saved" }
            : null,
        )
        setKitchenMoments(
          (profile.galleryImages ?? []).map((image) => ({
            previewUrl: image.url,
            name: image.name,
            origin: "saved" as const,
          })),
        )
      } catch {
        // henüz profil yoksa boş formla devam et
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (profileImageRef.current?.origin === "local") {
        URL.revokeObjectURL(profileImageRef.current.previewUrl)
      }

      kitchenMomentsRef.current.forEach((image) => {
        if (image.origin === "local") {
          URL.revokeObjectURL(image.previewUrl)
        }
      })
    }
  }, [])

  function updateField<K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrorMessage("")
    setSuccessMessage("")
  }

  function createImageAsset(file: File): ImageAsset {
    return {
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      origin: "local",
    }
  }

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Profil görseli için yalnızca görsel dosyası seçin.")
      setSuccessMessage("")
      event.target.value = ""
      return
    }

    setProfileImage((current) => {
      if (current?.origin === "local") {
        URL.revokeObjectURL(current.previewUrl)
      }

      return createImageAsset(file)
    })
    setErrorMessage("")
    setSuccessMessage("")
    event.target.value = ""
  }

  function removeProfileImage() {
    setProfileImage((current) => {
      if (current?.origin === "local") {
        URL.revokeObjectURL(current.previewUrl)
      }

      return null
    })
    setErrorMessage("")
    setSuccessMessage("")
  }

  function handleKitchenMomentsChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      setErrorMessage("Mutfaktan kareler için en az bir görsel seçin.")
      setSuccessMessage("")
      event.target.value = ""
      return
    }

    setKitchenMoments((current) => [...current, ...imageFiles.map(createImageAsset)])
    setErrorMessage("")
    setSuccessMessage("")
    event.target.value = ""
  }

  function removeKitchenMoment(previewUrl: string) {
    setKitchenMoments((current) => {
      const imageToRemove = current.find((image) => image.previewUrl === previewUrl)

      if (imageToRemove?.origin === "local") {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      return current.filter((image) => image.previewUrl !== previewUrl)
    })
    setErrorMessage("")
    setSuccessMessage("")
  }

  async function handleSave() {
    if (!form.name.trim() || !form.title.trim() || !form.location.trim() || !form.story.trim()) {
      setErrorMessage("Lütfen zorunlu profil alanlarını doldurun.")
      setSuccessMessage("")
      return
    }

    if (!profileImage) {
      setErrorMessage("Profil görseli yükleyin.")
      setSuccessMessage("")
      return
    }

    if (kitchenMoments.length === 0) {
      setErrorMessage("Mutfaktan Kareler için en az bir görsel yükleyin.")
      setSuccessMessage("")
      return
    }

    setIsSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const avatarUrl = await resolveAssetUrl(profileImage)
      const galleryUrls = await Promise.all(kitchenMoments.map(resolveAssetUrl))

      const payload: ArtisanProfilePayload = {
        slug: existingProfile?.slug || createSlug(form.name),
        displayName: form.name.trim(),
        craft: form.title.trim(),
        city: form.location.trim(),
        bio: form.story.trim(),
        avatarUrl,
        ratingAvg: existingProfile?.ratingAvg ?? 0,
        followerCount: existingProfile?.followerCount ?? 0,
        productCount: existingProfile?.productCount ?? 0,
        isVerified: existingProfile?.isVerified ?? false,
        galleryImages: galleryUrls.map((url, index) => ({
          name: kitchenMoments[index].name,
          url,
          sortOrder: index,
        })),
      }

      if (existingProfile) {
        await updateArtisanProfile(existingProfile.id, payload)
      } else {
        await createArtisanProfile(payload)
      }

      const refreshed = await getMyArtisanProfile()
      if (refreshed) {
        setExistingProfile(refreshed)
        setProfileImage(
          refreshed.avatarUrl
            ? { previewUrl: refreshed.avatarUrl, name: "Profil görseli", origin: "saved" }
            : null,
        )
        setKitchenMoments(
          (refreshed.galleryImages ?? []).map((image) => ({
            previewUrl: image.url,
            name: image.name,
            origin: "saved" as const,
          })),
        )
      }

      setSuccessMessage("Profil yönetimi bilgileri kaydedildi.")
    } catch {
      setErrorMessage("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="artisan-name" className="text-sm font-medium">
                İsim
              </label>
              <Input id="artisan-name" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="İsim" />
            </div>
            <div className="space-y-2">
              <label htmlFor="artisan-title" className="text-sm font-medium">
                Ünvan
              </label>
              <Input id="artisan-title" value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Ünvan" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="artisan-location" className="text-sm font-medium">
                Konum
              </label>
              <Input
                id="artisan-location"
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Konum"
              />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-primary/10 bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Profil Görseli</p>
                <p className="text-xs text-muted-foreground">Bilgisayarınızdan bir görsel seçin.</p>
              </div>
              {profileImage ? (
                <Button type="button" variant="ghost" size="sm" onClick={removeProfileImage}>
                  Kaldır
                </Button>
              ) : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="artisan-profile-image" className="text-sm font-medium">
                Görsel Seç
              </label>
              <Input id="artisan-profile-image" type="file" accept="image/*" onChange={handleProfileImageChange} />
            </div>
            {profileImage ? (
              <div className="flex items-center gap-3 rounded-lg border border-primary/10 bg-muted/20 p-3">
                <div className="size-14 overflow-hidden rounded-full border border-primary/15">
                  <img src={profileImage.previewUrl} alt={`${form.name} profil görseli`} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{profileImage.name}</p>
                  {profileImage.file ? (
                    <p className="text-xs text-muted-foreground">
                      {(profileImage.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Henüz profil görseli seçilmedi.</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="artisan-story" className="text-sm font-medium">
              Hikaye
            </label>
            <Textarea
              id="artisan-story"
              value={form.story}
              onChange={(event) => updateField("story", event.target.value)}
              placeholder="Hikaye"
              className="min-h-28"
            />
          </div>
          <div className="space-y-3 rounded-xl border border-primary/10 bg-background/70 p-4">
            <div>
              <p className="text-sm font-medium">Mutfaktan Kareler</p>
              <p className="text-xs text-muted-foreground">Birden fazla görsel seçebilir, sonradan tek tek kaldırabilirsiniz.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="artisan-kitchen-moments" className="text-sm font-medium">
                Görselleri Seç
              </label>
              <Input id="artisan-kitchen-moments" type="file" accept="image/*" multiple onChange={handleKitchenMomentsChange} />
            </div>
            {kitchenMoments.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {kitchenMoments.map((image) => (
                  <div key={image.previewUrl} className="overflow-hidden rounded-xl border border-primary/10 bg-muted/20">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img src={image.previewUrl} alt={image.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{image.name}</p>
                        {image.file ? (
                          <p className="text-xs text-muted-foreground">{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        ) : null}
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeKitchenMoment(image.previewUrl)}>
                        Kaldır
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Henüz mutfaktan kare eklenmedi.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-primary/10 bg-muted/20 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Profil Önizleme</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative size-16 overflow-hidden rounded-full border border-primary/20">
              {profileImage ? (
                <img src={profileImage.previewUrl} alt={`${form.name} profil görseli`} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold">{form.name || "İsim girilmedi"}</p>
              <p className="text-xs text-primary">{form.title || "Ünvan girilmedi"}</p>
              <p className="text-xs text-muted-foreground">{form.location || "Konum girilmedi"}</p>
            </div>
          </div>
          <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">{form.story || "Hikaye girilmedi."}</p>
          <p className="mt-4 text-xs font-medium text-muted-foreground">{kitchenMoments.length} mutfak karesi secildi</p>
          {kitchenMoments.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {kitchenMoments.slice(0, 3).map((image) => (
                <div key={image.previewUrl} className="aspect-square overflow-hidden rounded-lg border border-primary/10 bg-muted">
                  <img src={image.previewUrl} alt={image.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {errorMessage ? <p className="text-sm font-medium text-destructive">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm font-medium text-primary">{successMessage}</p> : null}

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? "Kaydediliyor..." : "Profili Kaydet"}
        </Button>
      </div>
    </div>
  )
}
