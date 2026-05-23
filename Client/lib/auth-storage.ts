export const AUTH_STORAGE_KEY = "isLoggedIn"
export const AUTH_STORAGE_CHANGE_EVENT = "auth-storage-change"
export const USER_TYPE_STORAGE_KEY = "userType"
export const USER_TYPE_STORAGE_CHANGE_EVENT = "user-type-storage-change"

export type UserType = "customer" | "artisan" | "admin"

function normalizeUserType(value: string | null): UserType {
  if (value === "artisan" || value === "admin") {
    return value
  }

  return "customer"
}

export function getIsLoggedInSnapshot() {
  if (typeof window === "undefined") {
    return false
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true"
}

export function getServerIsLoggedInSnapshot() {
  return false
}

export function setIsLoggedIn(value: boolean) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, value ? "true" : "false")
  window.dispatchEvent(new Event(AUTH_STORAGE_CHANGE_EVENT))
}

export function subscribeToIsLoggedIn(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEY || event.key === null) {
      callback()
    }
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(AUTH_STORAGE_CHANGE_EVENT, callback)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(AUTH_STORAGE_CHANGE_EVENT, callback)
  }
}

export function getUserTypeSnapshot(): UserType {
  if (typeof window === "undefined") {
    return "customer"
  }

  return normalizeUserType(window.localStorage.getItem(USER_TYPE_STORAGE_KEY))
}

export function getServerUserTypeSnapshot(): UserType {
  return "customer"
}

export function setUserType(value: UserType) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(USER_TYPE_STORAGE_KEY, value)
  window.dispatchEvent(new Event(USER_TYPE_STORAGE_CHANGE_EVENT))
}

export function subscribeToUserType(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === USER_TYPE_STORAGE_KEY || event.key === null) {
      callback()
    }
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(USER_TYPE_STORAGE_CHANGE_EVENT, callback)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(USER_TYPE_STORAGE_CHANGE_EVENT, callback)
  }
}
