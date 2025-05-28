import { component$ } from "@builder.io/qwik";
import ProductItem from "./product-item";

interface ProductItemProps {
    title: string
    products: ProductModel[]
}

export default component$((props: ProductItemProps) => {

    return (
        <>
            <h5 class="text-xl font-bold text-blue-800 underline underline-offset-[12px] mt-4">{props.title}</h5>
            <div class="mt-4 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
                {
                    props.products.map(product => <ProductItem key={product.id} product={product} />)
                }
            </div>
        </>
    )
})