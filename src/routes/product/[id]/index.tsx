import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from '@builder.io/qwik-city';
import ProductDescription from "~/components/product/product-description";
import ProductItem from "~/components/product/product-item";

export const useProductData = routeLoader$(async ({ params, redirect }) => {
    const ids = params.id.split("-")
    const id = ids[ids.length - 1]
    const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/server/api/product.php/` + id)

    if (!res.ok) {
        redirect(301, "/")
        return null
    } else {
        const product = (await res.json()).data as ProductModel

        if (!product) {
            redirect(301, "/")
        }

        return product
    }
})

export default component$(() => {

    const productSignal = useProductData()

    if (!productSignal || !productSignal.value) {
        return <></>
    }

    return (
        <div class="md:flex mt-4 justify-center max-w-screen-xl md:mx-auto px-4 gap-4">
            <div class="md:w-[400px] mx-auto md:mx-0 my-2">
                <ProductItem product={productSignal.value} productPage={true} />
            </div>
            <div class="md:min-w-[400px] mx-auto md:mx-0 my-2">
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
    const imageUrl = `https://ik.imagekit.io/botracomputer/ik-seo/${(product.images ?? "").split(",")[0].replace(".", "/" + product.name.replaceAll(" ", "-") + ".")}`

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