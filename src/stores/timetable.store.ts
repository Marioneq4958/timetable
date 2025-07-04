import type { SchoolEntity } from '@/db/entities/school.entity';
import type { TimetableVersionEntity } from '@/db/entities/timetableVersion.entity';
import SchoolRepository from '@/repositories/school.repository';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import TimetableVersionRepository from '@/repositories/timetableVersion.repository';
import {
  prepareTimetableVersionData,
  type PreparedTimetableVersionData,
  type TimetableVersionData,
} from '@/timetable';
import { useToggle } from '@vueuse/core';

const MINUTES_TO_SYNC = 5;

const shouldSync = (lastSyncAt: Date | null) =>
  !lastSyncAt || (Number(new Date()) - Number(lastSyncAt)) / 1000 / 60 >= MINUTES_TO_SYNC;

export const useTimetableStore = defineStore('timetable', () => {
  const isLoading = ref(false);

  const showMenu = ref(false);
  const toggleMenu = useToggle(showMenu);

  const school = ref<SchoolEntity | null>(null);
  const avaliableVersions = ref<TimetableVersionEntity[] | null>(null);
  const currentVersion = ref<TimetableVersionEntity | null>(null);
  const preparedVersionData = ref<PreparedTimetableVersionData | null>(null);

  // TODO: Sync conflicts
  async function sync({ schoolId, versionId, forceSync }: { schoolId: number, versionId?: string, forceSync?: boolean }) {
    isLoading.value = true;

    try {
      if (school.value?.rspoId !== schoolId) {
        school.value = null;
        currentVersion.value = null;
        avaliableVersions.value = null;
        preparedVersionData.value = null;

        school.value = await SchoolRepository.getSchoolById(schoolId);
        await SchoolRepository.openSchool(schoolId);

        avaliableVersions.value =
          await TimetableVersionRepository.getAvaliableTimetableVersionsBySchool(
            school.value.rspoId,
          );
      }

      if (currentVersion.value?.id !== versionId || !currentVersion.value) {
        currentVersion.value = null;
        preparedVersionData.value = null;

        if (avaliableVersions.value?.length) {
          const versionCandidate =
            avaliableVersions.value.find((version) => version.id === versionId) ??
            avaliableVersions.value[0];

          if (!versionCandidate.data)
            versionCandidate.data =
              await TimetableVersionRepository.downloadTimetableVersionDataById(
                versionCandidate.id,
              );

          currentVersion.value = versionCandidate;
          preparedVersionData.value = prepareTimetableVersionData(
            versionCandidate.data! as unknown as TimetableVersionData,
          );
        }
      }

      if (shouldSync(school.value.lastSyncAt) || forceSync) {
        school.value = await SchoolRepository.syncSchoolById(school.value.rspoId);
        avaliableVersions.value =
          await TimetableVersionRepository.getAvaliableTimetableVersionsBySchool(
            school.value.rspoId,
          );
      }
    } catch (reason) {
      throw reason;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    sync,
    school,
    avaliableVersions,
    currentVersion,
    preparedVersionData,
    showMenu,
    toggleMenu,
  };
});
