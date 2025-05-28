import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import BrandHomeItem from "./brand-home-item";
import HeaderModal from "../modal/header-modal";

interface BrandModalProps {
    brands: BrandModel[]
    onClose: PropFunction<VoidFunction>
}

export default component$((props: BrandModalProps) => {
    return (
        <HeaderModal title="Brand" onClose={props.onClose}>
            <div class="m-4 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
                {
                    props.brands.map(brand => <BrandHomeItem key={brand.id} brand={brand} closeModal={props.onClose} />)
                }
            </div>
        </HeaderModal>
    )
})