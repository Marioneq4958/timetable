<script setup lang="ts">
import { LucideArrowLeft, LucideMenu } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { Button } from '@/components/ui/button';
import ThemeSwitchButton from './ThemeSwitchButton.vue';
import { useTimetableStore } from '@/stores/timetable.store';

const timetableStore = useTimetableStore();
</script>

<template>
  <div class="flex gap-4 mx-5 my-4 md:mx-8 md:mt-6 md:mb-0">
    <Button
      variant="outline"
      size="icon"
      @click="timetableStore.toggleMenu()"
      class="hidden md:flex xl:hidden"
    >
      <LucideMenu />
    </Button>
    <Button as-child variant="outline">
      <RouterLink :to="{ name: 'home' }"><LucideArrowLeft /> Wróć na stronę główną</RouterLink>
    </Button>
    <div class="flex-1" />
    <ThemeSwitchButton />
  </div>
</template>
