<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import { notNullableComputed } from '@/utils';

const emit = defineEmits(['click']);

const props = defineProps<{ title: string }>();
const timetableStore = useTimetableStore();

const school = notNullableComputed(timetableStore.school);
</script>

<template>
  <button
    class="text-center p-5 fixed bottom-0 left-0 right-0 bg-background border-t rounded-t-lg shadow-sm z-50"
    @click="emit('click')"
  >
    <div class="w-24 h-2 mx-auto rounded-lg bg-accent" />
    <p class="font-semibold text-lg my-2">{{ props.title }}</p>
    <p class="text-xs text-muted-foreground">{{ school.name }}</p>
  </button>
</template>
