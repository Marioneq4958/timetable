<script setup lang="ts">
import { SchoolNotFoundError } from '@/api/errors';
import { useTimetableStore } from '@/stores/timetable.store';
import {
  LucideAlertCircle,
  LucideArrowLeft,
  LucideCalendarOff,
  LucideLoader2,
  LucideRotateCw,
} from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import TimetableTopBar from '@/components/TimetableTopBar.vue';
import { useMediaQuery } from '@vueuse/core';
import TimetableSidebar from '@/components/TimetableSidebar.vue';
import TimetableDrawer from '@/components/TimetableDrawer.vue';
import { toast } from 'vue-sonner';
import TimetableBackgroundSync from '@/components/TimetableBackgroundSync.vue';
import type { SchoolEntity } from '@/db/entities/school.entity';
import type { TimetableVersionEntity } from '@/db/entities/timetableVersion.entity';
import type { PreparedTimetableVersionData } from '@/timetable';

const props = defineProps<{
  schoolId: number;
  versionId?: string;
}>();

const timetableStore = useTimetableStore();
const router = useRouter();
const route = useRoute();

const error = ref<string | null>(null);

async function runSync({ forceSync }: { forceSync?: boolean }) {
  error.value = null;
  try {
    await timetableStore.sync({ schoolId: props.schoolId, versionId: props.versionId, forceSync });
  } catch (reason) {
    console.warn(`An error occurred during synchronization, reason: ${reason}`);
    if (reason instanceof SchoolNotFoundError) error.value = 'school-not-found';
    else error.value = 'unknown-error';
    if (timetableStore.preparedVersionData)
      toast.error('Wystąpił błąd podczas synchornizacji', {
        description: 'Spróbuj ponownie później',
        action: {
          label: 'Spróbuj ponownie',
          onClick: async () => {
            await runSync({ forceSync: true });
          },
        },
      });
  }
}

watch(
  () => [props.schoolId, props.versionId],
  async () => await runSync({}),
  { immediate: true },
);

watch(
  () => [timetableStore.school, timetableStore.currentVersion, timetableStore.preparedVersionData] as [
    SchoolEntity | null,
    TimetableVersionEntity | null,
    PreparedTimetableVersionData | null
  ],
  async ([school, currentVersion, preparedVersionData]: [
    SchoolEntity | null,
    TimetableVersionEntity | null,
    PreparedTimetableVersionData | null
  ]) => {
    if (
      !school ||
      !currentVersion ||
      !preparedVersionData
    )
      return;
    const [versionType, versionId] = currentVersion.id.split('/');
    if (route.name === 'timetable' || route.name === 'timetable:version') {
      await router.replace({
        name: 'timetable:unit',
        params: {
          schoolId: school.rspoId, versionId, versionType,
          unitTypeSlug: 'oddzial',
          unitId: [...preparedVersionData.common.classes.values()][0].id,
        },
      });
    } else {
      await router.replace({
        name: route.name,
        params: { ...route.params, schoolId: school.rspoId, versionId, versionType },
      });
    }
  },
  {
    immediate: true,
  },
);

const useDrawer = useMediaQuery('(width < 48rem)');
</script>

<template>
  <div
    v-if="
      timetableStore.school &&
      timetableStore.availableVersions &&
      timetableStore.currentVersion &&
      timetableStore.preparedVersionData &&
      props.versionId === timetableStore.currentVersion.id &&
      props.schoolId === timetableStore.school.rspoId
    "
    class="flex bg-accent/20 min-h-dvh"
  >
    <TimetableSidebar v-if="!useDrawer" />
    <div class="flex-1 mx-auto max-w-screen-xl w-full mb-[120px] md:mb-0">
      <TimetableDrawer v-if="useDrawer" />
      <TimetableTopBar />
      <RouterView />
    </div>
    <TimetableBackgroundSync v-if="timetableStore.isLoading" />
  </div>

  <div v-else class="w-screen min-h-dvh flex flex-col items-center justify-center p-10 text-center">
    <template v-if="error === 'school-not-found'">
      <LucideAlertCircle :size="96" />
      <p class="mt-5 text-xl font-semibold">
        Nie znaleziono szkoły o numerze <code class="font-mono">{{ props.schoolId }}</code>
      </p>
      <Button as-child size="lg" variant="outline">
        <RouterLink :to="{ name: 'home' }" class="mt-5">
          <LucideArrowLeft class="mr-2" />
          Wróć
        </RouterLink>
      </Button>
    </template>
    <template
      v-else-if="
        !timetableStore.isLoading &&
        !error &&
        timetableStore.school &&
        timetableStore.availableVersions?.length === 0
      "
    >
      <LucideCalendarOff :size="96" />
      <p class="mt-5 text-xl font-semibold">Nie znaleźliśmy żadnych planów tej szkoły :(</p>
      <!-- TODO: More information -->
      <p class="mt-2 text-sm text-muted-foreground">
        {{ timetableStore.school.name }}, {{ timetableStore.school.addressTown }}
        {{ timetableStore.school.addressZipCode }}
      </p>
      <Button as-child size="lg" variant="outline">
        <RouterLink :to="{ name: 'home' }" class="mt-5">
          <LucideArrowLeft class="mr-2" />
          Wróć
        </RouterLink>
      </Button>
    </template>
    <template v-else-if="!timetableStore.isLoading && (!timetableStore.currentVersion || error)">
      <LucideAlertCircle :size="96" />
      <p class="mt-5 text-xl font-semibold">
        Wystąpił nieoczekiwany błąd, spróbuj ponownie później
      </p>
      <div class="flex gap-3 mt-5">
        <Button size="lg" @click="runSync">
          <LucideRotateCw class="mr-2" />
          Spróbuj ponownie
        </Button>
        <Button as-child size="lg" variant="outline">
          <RouterLink :to="{ name: 'home' }">
            <LucideArrowLeft class="mr-2" />
            Wróć
          </RouterLink>
        </Button>
      </div>
    </template>
    <LucideLoader2
      v-else
      :size="30"
      class="animate-spin"
    />
  </div>
</template>
