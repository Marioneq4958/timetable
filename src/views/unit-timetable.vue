<script setup lang="ts">
import { onMounted, ref } from "vue";
import type {
  School,
  TimetableClass,
  TimetableRoom,
  TimetableTeacher,
  TimetableVersionData,
} from "@/api/types";
import { getOptivumVersion, getSchoolById } from "@/api/client";
import { getCommon } from "@/utils";
import UnitTimetableSidebar from "@/components/unit-timetable-sidebar.vue";

const props = defineProps<{
  schoolId: number;
  generatedOn: string;
  discriminant: number;
  unitTypeName: "oddzialy" | "nauczyciele" | "sale" | "uczniowie";
  unitId: string;
}>();
const unitType = props.unitTypeName[0];
const school = ref<School | null>(null);
const version = ref<TimetableVersionData | null>(null);
const loading = ref<boolean>(true);
const unit = ref<TimetableClass | TimetableTeacher | TimetableRoom | null>(
  null
);

const common = ref<ReturnType<typeof getCommon> | null>(null);

function getUnit(common: ReturnType<typeof getCommon>) {
  if (unitType === 'o') return common.classes.get(props.unitId);
  if (unitType === 'n') return common.teachers.get(props.unitId);
  if (unitType === 's') return common.rooms.get(props.unitId);
  return common.students.get(props.unitId);
}

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
    unit.value = getUnit(common.value);
    // TODO: Błędny id unit
  }
  loading.value = false;
});
</script>

<template>
  <unit-timetable-sidebar v-if="common" :common="common" />
</template>
