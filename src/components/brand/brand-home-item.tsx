import { component$, $ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";


interface BrandHomeItemProps {
    brand: BrandModel
    closeModal?: PropFunction<VoidFunction>
}

export default component$((props: BrandHomeItemProps) => {

    const url = `https://ik.imagekit.io/botracomputer/ik-seo/${props.brand.logo.replace(".", "/" + props.brand.name.replace(" ", "-") + ".")}?tr=w-${300},h-${300},c-at_max`

    const nav = useNavigate()

    const itemClick = $(() => {
        nav(`/brand/${props.brand.name.replace(/[^a-zA-Z0-9 ]/g, '').trim()}-${props.brand.id}`.replaceAll(" ", "-").replaceAll("---", "-").replaceAll("--", "-"))

        if (props.closeModal) {
            props.closeModal()
        }
    })

    return props.closeModal ? (
        <div onclick$={itemClick}>
            <div class="w-full border-[2px] bg-white border-blue-600 rounded-md overflow-hidden hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all">
                <Image layout="fullWidth" loading="lazy" decoding="async" alt={props.brand.name} src={url} class="w-full aspect-square object-contain" />
            </div>
        </div>
    ) : (
        <Link prefetch={true} href={`/brand/${props.brand.name.trim()}-${props.brand.id}`.replaceAll(" ", "-").replaceAll("(", "").replaceAll(")", "").replaceAll("%", "")}>
            <div class="w-full border-[2px] bg-white border-blue-600 rounded-md overflow-hidden hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all">
                <Image layout="fullWidth" loading="lazy" decoding="async" alt={props.brand.name} src={url} class="w-full aspect-square object-contain" />
            </div>
        </Link>
    )
})