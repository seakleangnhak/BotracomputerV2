import { component$, Slot } from '@builder.io/qwik';

export default component$(() => (
  <div class="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
    <main class="flex flex-1 items-center justify-center px-6">
      <Slot />
    </main>
  </div>
));
