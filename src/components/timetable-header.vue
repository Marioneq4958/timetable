<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import type { School } from "@/types";

const props = defineProps<{
  title: string;
  school: School;
}>();
const { toggleDark } = useAppStore();
</script>

<template>
  <div class="flex w-full justify-end gap-3">
    <button
      class="rounded-md border dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 transition-all hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span class="material-symbols-rounded text-xl leading-5 p-2.5">
        star
      </span>
    </button>
    <button
      class="rounded-md border dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 transition-all hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span class="material-symbols-rounded text-xl leading-5 p-2.5">
        print
      </span>
    </button>
    <button
      class="rounded-md border dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 transition-all hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      @click="toggleDark()"
    >
      <span class="material-symbols-rounded text-xl leading-5 p-2.5">
        contrast
      </span>
    </button>
  </div>
  <div class="text-3xl font-bold text-gray-900 dark:text-white mt-4">
    {{ props.title }}
  </div>
  <div class="font-medium uppercase text-gray-700 dark:text-gray-200">
    {{ props.school.name }}, {{ props.school.address_zip_code }}
    {{ props.school.address_town }}
    <a
      class="font-semibold"
      target="_blank"
      :href="`https://rspo.gov.pl/institutions/${props.school.rspo_id}`"
      >[RSPO: {{ props.school.rspo_id }}]</a
    >
  </div>
</template>
