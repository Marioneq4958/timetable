<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { School } from "@/api/types";
import { getSchoolById } from "@/api/client";
import { getFullAddress } from "@/utils";

const props = defineProps<{ schoolId: number }>();

const school = ref<School | null>(null);
const loading = ref<boolean>(true);

onMounted(async () => {
  school.value = await getSchoolById(props.schoolId);
  loading.value = false;
});
</script>

<template>
  <header class="header" v-if="school">
    <div class="header__actions">
      <button class="header__actions-btn">
        <span class="material-symbols-rounded"> keyboard_backspace </span>
      </button>
      <span style="flex: 1" />
      <button class="header__actions-btn">
        <span class="material-symbols-rounded"> print </span>
      </button>
      <button class="header__actions-btn">
        <span class="material-symbols-rounded"> contrast </span>
      </button>
    </div>
    <div class="header__title">{{ school.name }}</div>
    <div class="subtitle">{{ getFullAddress(school) }}</div>
  </header>
  <p v-if="loading">Ładowanie danych...</p>
  <p v-else>{{ school }}</p>
</template>
