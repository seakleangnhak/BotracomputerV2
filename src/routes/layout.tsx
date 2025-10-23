import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

import Header from '~/components/header/header';
import Footer from '~/components/footer/footer';
import styles from './styles.css?inline'


export const useBrandData = routeLoader$(async () => {
  const res = await fetch("https://api.botracomputer.com/api/v1/brands?is_disable=0")
  const brands = (await res.json()).data as BrandModel[]
  return brands
})

export const useCategoryData = routeLoader$(async () => {
  const res = await fetch("https://api.botracomputer.com/api/v1/categories?is_disable=0")
  const categories = (await res.json()).data as CategoryModel[]
  return categories
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
