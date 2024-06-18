<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { School, TimetableVersionData } from "@/api/types";
import { getOptivumVersion, getSchoolById } from "@/api/client";
import { getCommon } from "@/utils";
import TimetableSidebar from "@/components/timetable-sidebar.vue";
import TimetableHeader from "@/components/timetable-header.vue";
import TimetableInfoBanner from "@/components/timetable-info-banner.vue";

const props = defineProps<{
  schoolId: number;
  generatedOn: string;
  discriminant: number;
  unitTypeName: "oddzialy" | "nauczyciele" | "sale" | "uczniowie";
  unitId: string;
}>();
const unitType = computed(() => props.unitTypeName[0]);
const school = ref<School | null>(null);
const version = ref<TimetableVersionData | null>(null);
const loading = ref<boolean>(true);

const common = ref<ReturnType<typeof getCommon> | null>(null);

const unit = computed(() => {
  if (unitType.value === "o") return common.value!.classes.get(props.unitId);
  if (unitType.value === "n") return common.value!.teachers.get(props.unitId);
  if (unitType.value === "s") return common.value!.rooms.get(props.unitId);
  return common.value!.students.get(props.unitId);
});

onMounted(async () => {
  //TODO: Obsługa błędów
  school.value = await getSchoolById(props.schoolId);
  if (school.value.optivum_versions.length) {
    version.value = await getOptivumVersion(
      props.schoolId,
      props.generatedOn,
      props.discriminant
    );
    common.value = getCommon(version.value);
    // TODO: Błędny id unit
  }
  loading.value = false;
});

const headerTitle = computed(() => {
  switch (unitType.value) {
    case "o":
      return `Plan oddziału ${unit.value!.fullName!}`;
    case "n":
      return `Plan nauczyciela ${unit.value!.fullName!}`;
    case "s":
      return `Plan sali ${unit.value!.fullName!}`;
    case "u":
      return `Plan ucznia ${unit.value!.name}`;
    default:
      return '';
  }
});
</script>

<template>
  <timetable-sidebar v-if="common" :common="common" />
  <div class="p-7 w-full">
    <template v-if="school && version">
      <timetable-header :title="headerTitle" :school="school" />
      <timetable-info-banner />
    </template>
  </div>
</template>
