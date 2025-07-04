<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import type { TimetableUnit } from '@/timetable';
import { notNullableComputed } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{
  unit: TimetableUnit;
}>();

const timetableStore = useTimetableStore();
const school = notNullableComputed(timetableStore.school);
const title = computed(() => {
  switch (props.unit.type) {
    case 'o':
      return `Plan oddziału ${props.unit.fullName ?? props.unit.name ?? props.unit.short}`;
    case 'n':
      return `Plan nauczyciela ${props.unit.fullName ?? props.unit.name ?? props.unit.short}`;
    case 's':
      return `Plan sali ${props.unit.fullName ?? props.unit.name ?? props.unit.short}`;
    default:
      return `Plan ucznia ${props.unit.name ?? props.unit.short}`;
  }
});
</script>

<template>
  <header class="my-7 hidden md:block px-8">
    <h1 class="text-4xl font-bold tracking-tight my-1.5">{{ title }}</h1>
    <p class="text-muted-foreground tracking-tight">
      {{ school.name }}, {{ school.addressTown }} {{ school.addressZipCode }} [RSPO:{{
        school.rspoId
      }}]
    </p>
  </header>
</template>
