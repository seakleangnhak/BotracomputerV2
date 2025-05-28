import { Slot, component$ } from "@builder.io/qwik"

export default component$(() => {
    return (
        <div class="font-bold text-xl flex h-full items-center p-3 lg:p-4 lg:px-5 hover:bg-white/10 transition-colors ease-in-out">
            <Slot />
        </div>
    )
})