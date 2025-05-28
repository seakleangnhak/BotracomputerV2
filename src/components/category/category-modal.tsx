import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import CategoryModalItem from "./category-modal-item";
import HeaderModal from "../modal/header-modal";

interface CategoryModalProps {
    category: CategoryModel[]
    onClose: PropFunction<VoidFunction>
}

export default component$((props: CategoryModalProps) => {
    return (
        <HeaderModal title="Category" onClose={props.onClose}>
            <div class="m-4 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
                {
                    props.category.map(category => <CategoryModalItem key={category.id} category={category} closeModal={props.onClose} />)
                }
            </div>
        </HeaderModal>
    )
})