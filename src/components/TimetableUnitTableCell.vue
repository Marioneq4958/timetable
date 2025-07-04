<script setup lang="ts">
import type { TimetableDay, TimetableLesson, TimetableTimeSlot } from '@/timetable';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { computed, ref, watch } from 'vue';
import { getTimeSlotTime } from '@/utils';
import TimetableUnitTableCellMultiple from './TimetableUnitTableCellMultiple.vue';
import TimetableUnitTableCellSingle from './TimetableUnitTableCellSingle.vue';
import TimetableUnitTableCellDialogLesson from './TimetableUnitTableCellDialogLesson.vue';

const props = defineProps<{
  day: TimetableDay;
  timeSlot: TimetableTimeSlot;
  lessons: TimetableLesson[];
}>();

const start = computed(() => getTimeSlotTime(props.timeSlot.beginMinute));
const end = computed(() => getTimeSlotTime(props.timeSlot.endMinute));
const showDialog = ref(false);

watch(
  () => props.lessons,
  () => {
    showDialog.value = false;
  },
  { deep: true },
);
</script>

<template>
  <Dialog v-model:open="showDialog" v-if="lessons.length">
    <DialogTrigger as-child>
      <div
        class="border-r last:border-none px-2 flex max-w-full overflow-hidden min-w-35 snap-start"
        style="scroll-snap-stop: always"
      >
        <TimetableUnitTableCellMultiple v-if="props.lessons.length > 1" :lessons="props.lessons" />
        <TimetableUnitTableCellSingle v-else :lesson="props.lessons[0]" />
      </div>
    </DialogTrigger>
    <DialogContent class="overflow-y-scroll max-h-dvh">
      <DialogHeader>
        <DialogTitle>Lekcja {{ props.timeSlot.name }}, {{ start }} - {{ end }}</DialogTitle>
        <DialogDescription>{{ props.day.name }}</DialogDescription>
      </DialogHeader>
      <TimetableUnitTableCellDialogLesson
        v-for="(lesson, index) in props.lessons"
        :key="index"
        :lesson="lesson"
      />
    </DialogContent>
  </Dialog>
  <div
    class="border-r last:border-none min-w-35 snap-start"
    style="scroll-snap-stop: always"
    v-else
  />
</template>
