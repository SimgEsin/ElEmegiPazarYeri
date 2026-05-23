"use client"

import { useSyncExternalStore } from "react"

import type { ArtisanProduct, ProductStory } from "@/app/artisan-panel/panel-types"
import { createStoriesFromProducts, getInitialStories, initialCatalogProducts } from "@/lib/catalog"

type CatalogSnapshot = {
  products: ArtisanProduct[]
  stories: ProductStory[]
}

let catalogSnapshot: CatalogSnapshot = {
  products: initialCatalogProducts,
  stories: getInitialStories(),
}

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function getFeaturedStoryId() {
  return catalogSnapshot.stories.find((story) => story.isFeatured)?.id ?? null
}

function rebuildStories(products: ArtisanProduct[], featuredStoryId = getFeaturedStoryId()) {
  return createStoriesFromProducts(products, featuredStoryId)
}

export function subscribeToCatalog(callback: () => void) {
  listeners.add(callback)

  return () => {
    listeners.delete(callback)
  }
}

export function getCatalogSnapshot() {
  return catalogSnapshot
}

export function getServerCatalogSnapshot() {
  return {
    products: initialCatalogProducts,
    stories: getInitialStories(),
  }
}

export function useCatalogSnapshot() {
  return useSyncExternalStore(subscribeToCatalog, getCatalogSnapshot, getServerCatalogSnapshot)
}

export function saveCatalogProduct(nextProduct: ArtisanProduct) {
  const exists = catalogSnapshot.products.some((product) => product.id === nextProduct.id)
  const products = exists
    ? catalogSnapshot.products.map((product) => (product.id === nextProduct.id ? nextProduct : product))
    : [nextProduct, ...catalogSnapshot.products]

  catalogSnapshot = {
    products,
    stories: rebuildStories(products),
  }

  emitChange()
}

export function deleteCatalogProduct(productId: string) {
  const products = catalogSnapshot.products.filter((product) => product.id !== productId)
  const remainingStories = catalogSnapshot.stories.filter((story) => story.productId !== productId)
  const nextFeaturedStoryId = remainingStories.find((story) => story.isFeatured)?.id ?? remainingStories[0]?.id ?? null

  catalogSnapshot = {
    products,
    stories: rebuildStories(products, nextFeaturedStoryId),
  }

  emitChange()
}

export function setFeaturedStory(storyId: string) {
  catalogSnapshot = {
    products: catalogSnapshot.products,
    stories: rebuildStories(catalogSnapshot.products, storyId),
  }

  emitChange()
}

export function getStoryBySlug(slug: string) {
  return catalogSnapshot.stories.find((story) => story.slug === slug) ?? null
}

export function getStoryByProductSlug(productSlug: string) {
  return catalogSnapshot.stories.find((story) => story.productSlug === productSlug) ?? null
}
