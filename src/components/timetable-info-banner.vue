<script setup lang="ts">
import type { TimetableVersion } from "@/types";

defineProps<{ version: TimetableVersion }>();
</script>

<template>
  <div
    class="mt-5 p-3 bg-white dark:bg-gray-900 rounded-md border dark:border-gray-700 flex gap-3 items-center text-sm dark:text-white"
  >
    <div
      class="p-2.5 rounded-md bg-gray-200 dark:bg-gray-800 material-symbols-rounded text-xl leading-5"
    >
      info
    </div>
    <div class="flex-1">
      Plan
      <template v-if="version.generatedOn">
        wygenerowany <span class="font-medium">{{ version.generatedOn }}</span
        >,
      </template>
      obowiązuje od <span class="font-medium">brakuje danych z api</span>
    </div>
    <button
      class="rounded-md bg-gray-200 dark:bg-gray-800 font-medium px-3.5 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
    >
      Więcej informacji
    </button>
  </div>
</template>
