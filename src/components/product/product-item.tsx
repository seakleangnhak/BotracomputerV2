import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { buildImageKitSeoUrl, buildSlug } from "~/utils/url";

export default component$((props: { product: ProductModel; productPage?: boolean }) => {
  const imageUrl = buildImageKitSeoUrl(
    props.product.images,
    props.product.name,
    {
      width: props.productPage ? 500 : 300,
      height: props.productPage ? 500 : 300,
      crop: "at_max",
    },
  );

  const baseClass =
    "col-span-1 flex flex-col border-[2px] h-full w-full border-blue-600 rounded-md bg-white overflow-hidden cursor-pointer";
  const cardClass = props.productPage
    ? baseClass
    : `${baseClass} hover:shadow-lg ease-in-out hover:-translate-y-1 transition-all relative`;

  const productUrl = props.productPage
    ? "#"
    : `/product/${buildSlug(
        props.product.brand_name,
        props.product.name,
        props.product.id,
      )}`;

  const badgeText =
    props.product.event_text ??
    (props.product.in_stock ? "" : "Out of stock");

  const rawBadgeColor =
    props.product.event_color ??
    (props.product.in_stock ? "" : "#ffff0000");

  const badgeColor =
    rawBadgeColor && rawBadgeColor.length === 9
      ? `#${rawBadgeColor.substring(3, 9)}${rawBadgeColor.substring(1, 3)}`
      : "#ff0000cc";

  return (
    <Link prefetch={false} href={productUrl}>
      <div class={cardClass}>
        <Image
          alt={`${props.product.brand_name ?? ""} ${props.product.name}`}
          src={imageUrl}
          layout="fullWidth"
          loading="lazy"
          decoding="async"
          class="w-full aspect-square object-contain"
        />
        <div class="flex mt-auto justify-between px-[6px] text-base">
          {props.productPage ? (
            <h1 class="text-base font-normal">{props.product.name}</h1>
          ) : (
            <p class="text-base font-normal">{props.product.name}</p>
          )}
          <span class="font-bold">${props.product.regular_price ?? 0}</span>
        </div>
        <div class="p-1 m-1 text-center text-base text-zinc-100 font-bold rounded-[4px] bg-blue-600">
          <span>{props.product.brand_name ?? "Botra Computer"}</span>
        </div>
        {badgeText && (
          <div
            class="absolute -top-1 -left-1 p-1 pt-2 pl-2 rounded-[4px] text-white text-sm"
            style={`background-color:${badgeColor};`}
          >
            {badgeText}
          </div>
        )}
      </div>
    </Link>
  );
});
