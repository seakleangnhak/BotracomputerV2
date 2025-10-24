import { component$, $ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { buildImageKitSeoUrl, buildSlug } from "~/utils/url";


interface BrandHomeItemProps {
    brand: BrandModel
    closeModal?: PropFunction<VoidFunction>
}

export default component$((props: BrandHomeItemProps) => {

    const imageUrl = buildImageKitSeoUrl(props.brand.logo, props.brand.name, {
        width: 300,
        height: 300,
        crop: "at_max"
    })

    const nav = useNavigate()

    const itemClick = $(() => {
        nav(`/brand/${buildSlug(props.brand.name, props.brand.id)}`)

        if (props.closeModal) {
            props.closeModal()
        }
    })

    return props.closeModal ? (
        <div onclick$={itemClick}>
            <div class="w-full border-[2px] bg-white border-blue-600 rounded-md overflow-hidden hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all">
                <Image layout="fullWidth" loading="lazy" decoding="async" alt={props.brand.name} src={imageUrl} class="w-full aspect-square object-contain" />
            </div>
        </div>
    ) : (
        <Link prefetch={false} href={`/brand/${buildSlug(props.brand.name, props.brand.id)}`}>
            <div class="w-full border-[2px] bg-white border-blue-600 rounded-md overflow-hidden hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all">
                <Image layout="fullWidth" loading="lazy" decoding="async" alt={props.brand.name} src={imageUrl} class="w-full aspect-square object-contain" />
            </div>
        </Link>
    )
})
