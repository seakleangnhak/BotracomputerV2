import { component$, $ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { buildImageKitSeoUrl, buildSlug } from "~/utils/url";

interface CategoryModalItemProps {
    category: CategoryModel
    closeModal?: PropFunction<VoidFunction>
}

export default component$((props: CategoryModalItemProps) => {

    const imageUrl = buildImageKitSeoUrl(props.category.logo, props.category.name, {
        width: 300,
        height: 300,
        crop: "at_max"
    })

    const nav = useNavigate()

    const itemClick = $(() => {
        nav(`/category/${buildSlug(props.category.name, props.category.id)}`)
        if (props.closeModal) {
            props.closeModal()
        }
    })

    return (
        // <Link prefetch={true} href={"/category/" + props.category.id}>
        <div onclick$={itemClick}>
            <div class="w-full border-[2px] border-blue-600 rounded-md bg-white overflow-hidden cursor-pointer hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all">
                <div class="w-full aspect-square">
                    <Image layout="fullWidth" loading="lazy" decoding="async" alt={props.category.name} src={imageUrl} class="h-full max-w-full mx-auto aspect-square object-contain" />
                </div>
                <div class="flex justify-center p-3 text-base">
                    <span>{props.category.name}</span>
                </div>
            </div>
        </div>
        // </Link>
    )
})
