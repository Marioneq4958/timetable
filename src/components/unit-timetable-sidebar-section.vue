<script setup lang="ts">
const props = defineProps<{
  name: string;
  sectionId: string;
  icon: string;
  isActive: boolean;
  units: { name: string; id: string }[];
}>();
const emit = defineEmits(["section-click"]);
</script>

<template>
  <li class="mt-3">
    <button
      @click="emit('section-click')"
      class="flex text-left w-full gap-3 items-center text-gray-700 font-medium hover:text-gray-900 transition-all text-sm"
      :class="{ '!text-gray-900': isActive }"
    >
      <span
        class="p-2.5 rounded-md bg-gray-200 material-symbols-rounded text-xl leading-5"
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
      :style="{ height: isActive ? `${34.5 * props.units.length}px` : '0px' }"
    >
      <li
        v-for="(unit, index) in props.units"
        :key="index"
        class="px-3 py-1.5 cursor-pointer text-gray-700 transition-all hover:text-gray-900 rounded-md text-ellipsis whitespace-nowrap overflow-hidden text-[15px]"
      >
        {{ unit.name }}
      </li>
    </ul>
  </li>
</template>
