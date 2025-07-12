<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { LucideChevronRight } from 'lucide-vue-next';
</script>

<template>
  <header class="top-0 sticky bg-background/60 backdrop-blur-md">
    <div class="max-w-screen-xl mx-auto flex justify-between py-5 px-7 items-center">
      <div class="flex gap-3 items-center">
        <img src="@/assets/img/icon-512x512.png" alt="Logo aplikacji" class="size-9" />
        <span class="font-semibold tracking-tight text-primary text-lg">lekcje.one</span>
      </div>
      <div />
    </div>
  </header>
  <main class="max-w-screen-xl mx-auto">
    <section class="content-center py-24 text-center px-7">
      <h1 class="text-6xl font-bold text-emerald-950 dark:text-emerald-200 tracking-tight my-5">
        Plan lekcji w jednym miejscu
      </h1>
      <p class="text-lg text-accent-foreground/80">
        Otwartoźródłowa aplikacja do planu lekcji w twojej szkole, działa w trybie offline.
      </p>
      <Button size="lg" class="my-4" as-child>
        <RouterLink :to="{ name: 'schools-map' }">Rozpocznij <LucideChevronRight /></RouterLink>
      </Button>
    </section>
    <section class="py-10">
      <img
        src="@/assets/img/timetable-screen-desktop.png"
        class="max-w-screen-lg shadow-[0_10px_100px_25px] shadow-emerald-600/10 dark:shadow-emerald-200/40 rounded-lg block mx-auto"
      />
    </section>
  </main>
  <footer class="mt-10">
    <div class="max-w-screen-xl mx-auto flex justify-between py-8 px-7">
      <div class="text-lg font-semibold">lekcje.one</div>
      <div class="flex gap-3">
        <a
          href="https://github.com/#"
          class="hover:underline text-foreground/85 hover:text-foreground transition-colors"
          >GitHub</a
        >
      </div>
    </div>
  </footer>
</template>
