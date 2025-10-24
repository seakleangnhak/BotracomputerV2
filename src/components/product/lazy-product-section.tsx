import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import ProductSection from "./product-section";

interface LazyProductSectionProps {
  title: string;
  products: ProductModel[];
  immediate?: boolean;
}

export default component$((props: LazyProductSectionProps) => {
  const showSection = useSignal(props.immediate ?? false);

  useVisibleTask$(() => {
    if (!showSection.value) {
      showSection.value = true;
    }
  });

  return (
    <div class="mt-4">
      {showSection.value ? (
        <ProductSection title={props.title} products={props.products} />
      ) : (
        <div class="space-y-3">
          <h5 class="text-xl font-bold text-blue-800 underline underline-offset-[12px]">
            {props.title}
          </h5>
          <div class="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                class="h-48 w-full animate-pulse rounded-md border-[2px] border-blue-100 bg-blue-50"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
