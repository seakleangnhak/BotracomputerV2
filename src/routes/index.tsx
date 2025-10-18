import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => (
  <section class="w-full max-w-xl space-y-6 text-center">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
      We'll be back soon
    </p>
    <h1 class="text-4xl font-bold sm:text-5xl">Site Under Maintenance</h1>
    <p class="text-lg text-zinc-300">
      We're giving Botra Computer a quick tune-up so everything runs even better next time you visit.
      Please check back shortly while we finish up the maintenance work.
    </p>
    <p class="text-sm text-zinc-400">
      Need urgent assistance? Call us at <a class="text-blue-300 underline" href="tel:012818781">012 818 781</a> or
      <a class="text-blue-300 underline pl-1" href="tel:015818781">015 818 781</a>.
    </p>
  </section>
)); 

export const head: DocumentHead = {
  title: 'Botra Computer | Maintenance',
  meta: [
    {
      name: 'description',
      content: 'Botra Computer is temporarily offline for maintenance. Reach us by phone for immediate assistance.',
    },
    {
      name: 'robots',
      content: 'noindex,nofollow',
    },
  ],
};
