export const AUTH_STORAGE_KEY = "isLoggedIn"
export const AUTH_STORAGE_CHANGE_EVENT = "auth-storage-change"

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
