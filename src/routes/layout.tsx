import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

import Header from '~/components/header/header';
import Footer from '~/components/footer/footer';
import { cacheGet, cacheSet, DEFAULT_CACHE_TTL_MS } from '~/utils/cache';
import styles from './styles.css?inline'

const BRAND_CACHE_KEY = 'layout-brands';
const CATEGORY_CACHE_KEY = 'layout-categories';
const EMPTY_BRANDS: BrandModel[] = [];
const EMPTY_CATEGORIES: CategoryModel[] = [];

export const useBrandData = routeLoader$(async (requestEvent) => {
  requestEvent.cacheControl({ maxAge: 600, staleWhileRevalidate: 60 })
  const cached = cacheGet<BrandModel[]>(BRAND_CACHE_KEY)

  try {
    const res = await fetch("https://api.botracomputer.com/api/v1/brands?is_disable=0")

    if (!res.ok) {
      return cached ?? EMPTY_BRANDS
    }

    const payload = await res.json()
    const brands = Array.isArray(payload?.data) ? (payload.data as BrandModel[]) : EMPTY_BRANDS
    cacheSet(BRAND_CACHE_KEY, brands, DEFAULT_CACHE_TTL_MS)
    return brands
  } catch {
    return cached ?? EMPTY_BRANDS
  }
})

export const useCategoryData = routeLoader$(async (requestEvent) => {
  requestEvent.cacheControl({ maxAge: 600, staleWhileRevalidate: 60 })
  const cached = cacheGet<CategoryModel[]>(CATEGORY_CACHE_KEY)

  try {
    const res = await fetch("https://api.botracomputer.com/api/v1/categories?is_disable=0")

    if (!res.ok) {
      return cached ?? EMPTY_CATEGORIES
    }

    const payload = await res.json()
    const categories = Array.isArray(payload?.data)
      ? (payload.data as CategoryModel[])
      : EMPTY_CATEGORIES
    cacheSet(CATEGORY_CACHE_KEY, categories, DEFAULT_CACHE_TTL_MS)
    return categories
  } catch {
    return cached ?? EMPTY_CATEGORIES
  }
})

export const useBrandsCategoriesData = routeLoader$(async (requestEvent) => {
  const brands = await requestEvent.resolveValue(useBrandData)
  const categories = await requestEvent.resolveValue(useCategoryData)
  return { brands: brands, categories: categories }
})

export default component$(() => {
  useStyles$(styles);

  return (
    <>
      <Header />
      <main class="pb-4">
        <Slot />
      </main>
      <Footer />
    </>
  );
});
