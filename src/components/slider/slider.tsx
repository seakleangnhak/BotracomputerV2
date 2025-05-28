import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

export default component$(() => {

    const slideImages = [
        `https://ik.imagekit.io/botracomputer/uploads/slide/home_banner_1.jpeg`,
        // `https://ik.imagekit.io/botracomputer/uploads/slide/home_banner_2.jpeg`,
        `https://ik.imagekit.io/botracomputer/uploads/slide/home_banner_3.jpeg`,
        `https://ik.imagekit.io/botracomputer/uploads/slide/home_banner_4.jpg`,
        `https://ik.imagekit.io/botracomputer/uploads/slide/home_banner_5.jpg`,
    ]

    const currentIndexSignal = useSignal(0)

    const prevSlide = $(() => {
        const isFirstIndex = currentIndexSignal.value == 0
        currentIndexSignal.value = isFirstIndex ? slideImages.length - 1 : currentIndexSignal.value - 1
    })

    const nexSlide = $(() => {
        const isEndIndex = currentIndexSignal.value == slideImages.length - 1
        currentIndexSignal.value = isEndIndex ? 0 : currentIndexSignal.value + 1
    })

    const getButtonStyle = (index: number) => {
        return currentIndexSignal.value == index ? "w-2 h-2 md:w-3 md:h-3 rounded-full bg-zinc-200 border-slate-700 border-[1px]" : "w-2 h-2 md:w-3 md:h-3 rounded-full bg-zinc-200"
    }

    const getImgStyle = (index: number) => {
        if (currentIndexSignal.value == index) {
            return "absolute top-0 left-0 h-full w-full object-cover duration-300 ease-in-out transition-all"
        } else if (currentIndexSignal.value > index) {
            return "absolute top-0 -left-[100%] h-full w-full object-cover duration-300 ease-in-out transition-all"
        } else {
            return "absolute top-0 left-[100%] h-full w-full object-cover duration-300 ease-in-out transition-all"
        }
    }

    const allImgSize = [360, 380, 400, 640, 768, 1024, 1280]

    const getImgSrcset = (image: string) => {
        let scrSet = ""

        allImgSize.forEach((size, index) => {
            scrSet += `${image}?tr=w-${size},h-${size},c-at_max ${size}w`
            if (index < allImgSize.length - 1) {
                scrSet += ','
            }
        });

        return scrSet
    }

    useVisibleTask$((taskContext) => {
        const interval = setInterval(() => {
            nexSlide()
        }, 3000);

        taskContext.cleanup(() => clearInterval(interval));
    });

    return (

        <div class="max-w-screen-xl xl:mx-auto mx-2 md:mx-4 lg:mx-16 mt-4">
            <div class="relative my-4">
                {/* <!-- Carousel wrapper --> */}
                <div class="overflow-hidden rounded-md relative h-[calc(100vw*0.4)] max-h-[512px]">
                    {/* <!-- Item --> */}
                    {
                        slideImages.map((image, index) => (
                            <Image layout="fullWidth" loading={index == 0 ? "eager" : "lazy"}
                                decoding="async" key={image}
                                srcSet={getImgSrcset(image)}
                                src={`${image}?tr=w-640,h-640,c-at_max`}
                                class={getImgStyle(index)} alt={"Botra Computer Slide Image " + index}
                            />
                        ))
                    }

                </div>
                {/* <!-- Slider indicators --> */}
                <div class="flex absolute bottom-2 md:bottom-2 left-1/2 z-30 space-x-3 -translate-x-1/2">
                    {
                        slideImages.map((_, index) => (
                            <div key={index} class={getButtonStyle(index)}></div>
                        ))
                    }
                </div>
                {/* <!-- Slider controls --> */}
                <button type="button" onClick$={prevSlide} class="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none" aria-label="Previous Slide">
                    <span class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30  group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                        <svg class="w-5 h-5 text-white sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        <span class="hidden">Previous</span>
                    </span>
                </button>
                <button type="button" onClick$={nexSlide} class="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none" aria-label="Next Slide">
                    <span class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30  group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                        <svg class="w-5 h-5 text-white sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        <span class="hidden">Next</span>
                    </span>
                </button>
            </div>
        </div>

    )
})