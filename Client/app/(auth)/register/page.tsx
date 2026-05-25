"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { LockKeyhole, Mail, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFullName || !trimmedEmail || password.length < 6) {
      setErrorMessage("Lutfen tum alanlari kontrol edin. Sifre en az 6 karakter olmalidir.")
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        fullName: trimmedFullName,
        email: trimmedEmail,
        password,
      })
      router.push("/login")
    } catch {
      setErrorMessage("Kayit olusturulamadi. Lutfen bilgilerinizi kontrol edip tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-primary/10 bg-card/95 shadow-sm">
        <CardHeader className="space-y-3 p-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">Kayit Ol</CardTitle>
            <CardDescription>El emegi pazarina katilmak icin hesap bilgilerinizi olusturun.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-6 pt-0">
          {errorMessage ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm font-semibold">
              <span>Ad Soyad</span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Adiniz Soyadiniz"
                  className="h-10 pl-9"
                  autoComplete="name"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </label>

            <label className="space-y-2 text-sm font-semibold">
              <span>E-posta</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ornek@mail.com"
                  className="h-10 pl-9"
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </label>

            <label className="space-y-2 text-sm font-semibold">
              <span>Sifre</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="En az 6 karakter"
                  className="h-10 pl-9"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </label>

            <Button type="submit" size="lg" className="h-10 w-full font-semibold" disabled={isSubmitting}>
              {isSubmitting ? "Kayit olusturuluyor..." : "Kayit Ol"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Zaten hesabiniz var mi?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Giris Yap
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
