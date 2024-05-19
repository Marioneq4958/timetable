<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { School, TimetableVersionData } from "@/api/types";
import { getOptivumVersion, getSchoolById } from "@/api/client";

const props = defineProps<{
  schoolId: number;
  generatedOn: string;
  discriminant: number;
  unitTypeName: "oddzialy" | "nauczyciele" | "sale";
}>();
const unitType = props.unitTypeName[0];
const school = ref<School | null>(null);
const version = ref<TimetableVersionData | null>(null);
const loading = ref<boolean>(true);

onMounted(async () => {
  //TODO: Obsługa błędów
  school.value = await getSchoolById(props.schoolId);
  if (school.value.optivum_versions.length) {
    version.value = await getOptivumVersion(
      props.schoolId,
      props.generatedOn,
      props.discriminant
    );
  }
  loading.value = false;
});
</script>

<template>
  <div v-if="school">Dane szkoły: {{ school }}</div>
  <div v-if="version">Dane wersji: {{ version }}</div>
  <div v-if="loading">Ładowanie...</div>
</template>
