import { Slot, component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

interface HeaderModalProps {
    title: string
    onClose: PropFunction<VoidFunction>
}

export default component$((props: HeaderModalProps) => {
    return (
        <div aria-hidden="true" class="bg-black/30 fixed top-0 left-0 right-0 z-50 w-full p-4 md:inset-0 h-full max-h-full fade-in">
            <div onclick$={() => { }} class="flex flex-col bg-zinc-200 relative mx-auto p-4 w-full max-w-screen-xl h-full rounded-md">
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h4 class="text-xl font-bold flex-grow text-center text-blue-800"> {props.title} </h4>
                    <button onclick$={props.onClose} type="button" class="text-gray-400 bg-transparent hover:text-zinc-200 hover:bg-blue-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>

                <div class="w-full flex-grow overflow-x-hidden overflow-y-auto">
                    <Slot />
                </div>
            </div>
        </div>
    )
})