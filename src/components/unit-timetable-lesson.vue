<script setup lang="ts">
import type { TimetableCommonGroup, TimetableLesson } from "@/types";
import { getCommon } from "@/utils";
import { computed } from "vue";

const props = defineProps<{
  lesson: TimetableLesson;
  common: ReturnType<typeof getCommon>;
  unit: TimetableUnit;
}>();

const students = computed(() =>
  props.lesson.studentIds.map(
    (studentId) => props.common.students.get(studentId)!
  )
);
const subject = computed(() =>
  props.lesson.subjectId
    ? props.common.subjects.get(props.lesson.subjectId)!
    : null
);
const teachers = computed(() =>
  props.lesson.teacherIds.map(
    (teacherId) => props.common.teachers.get(teacherId)!
  )
);
const rooms = computed(() =>
  props.lesson.roomIds.map((roomId) => props.common.rooms.get(roomId)!)
);
const classes = computed(() =>
  props.lesson.classIds.map((classId) => props.common.classes.get(classId)!)
);
const groups = computed(() =>
  props.lesson.groupIds.map(
    (groupId) => props.common.commonGroups.get(groupId)!
  )
);
function getClassGroup(classId: string) {
  return groups.value.find(
    (group) => group.classId === classId && !group.entireClass
  )?.short;
}

function getTileClasses() {
  return classes.value
    .map((class_) => {
      const classGroup = getClassGroup(class_.id);
      return `${class_.short ?? class_.name ?? class_.fullName} ${
        classGroup ? "(" + classGroup + ")" : ""
      }`;
    })
    .join(", ");
}

function getTileTeachersLong() {
  return teachers.value
    .map((teacher) => teacher.fullName ?? teacher.short ?? teacher.name)
    .join(", ");
}

function getTileTeachersShort() {
  return teachers.value
    .map((teacher) => teacher.short ?? teacher.name ?? teacher.fullName)
    .join(", ");
}

function getTileRooms() {
  return rooms.value
    .map((room) => room.short ?? room.name ?? room.fullName)
    .join(", ");
}
</script>

<template>
  <div
    class="bg-green-50 border-l-4 border-green-800 rounded-r-md px-2.5 py-2 flex-1 dark:bg-green-950 dark:border-green-400"
  >
    <div class="font-semibold text-sm">
      {{ subject?.name ?? subject?.short ?? lesson.comment }}
      <template
        v-if="subject && unit.type === 'o' && getClassGroup(unit.data.id)"
      >
        ({{ getClassGroup(unit.data.id) }})
      </template>
    </div>
    <div class="text-sm" v-if="subject">
      <template
        v-if="unit.type === 'o' || unit.type === 'n' || unit.type === 'u'"
      >
        {{ getTileRooms() }} &bullet;
      </template>
      <template v-if="unit.type === 's' || unit.type === 'n'">
        {{ getTileClasses() }}
        <template v-if="unit.type === 's'"> &bullet; </template>
      </template>
      <template
        v-if="unit.type === 'o' || unit.type === 's' || unit.type === 'u'"
      >
        <span class="2xl:hidden" :class="{ hidden: teachers.length > 1 }">{{
          getTileTeachersShort()
        }}</span>
        <span class="hidden" :class="{ '2xl:inline': teachers.length === 1 }">{{
          getTileTeachersLong()
        }}</span>
      </template>
    </div>
  </div>
</template>
