<script setup lang="ts">
import TimetableNavigation from '@/components/TimetableNavigation.vue';
import TimetableVersion from '@/components/TimetableVersion.vue';
import { useTimetableStore } from '@/stores/timetable.store';
import { useMediaQuery } from '@vueuse/core';

const timetableStore = useTimetableStore();

const fixedSidebar = useMediaQuery('(48rem < width < 80rem)');
</script>

<template>
  <Transition
    enter-from-class="left-[-100vh]"
    enter-to-class="left-0"
    leave-from-class="left-0"
    leave-to-class="left-[-100vh]"
  >
    <nav
      class="w-96 h-dvh overflow-auto fixed xl:sticky top-0 bottom-0 left-0 border-r p-6 flex flex-col bg-background z-20 transition-all [transition-duration:0.4s]"
      v-if="!fixedSidebar || timetableStore.showMenu"
    >
      <TimetableNavigation />
      <div class="flex-1" />
      <TimetableVersion />
    </nav>
  </Transition>
  <Transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="z-10 fixed top-0 left-0 right-0 bottom-0 bg-zinc-950/50 transition-all [transition-duration:0.4s]"
      v-if="fixedSidebar && timetableStore.showMenu"
      @click="timetableStore.toggleMenu(false)"
    />
  </Transition>
</template>
