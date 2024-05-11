<script setup lang="ts">
defineProps<{ schoolId: number }>();
</script>
<template>
  <h1>Hello world!</h1>
  <h5>Your school id: {{ schoolId }}</h5>
</template>
