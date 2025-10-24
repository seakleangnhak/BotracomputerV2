import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { buildImageKitSeoUrl, buildSlug } from "~/utils/url";


interface CategoryHomeItemProps {
    category: CategoryModel
}

export default component$((props: CategoryHomeItemProps) => {

    const imageUrl = buildImageKitSeoUrl(props.category.logo, props.category.name, {
        width: 75,
        height: 75,
        crop: "at_max"
    })

    const categorySlug = buildSlug(props.category.name, props.category.id)

    return (
        <Link prefetch={false} href={`/category/${categorySlug}`}>
            <div class="flex items-center border-[2px] border-blue-600 rounded-md bg-white overflow-hidden hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all">
                <div class="h-[50px] mx-2 my-1 aspect-square items-center">
                    <Image width="75" height="75" layout="fullWidth" loading="lazy" decoding="async" alt={props.category.name} src={imageUrl} class="h-full w-full mx-auto object-contain" />
                </div>
                <span class="text-md font-bold mx-2">{props.category.name}</span>
            </div>
        </Link>
    )
})
