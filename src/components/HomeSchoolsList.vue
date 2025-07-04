<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { LucidePlus } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import type { SchoolEntity } from '@/db/entities/school.entity';
import HomeSchoolsListItem from '@/components/HomeSchoolsListItem.vue';

import SchoolRepository from '@/repositories/school.repository';
import TimetableVersionRepository from '@/repositories/timetableVersion.repository';

async function deleteSchool(id: number) {
  await SchoolRepository.deleteSavedSchoolById(id);
  await TimetableVersionRepository.deleteSavedTimetableVersionsBySchool(id);
}

const props = defineProps<{ schools: SchoolEntity[] }>();
</script>

<template>
  <section class="mt-6 rounded-md border w-full max-w-screen-sm overflow-hidden">
    <div class="p-5 flex justify-between items-center bg-accent">
      <h2 class="font-semibold tracking-tight text-lg">Twoje szkoły</h2>
      <Button as-child>
        <RouterLink to="/mapa-szkol"><LucidePlus />Dodaj</RouterLink>
      </Button>
    </div>
    <ul>
      <HomeSchoolsListItem
        v-for="school in props.schools"
        :key="school.rspoId"
        :school="school"
        @delete="deleteSchool(school.rspoId)"
      />
    </ul>
  </section>
</template>
