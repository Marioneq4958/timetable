<script setup lang="ts">
import { groupPlural, pluralRules } from '@/plural';
import { useTimetableStore } from '@/stores/timetable.store';
import type { TimetableLesson } from '@/timetable';
import { common, notNullableComputed } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{ lessons: TimetableLesson[] }>();

const timetableStore = useTimetableStore();

const preparedVersionData = notNullableComputed(() => timetableStore.preparedVersionData);

const groupsText = computed(() => groupPlural[pluralRules.select(props.lessons.length)]);
const commonSubject = computed(() => {
  const subjectId = common(props.lessons.map((lesson) => lesson.subjectId));
  if (!subjectId) return;
  return preparedVersionData.value.common.subjects.get(subjectId);
});
</script>

<template>
  <div
    class="border flex-1 rounded-md flex items-center justify-center flex-col bg-input/20 user-select-none cursor-pointer hover:bg-input/50 transition-all"
  >
    <div v-if="commonSubject" class="font-semibold text-sm">
      {{ commonSubject.name ?? commonSubject.short }}
    </div>
    <div class="text-xs">
      <span class="font-semibold">{{ props.lessons.length }}</span> {{ groupsText }}
    </div>
  </div>
</template>
