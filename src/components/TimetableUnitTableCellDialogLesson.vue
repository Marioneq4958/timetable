<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import type { TimetableLesson } from '@/timetable';
import { getEntitiesFromMap, getUnitTitle, notNullableComputed } from '@/utils';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  lesson: TimetableLesson;
}>();

const timetableStore = useTimetableStore();

const preparedVersionData = notNullableComputed(() => timetableStore.preparedVersionData);

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
              <template v-for="(class_, classIndex) in classes" :key="classIndex">
                <RouterLink
                  :to="{
                    name: 'timetable:unit',
                    params: { ...route.params, unitTypeSlug: 'oddzial', unitId: class_.id },
                  }"
                  class="hover:underline"
                  >{{ getUnitTitle(class_)
                  }}<template v-if="class_.groups.length">
                    ({{ class_.groups.map((group) => group.short).join(', ') }})</template
                  ></RouterLink
                ><template v-if="classIndex + 1 !== classes.length">, </template>
              </template>
            </dd>
          </div>
          <div class="my-2" v-if="teachers.length">
            <dt class="font-semibold">Nauczyciele</dt>
            <dd>
              <template v-for="(teacher, teacherIndex) in teachers" :key="teacherIndex">
                <RouterLink
                  :to="{
                    name: 'timetable:unit',
                    params: { ...route.params, unitTypeSlug: 'nauczyciel', unitId: teacher?.id },
                  }"
                  class="hover:underline"
                  >{{ getUnitTitle(teacher) }}</RouterLink
                ><template v-if="teacherIndex + 1 !== teachers.length">, </template>
              </template>
            </dd>
          </div>
          <div class="my-2" v-if="rooms.length">
            <dt class="font-semibold">Sale</dt>
            <dd>
              <template v-for="(room, roomIndex) in rooms" :key="roomIndex">
                <RouterLink
                  :to="{
                    name: 'timetable:unit',
                    params: { ...route.params, unitTypeSlug: 'sala', unitId: room?.id },
                  }"
                  class="hover:underline"
                  >{{ getUnitTitle(room) }}</RouterLink
                ><template v-if="roomIndex + 1 !== rooms.length">, </template>
              </template>
            </dd>
          </div>
          <div class="my-2" v-if="students.length">
            <dt class="font-semibold">Uczniowie</dt>
            <dd>
              <template v-for="(student, studentIndex) in students" :key="studentIndex">
                <RouterLink
                  :to="{
                    name: 'timetable:unit',
                    params: { ...route.params, unitTypeSlug: 'uczen', unitId: student.id },
                  }"
                  class="hover:underline"
                  >{{ student.name ?? student.short }}</RouterLink
                ><template v-if="studentIndex + 1 !== students.length">, </template>
              </template>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
