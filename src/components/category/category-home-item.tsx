import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";


interface CategoryHomeItemProps {
    category: CategoryModel
}

export default component$((props: CategoryHomeItemProps) => {

    const url = `https://ik.imagekit.io/botracomputer/ik-seo/${props.category.logo.replace(".", "/" + props.category.name.replace(" ", "-") + ".")}?tr=w-${75},h-${75},c-at_max`

    return (
        <Link prefetch={true} href={`/category/${props.category.name.replace(/[^a-zA-Z0-9 ]/g, '').trim()}-${props.category.id}`.replaceAll(" ", "-").replaceAll("---", "-").replaceAll("--", "-")}>
            <div class="flex items-center border-[2px] border-blue-600 rounded-md bg-white overflow-hidden hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all">
                <div class="h-[50px] mx-2 my-1 aspect-square items-center">
                    <Image width="75" height="75" layout="fullWidth" loading="lazy" decoding="async" alt={props.category.name} src={url} class="h-full w-full mx-auto object-contain" />
                </div>
                <span class="text-md font-bold mx-2">{props.category.name}</span>
            </div>
        </Link>
    )
})