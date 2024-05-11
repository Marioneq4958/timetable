<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { School } from "@/api/types";
import { getSchoolById } from "@/api/client";

const props = defineProps<{ schoolId: number }>();

const school = ref<School | null>(null);
const loading = ref<boolean>(true);

onMounted(async () => {
  school.value = await getSchoolById(props.schoolId);
  loading.value = false;
})
</script>

<template>
  <h1>Hello world!</h1>
  <h5>Your school id: {{ schoolId }}</h5>
  <p v-if="loading">Ładowanie danych...</p>
  <p v-else>{{ school }}</p>
</template>
