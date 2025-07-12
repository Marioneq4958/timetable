<script setup lang="ts">
import { getSchoolFullAddress } from '@/utils';
import { Button } from '@/components/ui/button';
import type { SchoolEntity } from '@/db/entities/school.entity';

const props = defineProps<{ school: SchoolEntity }>();
const emit = defineEmits(['close']);
</script>

<template>
  <section class="bg-background rounded-md p-5 shadow-sm mt-3 z-[1000]">
    <h1 class="font-semibold tracking-tight">{{ props.school.name }}</h1>
    <p class="text-muted-foreground text-sm">{{ getSchoolFullAddress(props.school) }}</p>
    <dl class="text-sm mt-3">
      <div class="my-2">
        <dt class="font-semibold">Numer RSPO</dt>
        <dd class="mt-1">
          <a
            :href="`https://rspo.gov.pl/institutions/${props.school.rspoId}`"
            class="underline"
          >
            {{ props.school.rspoId }}
          </a>
        </dd>
      </div>
      <div class="my-2">
        <dt class="font-semibold">Strona internetowa</dt>
        <dd class="mt-1">
          <a
            v-if="props.school.websiteUrl"
            :href="props.school.websiteUrl"
            class="underline"
          >
            {{ props.school.websiteUrl }}
          </a>
          <template v-else>Brak</template>
        </dd>
      </div>
      <div class="my-2" v-if="props.school.parentRspoId">
        <dt class="font-semibold">Jednostka nadrzędna</dt>
        <dd class="mt-1">
          <RouterLink
            :to="{ name: 'schools-map', params: { schoolId: props.school.parentRspoId } }"
            class="underline"
          >
            RSPO {{ props.school.parentRspoId }}
          </RouterLink>
        </dd>
      </div>
    </dl>
    <div class="flex gap-2 mt-3">
      <Button class="flex-1" as-child>
        <RouterLink :to="{ name: 'timetable', params: { schoolId: props.school.rspoId } }">
          Otwórz
        </RouterLink>
      </Button>
      <Button class="flex-1" variant="ghost" @click="emit('close')">Zamknij</Button>
    </div>
  </section>
</template>
