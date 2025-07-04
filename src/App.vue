<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useMainStore } from './stores/main.store';
import { Toaster } from '@/components/ui/sonner';

useMainStore();
</script>

<template>
  <Toaster rich-colors />

  <RouterView />
</template>
