<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import type { PreparedTimetableVersionData, TimetableLesson, TimetableUnit } from '@/timetable';
import { computed, ref, watchEffect } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import TimetableUnitTableLessonsRow from '@/components/TimetableUnitTableLessonsRow.vue';
import TimetableUnitTableEmptyRow from '@/components/TimetableUnitTableEmptyRow.vue';
import { notNullableComputed } from '@/utils';

const props = defineProps<{ unit: TimetableUnit }>();
const timetableStore = useTimetableStore();

const preparedVersionData = notNullableComputed(() => timetableStore.preparedVersionData);
const lessonsWithTimeSlots = ref<TimetableLesson[][][][][] | null>();

const periodIndex = ref(0);
const weekIndex = ref(0);

const lastTimeSlotIndex = ref<number | null>(null);

const filterLessonsByUnit = (versionData: PreparedTimetableVersionData, unit: TimetableUnit) =>
  versionData.lessonsWithTimeSlots.map((period) =>
    period.map((week) =>
      week.map((day) =>
        day.map((timeSlot) =>
          timeSlot.filter((lesson) => {
            switch (unit.type) {
              case 'o':
                return lesson.classIds.includes(unit.id);
              case 'n':
                return lesson.teacherIds.includes(unit.id);
              case 's':
                return lesson.roomIds.includes(unit.id);
              default:
                return lesson.studentIds.includes(unit.id);
            }
          }),
        ),
      ),
    ),
  );

function getLastTimeSlotIndex(lessons: TimetableLesson[][][][][]) {
  let index = 0;
  lessons[periodIndex.value][weekIndex.value].forEach((day) => {
    day.forEach((timeSlot, timeSlotIndex) => {
      if (!timeSlot.length) return;
      index = Math.max(index, timeSlotIndex);
    });
  });
  return index;
}

watchEffect(() => {
  lessonsWithTimeSlots.value = filterLessonsByUnit(preparedVersionData.value, props.unit);
  lastTimeSlotIndex.value = getLastTimeSlotIndex(lessonsWithTimeSlots.value);
});

const gridRows = computed(() => {
  if (!lessonsWithTimeSlots.value || lastTimeSlotIndex.value === null) return 0;
  return preparedVersionData.value.common.timeSlots
    .map((timeSlot, index) => {
      if (index > lastTimeSlotIndex.value!) return '';
      const timeSlotDuration = timeSlot.endMinute - timeSlot.beginMinute;
      if (index === lastTimeSlotIndex.value) return `${timeSlotDuration / 45}fr`;

      const nextTimeSlot = preparedVersionData.value.common.timeSlots[index + 1];
      const breakDuration = nextTimeSlot.beginMinute - timeSlot.endMinute;

      const lessonHeight = timeSlotDuration > 0 ? timeSlotDuration / 45 : 0;
      const breakHeight =
        timeSlot.endMinute - timeSlot.beginMinute && breakDuration > 0 ? breakDuration / 45 : 0;
      return `${lessonHeight}fr ${breakHeight}fr`;
    })
    .join(' ');
});

const mobileTimetable = useMediaQuery('(width < 48rem)');
</script>

<template>
  <div
    class="grid bg-background md:rounded-lg border-t md:border md:mx-8 md:mb-8 overflow-x-auto flex-1 snap-x snap-mandatory scroll-pl-[63px]"
    :style="{
      gridTemplateColumns: mobileTimetable
        ? `4rem repeat(${preparedVersionData.common.days.length}, calc(100% - 4rem))`
        : `4rem repeat(${lessonsWithTimeSlots[periodIndex][weekIndex].length}, 1fr)`,
      gridTemplateRows: `max-content 0.5rem ${gridRows} 0.5rem`,
    }"
    v-if="lessonsWithTimeSlots && lastTimeSlotIndex !== null"
  >
    <div class="contents">
      <div class="border-b sticky left-0 border-r bg-background" />
      <div
        v-for="(day, index) in preparedVersionData.common.days"
        :key="index"
        class="px-2 py-4 font-semibold text-center border-r last:border-r-0 border-b"
      >
        {{ day.name }}
      </div>
    </div>
    <TimetableUnitTableEmptyRow :days-length="preparedVersionData.common.days.length" />
    <template
      v-for="(timeSlot, timeSlotIndex) in preparedVersionData.common.timeSlots"
      :key="timeSlotIndex"
    >
      <template v-if="timeSlotIndex <= lastTimeSlotIndex">
        <TimetableUnitTableLessonsRow
          :days="preparedVersionData.common.days"
          :time-slot="timeSlot"
          :lessons="lessonsWithTimeSlots[periodIndex][weekIndex].map((day) => day[timeSlotIndex])"
        />
        <TimetableUnitTableEmptyRow :days-length="preparedVersionData.common.days.length" />
      </template>
    </template>
  </div>
</template>
