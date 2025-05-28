import { component$ } from "@builder.io/qwik"
import MenuItem from "../header/menu-item"

export default component$(() => {
    return (
        <footer class="sticky bottom-0 z-20 text-zinc-200 md:hidden">
            <div class="flex justify-center lg:px-20 bg-gradient-to-r from-blue-800 to-blue-700">
                <a href="tel:015818781"><MenuItem>Tel: 015 818 781</MenuItem></a>
            </div>
        </footer>
    )
})