<script setup lang="ts">
import { getSchoolFullAddress } from '@/utils';
import { Button } from '@/components/ui/button';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SchoolEntity } from '@/db/entities/school.entity';

const props = defineProps<{ school: SchoolEntity | null }>();
const emit = defineEmits(['close']);
</script>

<template>
  <Dialog :open="!!props.school" @update:open="emit('close')">
    <template v-if="props.school">
      <DialogOverlay class="z-[1000]" />
      <DialogContent class="z-[1000]">
        <DialogHeader>
          <DialogTitle>{{ props.school.name }}</DialogTitle>
          <DialogDescription>{{ getSchoolFullAddress(props.school) }}</DialogDescription>
        </DialogHeader>
        <dl class="text-sm">
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
        <DialogFooter>
          <Button class="flex-1" as-child>
            <RouterLink :to="{ name: 'timetable', params: { schoolId: props.school.rspoId } }">
              Otwórz
            </RouterLink>
          </Button>
          <Button class="flex-1" variant="ghost" @click="emit('close')"> Zamknij </Button>
        </DialogFooter>
      </DialogContent>
    </template>
  </Dialog>
</template>
