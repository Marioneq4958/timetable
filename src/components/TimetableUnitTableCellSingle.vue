<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import type { TimetableLesson } from '@/timetable';
import { getEntitiesFromMap, notNullableComputed } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{ lesson: TimetableLesson }>();

const timetableStore = useTimetableStore();

const preparedVersionData = notNullableComputed(timetableStore.preparedVersionData);

const subject = computed(() => {
  if (!props.lesson.subjectId) return;
  return preparedVersionData.value.common.subjects.get(props.lesson.subjectId)!;
});

const roomsText = computed(() => {
  const rooms = getEntitiesFromMap(preparedVersionData.value.common.rooms, props.lesson.roomIds);
  return rooms.map((room) => room.short ?? room.name ?? room.fullName).join(', ');
});

const teachersText = computed(() => {
  const teachers = getEntitiesFromMap(
    preparedVersionData.value.common.teachers,
    props.lesson.teacherIds,
  );
  return teachers.map((teacher) => teacher.fullName ?? teacher.name ?? teacher.short).join(', ');
});

const studentsText = computed(() => {
  const students = getEntitiesFromMap(
    preparedVersionData.value.common.students,
    props.lesson.studentIds,
  );
  return students.map((student) => student.name ?? student.short).join(', ');
});

const classesText = computed(() => {
  const classes = getEntitiesFromMap(
    preparedVersionData.value.common.classes,
    props.lesson.classIds,
  );
  const groups = getEntitiesFromMap(
    preparedVersionData.value.common.commonGroups,
    props.lesson.groupIds,
  );
  return classes
    .map((class_) => {
      const classGroups = groups.filter((group) => group?.classId === class_.id);
      const groupsText = classGroups.length
        ? `(${classGroups.map((group) => group.short).join(', ')})`
        : undefined;
      const classText = class_.short ?? class_.name ?? class_.fullName;
      return groupsText ? `${classText} ${groupsText}` : classText;
    })
    .join(', ');
});
</script>

<template>
  <div
    class="w-full user-select-none hover:bg-emerald-700/20 transition-all cursor-pointer border border-emerald-800/40 dark:border-emerald-200/40 text-emerald-950 dark:text-emerald-100 px-2 py-1 bg-emerald-600/10 rounded-md flex-1"
  >
    <p class="text-sm w-full flex justify-between gap-3 items-center">
      <span class="font-semibold text-nowrap text-ellipsis overflow-hidden">
        <template v-if="subject">
          {{ subject.name ?? subject.short }}
        </template>
        <template v-else>{{ props.lesson.comment }}</template>
      </span>
      <span v-if="props.lesson.roomIds.length" class="text-xs text-right">
        {{ roomsText }}
      </span>
    </p>
    <div>
      <p class="text-xs font-medium" v-if="props.lesson.teacherIds.length">
        {{ teachersText }}
      </p>
      <p class="text-xs font-medium" v-if="props.lesson.studentIds.length">
        {{ studentsText }}
      </p>
      <p class="text-xs font-medium" v-if="props.lesson.classIds.length">
        {{ classesText }}
      </p>
    </div>
  </div>
</template>
