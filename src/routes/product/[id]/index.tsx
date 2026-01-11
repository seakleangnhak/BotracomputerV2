import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from '@builder.io/qwik-city';
import ProductDescription from "~/components/product/product-description";
import ProductItem from "~/components/product/product-item";
import { buildImageKitRawUrl } from "~/utils/url";

export const useProductData = routeLoader$(async (requestEvent) => {
    const ids = requestEvent.params.id.split("-")
    const id = ids[ids.length - 1]

    if (!id) {
        return null
    }

    try {
        const res = await fetch(`https://mtdiaxbjtxxb.ap-southeast-1.clawcloudrun.com/api/v1/products/${id}`)

        if (!res.ok) {
            return null
        }

        const product = (await res.json()).data as ProductModel | undefined

        return product ?? null
    } catch {
        return null
    }
})

export default component$(() => {

    const productSignal = useProductData()

    if (!productSignal || !productSignal.value) {
        return (
            <div class="mx-auto my-16 max-w-screen-md rounded-md border border-blue-200 bg-white p-8 text-center shadow-sm">
                <h1 class="text-3xl font-semibold text-blue-800">Product unavailable</h1>
                <p class="mt-3 text-base text-slate-600">
                    We couldn't find the product you were looking for. It may have been moved or is no longer available.
                </p>
                <Link prefetch href="/" class="mt-6 inline-flex rounded-md border border-blue-700 px-5 py-2 text-blue-700 transition hover:bg-blue-700 hover:text-white">
                    Return home
                </Link>
            </div>
        )
    }

    return (
        <div class="md:flex mt-4 justify-center max-w-screen-xl md:mx-auto px-4 gap-4">
            <div class="md:w-[400px] md:h-fit mx-auto md:mx-0 my-2">
                <ProductItem product={productSignal.value} productPage={true} />
            </div>
            <div class="md:min-w-[400px] md:max-w-[600px] md:w-fit mx-auto md:mx-0 my-2">
                <ProductDescription product={productSignal.value} />
            </div>
        </div>
    )
})

export const head: DocumentHead = ({ resolveValue, url }) => {

    const product = resolveValue(useProductData)

    if (!product) {
        return { title: "Botra Computer" }
    }

    const title = `${product.brand_name}  ${product.name} @ Botra Computer KH, Cambodia`
    const desc = `${product.brand_name}  ${product.name} are available at Botra Computer @ Phnom Penh Cambodia. ${product.brand_name}  ${product.name} are available for both retail and wholesale. Tel: (012/015/068) 818 781`
    const imageUrl = buildImageKitRawUrl(product.images, product.name)

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
