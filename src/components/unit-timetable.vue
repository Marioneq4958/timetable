<script setup lang="ts">
import type { TimetableVersion, TimetableUnit, TimetableLesson } from "@/types";
import { getCommon } from "@/utils";
import { onMounted, ref } from "vue";

const props = defineProps<{
  common: ReturnType<typeof getCommon>;
  version: TimetableVersion;
  unit: TimetableUnit;
}>();

const lessons = ref<TimetableLesson[][][] | null>(null);

onMounted(() => {
  getLessons();
});

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
  lessons.value = [...l.values()].map((timeSlot) => [...timeSlot.values()]);
}
</script>

<template>
  <div
    class="grid mt-5 border rounded-md bg-gray-200"
    :style="{
      'grid-template-columns': `min-content repeat(${
        [...common.days.values()].length
      }, 1fr)`,
    }"
    style="column-gap: 1px"
    v-if="lessons"
  >
    <div class="border-b bg-white" />
    <div
      class="border-b text-center font-medium p-3 bg-white"
      v-for="(day, dayIndex) in [...common.days.values()]"
      :key="dayIndex"
    >
      {{ day.name }}
    </div>
    <template v-for="(ts, tsIndex) in lessons" :key="tsIndex">
      <div
        class="bg-white flex items-center justify-center flex-col py-2 px-4 gap-1"
      >
        <div class="text-sm text-gray-800">
          {{ [...common.timeSlots.values()][tsIndex].beginMinute }}
        </div>
        <div class="font-medium">
          {{ [...common.timeSlots.values()][tsIndex].short }}
        </div>
        <div class="text-sm text-gray-800">
          {{ [...common.timeSlots.values()][tsIndex].endMinute }}
        </div>
      </div>
      <div class="bg-white" v-for="(tsDay, tsDayIndex) in ts" :key="tsDayIndex">
        <div v-for="(lesson, lessonIndex) in tsDay" :key="lessonIndex">
          Grupa seminarna: {{ lesson.seminarGroup }}<br />
          Uczniowie: {{ lesson.studentIds }}<br />
          Przedmiot: {{ lesson.subjectId }}<br />
          Nauczciele: {{ lesson.teacherIds }}<br />
          Sale: {{ lesson.roomIds }}<br />
          Oddziały: {{ lesson.classIds }}<br />
          Grupy: {{ lesson.groupIds }}<br />
          Grupa międzyoddziałowa: {{ lesson.interclassGroupId }}<br />
          Komentarz: {{ lesson.comment }}
        </div>
      </div>
    </template>
  </div>
</template>
