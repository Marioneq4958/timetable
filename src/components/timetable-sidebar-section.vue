<script setup lang="ts">
import { RouterLink } from "vue-router";

const props = defineProps<{
  name: string;
  sectionId: string;
  icon: string;
  isActive: boolean;
  units: { name: string; id: string; typePath: string }[];
}>();
const emit = defineEmits(["section-click"]);
</script>

<template>
  <li class="mt-3">
    <button
      @click="emit('section-click')"
      class="flex text-left w-full gap-3 items-center text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-all text-sm"
      :class="{ '!text-gray-900': isActive, 'dark:!text-gray-100': isActive }"
    >
      <span
        class="p-2.5 rounded-md bg-gray-100 dark:bg-gray-800 material-symbols-rounded text-xl leading-5"
      >
        {{ props.icon }}
      </span>
      <div class="flex-1">{{ props.name }}</div>
      <div
        class="material-symbols-rounded text-xl transition-all"
        :class="{ 'rotate-180': props.isActive }"
      >
        keyboard_arrow_down
      </div>
    </button>
    <ul
      class="ml-10 mr-2 box-border overflow-hidden transition-all"
      :style="{ height: isActive ? `${32 * props.units.length}px` : '0px' }"
    >
      <li v-for="(unit, index) in props.units" :key="index">
        <router-link
          class="px-3 py-1.5 block cursor-pointer text-gray-700 dark:text-gray-300 transition-all hover:text-gray-900 dark:hover:text-gray-100 rounded-md text-ellipsis whitespace-nowrap overflow-hidden text-sm"
          activeClass="bg-gray-100 !text-gray-900 dark:bg-gray-800 dark:!text-gray-100"
          :to="`../${unit.typePath}/${encodeURIComponent(unit.id)}`"
        >
          {{ unit.name }}
        </router-link>
      </li>
    </ul>
  </li>
</template>
