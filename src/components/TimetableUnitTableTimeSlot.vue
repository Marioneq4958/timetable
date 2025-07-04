<script setup lang="ts">
import type { TimetableTimeSlot } from '@/timetable';
import { getTimeSlotTime } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{ timeSlot: TimetableTimeSlot }>();

const start = computed(() => getTimeSlotTime(props.timeSlot.beginMinute));
const end = computed(() => getTimeSlotTime(props.timeSlot.endMinute));
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-0.5 sticky left-0 bg-background border-r"
  >
    <div class="text-xs text-muted-foreground">{{ start }}</div>
    <div class="text-sm font-semibold">{{ props.timeSlot.name }}</div>
    <div class="text-xs text-muted-foreground">{{ end }}</div>
  </div>
</template>
