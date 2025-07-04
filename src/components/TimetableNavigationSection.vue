<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { LucideChevronDown } from 'lucide-vue-next';
import { ref, type Component } from 'vue';

const props = defineProps<{ icon: Component; name: string; showUnitListDefault?: boolean }>();
const showUnitList = ref(props.showUnitListDefault ?? false);
const toggleUnitList = useToggle(showUnitList);
const unitListEl = ref<HTMLUListElement>();
</script>

<template>
  <li class="my-2">
    <button
      @click="toggleUnitList()"
      class="flex w-full items-center gap-4 font-medium cursor-pointer"
    >
      <div class="size-11 border bg-accent flex items-center justify-center rounded-lg">
        <component :is="props.icon" />
      </div>
      {{ props.name }}
      <div class="flex-1" />
      <LucideChevronDown
        :size="16"
        :class="{ 'rotate-180': showUnitList }"
        class="transition-all mx-2.5 size-4"
      />
    </button>
    <ul
      ref="unitListEl"
      class="list-disc transition-all overflow-y-hidden ml-12"
      :style="{ maxHeight: showUnitList ? `${unitListEl?.scrollHeight}px` : 0 }"
    >
      <slot />
    </ul>
  </li>
</template>
