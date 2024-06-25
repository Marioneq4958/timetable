<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-900 flex min-h-screen selection:text-white selection:bg-gray-900 dark:selection:text-gray-900 dark:selection:bg-white"
  >
    <router-view />
  </div>
</template>
