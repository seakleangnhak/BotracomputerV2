import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Image } from '@unpic/qwik';
import ProductSection from '~/components/product/product-section';

export const useBrandProductsData = routeLoader$(async ({ params, redirect }) => {
  const ids = params.id.split("-")
  const id = ids[ids.length - 1]
  const res = await fetch("https://admin.botracomputer.com/server/api/product.php?is_disable=0&limit=10000&brand_id=${id}")

  if (id == "") {
    print()
  }

  if (!res.ok) {
    redirect(301, "/")
    return null
  } else {
    const products = (await res.json()).data.data as ProductModel[]

    if (!products || products.length == 0) {
      redirect(301, "/") 
      return null
    }

    return products
  }
})

export default component$(() => {

  const productsSignal = useBrandProductsData()

  if (!productsSignal.value) {
    return <></>
  }

  const groupBy = function (xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  const groupedProduct = groupBy(productsSignal.value.sort((a, b) => (a.category_name ?? "").localeCompare(b.category_name ?? "")), "category_name")

  const url = `https://ik.imagekit.io/botracomputer/ik-seo/${(productsSignal.value[0].brand_logo ?? "").split(",")[0].replace(".", "/" + productsSignal.value[0].brand_name?.replace(" ", "-") + ".")}?tr=w-${300},h-${300},c-at_max`

  return (
    <div class="max-w-screen-xl xl:mx-auto mx-2 md:mx-4 lg:mx-16">
      <Image layout="fullWidth" aspectRatio={1} loading="lazy" decoding="async" alt="Brand Name" src={url} class="h-[150px] w-[150px] mx-auto my-4 rounded-md bg-white overflow-hidden object-contain" />

      {
        Object.keys(groupedProduct).map(key => (
          <ProductSection key={key} title={key} products={groupedProduct[key]} />
        ))
      }

    </div>
  );
});

export const head: DocumentHead = ({ resolveValue, url }) => {

  const products = resolveValue(useBrandProductsData)

  if (!products || products.length == 0) {
    return { title: "Botra Computer" }
  }

  const product = products[0]
  const title = `${product.brand_name} @ Botra Computer KH, Cambodia`
  const desc = `${product.brand_name} accessories are available at Botra Computer @ Phnom Penh Cambodia. All ${product.brand_name} are available for both retail and wholesale. Tel: (012/015/068) 818 781`
  const imageUrl = `https://ik.imagekit.io/botracomputer/ik-seo/${(product.brand_logo ?? "").split(",")[0].replace(".", "/" + product.brand_name?.replaceAll(" ", "-") + ".")}`

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