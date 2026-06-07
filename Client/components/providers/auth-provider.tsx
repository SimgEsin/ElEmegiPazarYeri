"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

import apiClient, { AUTH_TOKEN_STORAGE_KEY } from "@/lib/axios"

export type AuthUser = {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  fullName?: string
  name?: string
  roles?: string[]
  [key: string]: unknown
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  email: string
  password: string
  fullName: string
}

type AuthResponse = {
  token?: string
  accessToken?: string
  jwt?: string
  user?: AuthUser
  data?: {
    token?: string
    accessToken?: string
    jwt?: string
    user?: AuthUser
  }
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function getTokenFromResponse(response: AuthResponse) {
  return (
    response.token ??
    response.accessToken ??
    response.jwt ??
    response.data?.token ??
    response.data?.accessToken ??
    response.data?.jwt ??
    null
  )
}

function getRolesClaim(payload: Record<string, unknown>): string[] {
  const raw =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    payload["role"] ??
    payload["roles"]

  const values = Array.isArray(raw) ? raw : raw != null ? [raw] : []

  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

function getStringClaim(payload: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = payload[key]

    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return undefined
}

function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const payload = token.split(".")[1]

    if (!payload || typeof window === "undefined") {
      return null
    }

    const base64Payload = payload.replace(/-/g, "+").replace(/_/g, "/")
    const paddedPayload = base64Payload.padEnd(base64Payload.length + ((4 - (base64Payload.length % 4)) % 4), "=")
    const parsedPayload = JSON.parse(window.atob(paddedPayload)) as Record<string, unknown>
    const id =
      getStringClaim(parsedPayload, [
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
        "nameidentifier",
        "nameid",
        "sub",
        "id",
      ]) ?? ""
    const email = getStringClaim(parsedPayload, [
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      "email",
      "unique_name",
    ])
    const fullName =
      getStringClaim(parsedPayload, [
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        "name",
        "fullName",
        "fullname",
        "unique_name",
      ]) ?? "Kullanıcı"
    const firstName = getStringClaim(parsedPayload, [
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
      "given_name",
      "firstName",
    ])
    const lastName = getStringClaim(parsedPayload, [
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
      "family_name",
      "lastName",
    ])

    return {
      ...parsedPayload,
      id,
      email,
      firstName,
      lastName,
      fullName,
      name: fullName,
      roles: getRolesClaim(parsedPayload),
    }
  } catch {
    return null
  }
}

function getUserFromResponse(response: AuthResponse, token: string) {
  const tokenUser = decodeJwtPayload(token)
  const responseUser = response.user ?? response.data?.user

  if (!responseUser) {
    return tokenUser
  }

  return {
    ...tokenUser,
    ...responseUser,
    id: responseUser.id ?? tokenUser?.id,
    email: responseUser.email ?? tokenUser?.email,
    firstName: responseUser.firstName ?? tokenUser?.firstName,
    lastName: responseUser.lastName ?? tokenUser?.lastName,
    fullName: responseUser.fullName ?? responseUser.name ?? tokenUser?.fullName ?? tokenUser?.name ?? "Kullanıcı",
    name: responseUser.name ?? responseUser.fullName ?? tokenUser?.name ?? tokenUser?.fullName ?? "Kullanıcı",
  }
}

function getStoredToken() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedToken = getStoredToken()

    return storedToken ? decodeJwtPayload(storedToken) : null
  })

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload)
    const nextToken = getTokenFromResponse(response.data)

    if (!nextToken) {
      throw new Error("Login response did not include a token.")
    }

    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken)
    setToken(nextToken)
    setUser(getUserFromResponse(response.data, nextToken))
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await apiClient.post<AuthResponse>("/auth/register", {
      email: payload.email,
      password: payload.password,
      fullName: payload.fullName,
    })
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [login, logout, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.")
  }

  return context
}
