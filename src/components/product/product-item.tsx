import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";

export default component$((props: { product: ProductModel, productPage?: boolean }) => {

    const url = `https://ik.imagekit.io/botracomputer/ik-seo/${(props.product.images ?? "").split(",")[0].replace(".", "/" + props.product.name.replace(" ", "-") + ".")}?tr=w-${props.productPage ? 500 : 300},h-${props.productPage ? 500 : 300},c-at_max`
    const style = "col-span-1 flex flex-col border-[2px] h-full w-full border-blue-600 rounded-md bg-white overflow-hidden cursor-pointer" + (props.productPage ? "" : "hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all relative")
    const productUrl = props.productPage ? "#" : `/product/${props.product.brand_name?.replace(/[^a-zA-Z0-9 ]/g, '').trim()}-${props.product.name.replace(/[^a-zA-Z0-9 ]/g, '').trim()}-${props.product.id}`.replaceAll(" ", "-").replaceAll("---", "-").replaceAll("--", "-")

    const event_text = props.product.event_text ?? (props.product.in_stock ? "" : "Out of stock")
    const event_color = props.product.event_color ?? (props.product.in_stock ? "" : "#ffff0000") // red

    return (
        <Link prefetch={true} href={productUrl}>
            <div class={style}>
                <Image alt={`${props.product.brand_name} ${props.product.name}`} src={url} layout="fullWidth" loading="lazy" decoding="async" class="w-full aspect-square object-contain" />
                <div class="flex mt-auto justify-between px-[6px] text-base">
                    {
                        props.productPage ?
                            (<h1 class="text-base font-normal">{props.product.name}</h1>) :
                            (<p class="text-base font-normal">{props.product.name}</p>)
                    }
                    <span class="font-bold">${props.product.regular_price ?? 0}</span>
                </div>
                <div class="p-1 m-1 text-center text-base text-zinc-100 font-bold rounded-[4px] bg-blue-600">
                    <span>{props.product.brand_name ?? "Botra Computer"}</span>
                </div>
                {(event_text != null && event_text != "") && (
                    <div class="absolute -top-1 -left-1 p-1 pt-2 pl-2 rounded-[4px] text-white text-sm" style={"background-color:#" + event_color?.substring(3, 9) + event_color?.substring(1, 3) + ";"}>
                        {event_text}
                    </div>
                )}
            </div>
        </Link>
    )
})