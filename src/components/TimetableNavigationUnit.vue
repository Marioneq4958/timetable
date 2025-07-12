<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import type { RouteLocationAsRelativeGeneric } from 'vue-router';

const props = defineProps<{ name: string; to: RouteLocationAsRelativeGeneric }>();
const timetableStore = useTimetableStore();
</script>

<template>
  <li>
    <RouterLink
      :to="props.to"
      @click="timetableStore.toggleMenu(false)"
      class="block px-3 py-2 rounded-md hover:bg-input/50 transition-all my-0.5 lg:text-sm"
      active-class="!bg-input/50"
    >
      {{ props.name }}
    </RouterLink>
  </li>
</template>
