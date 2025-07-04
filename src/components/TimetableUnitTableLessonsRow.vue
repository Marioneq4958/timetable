<script setup lang="ts">
import type { TimetableDay, TimetableLesson, TimetableTimeSlot } from '@/timetable';
import TimetableUnitTableTimeSlot from '@/components/TimetableUnitTableTimeSlot.vue';
import TimetableUnitTableCell from './TimetableUnitTableCell.vue';

const props = defineProps<{
  days: TimetableDay[];
  timeSlot: TimetableTimeSlot;
  lessons: TimetableLesson[][];
}>();
</script>

<template>
  <div class="contents">
    <TimetableUnitTableTimeSlot :time-slot="props.timeSlot" />
    <TimetableUnitTableCell
      v-for="(day, dayIndex) in props.days"
      :key="dayIndex"
      :time-slot="props.timeSlot"
      :day="day"
      :lessons="props.lessons[dayIndex]"
    />
  </div>
</template>
