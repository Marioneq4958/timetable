<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import type { TimetableLesson } from '@/timetable';
import { getEntitiesFromMap, notNullableComputed } from '@/utils';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  lesson: TimetableLesson;
}>();

const timetableStore = useTimetableStore();

const preparedVersionData = notNullableComputed(timetableStore.preparedVersionData);

const subject = computed(() => {
  if (!props.lesson.subjectId) return;
  return preparedVersionData.value.common.subjects.get(props.lesson.subjectId)!;
});

const rooms = computed(() =>
  getEntitiesFromMap(preparedVersionData.value.common.rooms, props.lesson.roomIds),
);

const teachers = computed(() =>
  getEntitiesFromMap(preparedVersionData.value.common.teachers, props.lesson.teacherIds),
);

const students = computed(() =>
  getEntitiesFromMap(preparedVersionData.value.common.students, props.lesson.studentIds),
);

const classes = computed(() => {
  const groups = getEntitiesFromMap(
    preparedVersionData.value.common.commonGroups,
    props.lesson.groupIds,
  );
  return getEntitiesFromMap(preparedVersionData.value.common.classes, props.lesson.classIds).map(
    (class_) => ({
      ...class_,
      groups: groups.filter((group) => group?.classId === class_.id),
    }),
  );
});

const route = useRoute();
</script>

<template>
  <div class="border rounded-md">
    <p
      class="font-semibold py-2 px-4 wrap-anywhere text-center bg-emerald-800 text-white rounded-t-md"
    >
      <template v-if="subject">{{ subject.name ?? subject.short }}</template>
      <template v-else>{{ props.lesson.comment }}</template>
    </p>
    <div class="px-3 py-2">
      <div class="flex flex-col gap-2">
        <dl class="text-sm">
          <div class="my-2" v-if="classes.length">
            <dt class="font-semibold">Oddziały</dt>
            <dd>
              <RouterLink
                v-for="(class_, classIndex) in classes"
                :key="classIndex"
                :to="{
                  name: 'timetable:unit',
                  params: { ...route.params, unitTypeSlug: 'oddzial', unitId: class_.id },
                }"
              >
                {{ class_.fullName ?? class_.name ?? class_.short }}
                <template v-if="class_.groups.length">
                  ({{ class_.groups.map((group) => group.short).join(', ') }}) </template
                ><template v-if="classIndex + 1 !== classes.length">, </template>
              </RouterLink>
            </dd>
          </div>
          <div class="my-2" v-if="teachers.length">
            <dt class="font-semibold">Nauczyciele</dt>
            <dd>
              <RouterLink
                v-for="(teacher, teacherIndex) in teachers"
                :key="teacherIndex"
                :to="{
                  name: 'timetable:unit',
                  params: { ...route.params, unitTypeSlug: 'nauczyciel', unitId: teacher?.id },
                }"
              >
                {{ teacher.fullName ?? teacher.name ?? teacher.short }}
                <template v-if="teacherIndex + 1 !== teachers.length">, </template>
              </RouterLink>
            </dd>
          </div>
          <div class="my-2" v-if="rooms.length">
            <dt class="font-semibold">Sale</dt>
            <dd>
              <RouterLink
                v-for="(room, roomIndex) in rooms"
                :key="roomIndex"
                :to="{
                  name: 'timetable:unit',
                  params: { ...route.params, unitTypeSlug: 'sala', unitId: room.id },
                }"
              >
                {{ room.fullName ?? room.name ?? room.short
                }}<template v-if="roomIndex + 1 !== rooms.length">, </template>
              </RouterLink>
            </dd>
          </div>
          <div class="my-2" v-if="students.length">
            <dt class="font-semibold">Uczniowie</dt>
            <dd>
              <RouterLink
                v-for="(student, studentIndex) in students"
                :key="studentIndex"
                :to="{
                  name: 'timetable:unit',
                  params: { ...route.params, unitTypeSlug: 'uczen', unitId: student.id },
                }"
              >
                {{ student.name ?? student.short
                }}<template v-if="studentIndex + 1 !== students.length">, </template>
              </RouterLink>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
