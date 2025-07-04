<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { getSchoolFullAddress } from '@/utils';
import { LucideTrash } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import type { SchoolEntity } from '@/db/entities/school.entity';

const props = defineProps<{ school: SchoolEntity }>();
const emit = defineEmits(['delete']);

function handleDelete(e: Event) {
  e.preventDefault();
  emit('delete');
}
</script>

<template>
  <li>
    <RouterLink
      :to="{ name: 'timetable', params: { schoolId: props.school.rspoId } }"
      class="flex justify-between px-5 py-3 border-t hover:bg-input/50 transition-all"
    >
      <div>
        <div class="font-semibold tracking-tight text-foreground text-[0.9em]">
          {{ props.school.name }}
        </div>
        <div class="text-muted-foreground font-medium text-[0.8em]">
          {{ getSchoolFullAddress(props.school) }}
        </div>
      </div>
      <div>
        <Button
          size="icon"
          variant="ghost"
          class="hover:text-destructive transition-colors"
          @click="handleDelete"
        >
          <LucideTrash />
        </Button>
      </div>
    </RouterLink>
  </li>
</template>
