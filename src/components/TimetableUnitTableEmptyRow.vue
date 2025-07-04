<script setup lang="ts">
const props = defineProps<{ daysLength: number }>();
</script>

<template>
  <div class="contents">
    <div
      v-for="index in props.daysLength + 1"
      :key="index"
      :class="{ 'sticky': index === 1, 'left-0': index === 1 }"
      class="border-r bg-background"
    />
  </div>
</template>
