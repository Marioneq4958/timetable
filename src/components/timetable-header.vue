<script setup lang="ts">
import type { School } from "@/api/types";

const props = defineProps<{
  title: string;
  school: School;
}>();
</script>

<template>
  <div class="flex w-full justify-end gap-3">
    <button
      class="rounded-md border text-gray-700 bg-white transition-all hover:text-gray-900 hover:bg-gray-100"
    >
      <span class="material-symbols-rounded text-xl leading-5 p-2.5">
        star
      </span>
    </button>
    <button
      class="rounded-md border text-gray-700 bg-white transition-all hover:text-gray-900 hover:bg-gray-100"
    >
      <span class="material-symbols-rounded text-xl leading-5 p-2.5">
        print
      </span>
    </button>
    <button
      class="rounded-md border text-gray-700 bg-white transition-all hover:text-gray-900 hover:bg-gray-100"
    >
      <span class="material-symbols-rounded text-xl leading-5 p-2.5">
        contrast
      </span>
    </button>
  </div>
  <div class="text-3xl font-bold text-gray-900 mt-4">
    {{ props.title }}
  </div>
  <div class="font-medium uppercase text-gray-700">
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
