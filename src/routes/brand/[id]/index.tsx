import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Image } from '@unpic/qwik';
import LazyProductSection from '~/components/product/lazy-product-section';
import { cacheGet, cacheSet, DEFAULT_CACHE_TTL_MS } from '~/utils/cache';
import { buildImageKitRawUrl, buildImageKitSeoUrl } from '~/utils/url';

type BrandGroup = {
  title: string;
  products: ProductModel[];
};

interface BrandProductsPayload {
  hero: {
    name?: string | null;
    logo?: string | null;
  } | null;
  groups: BrandGroup[];
  firstProduct?: ProductModel;
  totalProducts: number;
  message?: string;
}

const buildBrandPayload = (products: ProductModel[]): BrandProductsPayload => {
  const sorted = [...products].sort((a, b) =>
    (a.category_name ?? '').localeCompare(b.category_name ?? '')
  );

  const groupsMap = new Map<string, ProductModel[]>();
  sorted.forEach((product) => {
    const key = product.category_name?.trim() || 'Other';
    const existing = groupsMap.get(key);
    if (existing) {
      existing.push(product);
    } else {
      groupsMap.set(key, [product]);
    }
  });

  const groups = Array.from(groupsMap.entries()).map(([title, items]) => ({
    title,
    products: items,
  }));

  const hero = sorted.length
    ? {
      name: sorted[0]?.brand_name,
      logo: sorted[0]?.brand_logo,
    }
    : null;

  return {
    hero,
    groups,
    firstProduct: sorted[0],
    totalProducts: sorted.length,
  };
};

const EMPTY_BRAND_PAYLOAD: BrandProductsPayload = {
  hero: null,
  groups: [],
  totalProducts: 0,
  message: "We couldn't find any products for this brand right now. Please explore other brands or come back later.",
};

export const useBrandProductsData = routeLoader$(async (requestEvent) => {
  requestEvent.cacheControl({ maxAge: 900, staleWhileRevalidate: 60 })
  const ids = requestEvent.params.id.split("-")
  const id = ids[ids.length - 1]
  if (!id) {
    requestEvent.redirect(301, "/")
    return null
  }

  const cacheKey = `brand-products-${id}`
  const cached = cacheGet<BrandProductsPayload>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const res = await fetch(`https://api.botracomputer.com/api/v1/products?is_disable=0&limit=all&brand_id=${id}`)

    if (!res.ok) {
      cacheSet(cacheKey, EMPTY_BRAND_PAYLOAD, DEFAULT_CACHE_TTL_MS)
      return EMPTY_BRAND_PAYLOAD
    }

    const products = (await res.json()).data.data as ProductModel[]

    if (!products || products.length === 0) {
      cacheSet(cacheKey, EMPTY_BRAND_PAYLOAD, DEFAULT_CACHE_TTL_MS)
      return EMPTY_BRAND_PAYLOAD
    }

    const payload = buildBrandPayload(products)
    cacheSet(cacheKey, payload, DEFAULT_CACHE_TTL_MS)
    return payload
  } catch {
    cacheSet(cacheKey, EMPTY_BRAND_PAYLOAD, DEFAULT_CACHE_TTL_MS)
    return EMPTY_BRAND_PAYLOAD
  }
})

export default component$(() => {

  const productsSignal = useBrandProductsData()

  if (!productsSignal.value) {
    return <></>
  }

  const hero = productsSignal.value.hero
  const groups = productsSignal.value.groups
  const hasProducts = groups.length > 0

  const heroImage = hero
    ? buildImageKitSeoUrl(
      hero.logo ?? '',
      hero.name ?? '',
      {
        width: 300,
        height: 300,
        crop: "at_max",
      },
    )
    : null

  const message = productsSignal.value.message

  return (
    <div class="max-w-screen-xl xl:mx-auto mx-2 md:mx-4 lg:mx-16">
      {heroImage && (
        <Image layout="fullWidth" aspectRatio={1} loading="lazy" decoding="async" alt="Brand Logo" src={heroImage} class="h-[150px] w-[150px] mx-auto my-4 rounded-md bg-white overflow-hidden object-contain" />
      )}

      {hasProducts ? (
        groups.map((group, index) => (
          <LazyProductSection
            key={`${group.title}-${group.products[0]?.id ?? index}`}
            title={group.title}
            products={group.products}
            immediate={index < 2}
          />
        ))
      ) : (
        <div class="my-12 rounded-md border border-blue-200 bg-white p-8 text-center shadow-sm">
          <h2 class="text-2xl font-semibold text-blue-800">No products found</h2>
          <p class="mt-3 text-base text-slate-600">
            {message ?? "We looked everywhere but couldn't find products for this brand right now. Try another brand or check again later."}
          </p>
        </div>
      )}

    </div>
  );
});

export const head: DocumentHead = ({ resolveValue, url }) => {

  const data = resolveValue(useBrandProductsData) as BrandProductsPayload | null

  const product = data?.firstProduct

  if (!product) {
    return { title: "Botra Computer" }
  }

  const title = `${product.brand_name} @ Botra Computer KH, Cambodia`
  const desc = `${product.brand_name} accessories are available at Botra Computer @ Phnom Penh Cambodia. All ${product.brand_name} are available for both retail and wholesale. Tel: (012/015/068) 818 781`
  const imageUrl = buildImageKitRawUrl(product.brand_logo, product.brand_name)

  return {
    title: title,
    meta: [
      {
        name: 'description',
        content: desc,
      },
      // FaceBook Meta Tags
      {
        property: 'og:url',
        content: url.href,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: desc,
      },
      {
        property: 'og:image',
        content: imageUrl,
      },
      // Twitter Meta Tags
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'twitter:domain',
        content: url.href,
      },
      {
        property: 'twitter:title',
        content: title,
      },
      {
        property: 'twitter:description',
        content: desc,
      },
      {
        property: 'twitter:image',
        content: imageUrl,
      },
    ],
  }
};
