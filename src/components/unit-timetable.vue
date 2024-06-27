<script setup lang="ts">
import UnitTimetableLesson from "./unit-timetable-lesson.vue";
import type { TimetableVersion, TimetableUnit, TimetableLesson } from "@/types";
import { getCommon, getTimeSlotTime } from "@/utils";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  common: ReturnType<typeof getCommon>;
  version: TimetableVersion;
  unit: TimetableUnit;
}>();

const lessons = ref<TimetableLesson[][][] | null>(null);

onMounted(() => {
  getLessons();
});
watch(
  () => props.unit,
  () => {
    getLessons();
  }
);

// TODO: Edupage - weeks
function getLessons() {
  const l = new Map(
    props.version.data.common.timeSlots.map((timeSlot) => [
      timeSlot.id,
      new Map(
        props.version.data.common.days.map((day) => [
          day.id,
          [] as TimetableLesson[],
        ])
      ),
    ])
  );
  props.version.data.lessons.forEach((lesson) => {
    let isUnitLesson = false;
    switch (props.unit.type) {
      case "o":
        isUnitLesson = lesson.classIds.includes(props.unit.data.id);
        break;
      case "n":
        isUnitLesson = lesson.teacherIds.includes(props.unit.data.id);
        break;
      case "s":
        isUnitLesson = lesson.roomIds.includes(props.unit.data.id);
        break;
      case "u":
        isUnitLesson = lesson.studentIds.includes(props.unit.data.id);
        break;
    }
    if (isUnitLesson) l.get(lesson.timeSlotId)!.get(lesson.dayId)!.push(lesson);
  });
  lessons.value = [...l.values()]
    .filter((timeSlot) => [...timeSlot.values()].find((day) => day.length))
    .map((timeSlot) => [...timeSlot.values()]);
}
</script>

<template>
  <div
    class="grid mt-5 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    :style="{
      'grid-template-columns': `min-content repeat(${
        [...common.days.values()].length
      }, 1fr)`,
    }"
    style="column-gap: 1px"
    v-if="lessons"
  >
    <div class="border-b bg-white dark:bg-gray-900 dark:border-gray-700" />
    <div
      class="border-b text-center font-medium p-3 bg-white dark:bg-gray-900 dark:border-gray-700"
      v-for="(day, dayIndex) in [...common.days.values()]"
      :key="dayIndex"
    >
      {{ day.name }}
    </div>
    <template v-for="(ts, tsIndex) in lessons" :key="tsIndex">
      <div
        class="bg-white dark:bg-gray-900 flex items-center justify-center flex-col py-2 px-4"
      >
        <div class="text-sm text-gray-800 dark:text-gray-200">
          {{
            getTimeSlotTime([...common.timeSlots.values()][tsIndex].beginMinute)
          }}
        </div>
        <div class="font-medium">
          {{ [...common.timeSlots.values()][tsIndex].short }}
        </div>
        <div class="text-sm text-gray-800 dark:text-gray-200">
          {{
            getTimeSlotTime([...common.timeSlots.values()][tsIndex].endMinute)
          }}
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-900 p-2 flex flex-col"
        v-for="(tsDay, tsDayIndex) in ts"
        :key="tsDayIndex"
      >
        <div
          v-if="tsDay.length > 1"
          class="flex justify-center items-center border rounded-md text-sm flex-1 p-1 dark:border-gray-700"
        >
          <div>
            <span class="font-semibold">{{ tsDay.length }}</span>
            {{ tsDay.length > 4 ? "grup" : "grupy" }}
          </div>
        </div>
        <unit-timetable-lesson
          v-else-if="tsDay.length"
          :lesson="tsDay[0]"
          :common="common"
          :unit="unit"
        />
      </div>
    </template>
  </div>
</template>
