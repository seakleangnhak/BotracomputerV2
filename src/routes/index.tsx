import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import BrandHomeItem from '~/components/brand/brand-home-item';
import CategoryHomeItem from '~/components/category/category-home-item';
import ProductSection from '~/components/product/product-section';
import { useBrandsCategoriesData } from './layout';
import Slider from '~/components/slider/slider';
import { cacheGet, cacheSet, DEFAULT_CACHE_TTL_MS } from '~/utils/cache';

const NEW_PRODUCTS_CACHE_KEY = 'home-new-products';
const EMPTY_PRODUCTS: ProductModel[] = [];

export const useNewProductData = routeLoader$(async (requestEvent) => {
  requestEvent.cacheControl({ maxAge: 300, staleWhileRevalidate: 60 })
  const cached = cacheGet<ProductModel[]>(NEW_PRODUCTS_CACHE_KEY)

  try {
    const res = await fetch("https://mtdiaxbjtxxb.ap-southeast-1.clawcloudrun.com/api/v1/products?is_disable=0&limit=10")

    if (!res.ok) {
      return cached ?? EMPTY_PRODUCTS
    }

    const payload = await res.json()
    const products = Array.isArray(payload?.data?.data)
      ? (payload.data.data as ProductModel[])
      : EMPTY_PRODUCTS
    cacheSet(NEW_PRODUCTS_CACHE_KEY, products, DEFAULT_CACHE_TTL_MS)
    return products
  } catch {
    return cached ?? EMPTY_PRODUCTS
  }
})

export const useIndexData = routeLoader$(async (requestEvent) => {
  const brandsCategories = await requestEvent.resolveValue(useBrandsCategoriesData)
  const newProducts = await requestEvent.resolveValue(useNewProductData)

  return { brandsCategories: brandsCategories, newProducts: newProducts }
})

export default component$(() => {
  const newProductsSignal = useIndexData()

  return (
    <>
      <Slider />
      <div class="max-w-screen-xl xl:mx-auto mx-2 md:mx-4 lg:mx-16 mt-4">

        {/* category */}
        <h5 class="text-xl font-bold text-blue-800 underline underline-offset-[12px]">Categories</h5>
        <div class="mt-4 grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
          {
            newProductsSignal.value.brandsCategories.categories.map(category => <CategoryHomeItem key={category.id} category={category} />)
          }
        </div>

        {/* brand */}
        <h5 class="text-xl font-bold text-blue-800 underline underline-offset-[12px] mt-4">Brand</h5>
        <div class="mt-4 grid lg:grid-cols-7 md:grid-cols-5 grid-cols-3 gap-4">
          {
            newProductsSignal.value.brandsCategories.brands.map(brand => <BrandHomeItem key={brand.id} brand={brand} />)
          }
        </div>

        {/* best seller */}
        <ProductSection title='New' products={newProductsSignal.value.newProducts} />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Botra Computer',
  meta: [
    {
      name: 'description',
      content: "You can find any laptop or its accessories right here! Price, Quality &Service guarantee! We also Build PC for all kind of Budget. Tel: (012/015/068) 818 781",
    },
    {
      name: 'robots',
      content: 'index,follow',
    },
    // FaceBook Meta Tags
    {
      property: 'og:url',
      content: 'https://botracomputer.com',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:title',
      content: 'Botra Computer',
    },
    {
      property: 'og:description',
      content: "You can find any laptop or its accessories right here! Price, Quality &Service guarantee! We also Build PC for all kind of Budget. Tel: (012/015/068) 818 781",
    },
    {
      property: 'og:image',
      content: 'https://ik.imagekit.io/botracomputer/logo.png',
    },
    // Twitter Meta Tags
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:domain',
      content: 'https://botracomputer.com',
    },
    {
      property: 'twitter:title',
      content: 'Botra Computer',
    },
    {
      property: 'twitter:description',
      content: "You can find any laptop or its accessories right here! Price, Quality &Service guarantee! We also Build PC for all kind of Budget. Tel: (012/015/068) 818 781",
    },
    {
      property: 'twitter:image',
      content: 'https://botracomputer.com',
    },
  ],
};
