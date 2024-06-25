<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import type { School, TimetableUnit, TimetableVersion } from "@/types";
import { computed } from "vue";

const props = defineProps<{
  unit: TimetableUnit;
  version: TimetableVersion;
  school: School;
}>();
const appStore = useAppStore();
const headerTitle = computed(() => {
  switch (props.unit.type) {
    case "o":
      return `Plan oddziału ${(props.unit.data.fullName ??
        props.unit.data.short)!}`;
    case "n":
      return `Plan nauczyciela ${(props.unit.data.fullName ??
        props.unit.data.short)!}`;
    case "s":
      return `Plan sali ${(props.unit.data.fullName ??
        props.unit.data.short)!}`;
    case "u":
      return `Plan ucznia ${props.unit.data.short}`;
    default:
      return "";
  }
});
const isFavourite = computed(() =>
  appStore.favouriteUnits.includes(
    `${props.school.rspo_id}/${props.version.type}/${props.version.id}/${props.unit.type}/${props.unit.data.id}`
  )
);
</script>

<template>
  <div class="flex w-full justify-end gap-3">
    <button
      class="rounded-md border dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 transition-all hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span
        class="material-symbols-rounded text-xl leading-5 p-2.5"
        :style="{
          'font-variation-settings': isFavourite
            ? `'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24`
            : '',
        }"
        :class="{ 'text-gray-900 dark:text-gray-100': isFavourite }"
        @click="
          appStore.toggleFavouriteUnit(
            `${school.rspo_id}/${version.type}/${version.id}/${unit.type}/${unit.data.id}`
          )
        "
      >
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
      @click="appStore.toggleDark()"
    >
      <span class="material-symbols-rounded text-xl leading-5 p-2.5">
        contrast
      </span>
    </button>
  </div>
  <div class="text-3xl font-bold text-gray-900 dark:text-white mt-4">
    {{ headerTitle }}
  </div>
  <div class="font-medium uppercase text-gray-700 dark:text-gray-200">
    {{ school.name }}, {{ school.address_zip_code }}
    {{ school.address_town }}
    <a
      class="font-semibold"
      target="_blank"
      :href="`https://rspo.gov.pl/institutions/${school.rspo_id}`"
      >[RSPO: {{ school.rspo_id }}]</a
    >
  </div>
</template>
