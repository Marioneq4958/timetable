<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { useMainStore } from '@/stores/main.store';
import { LucideMoon, LucideSun } from 'lucide-vue-next';

const mainStore = useMainStore();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline" size="icon" @click="mainStore.toggleDark()">
          <LucideMoon v-if="mainStore.dark" />
          <LucideSun v-else />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Zmień motyw</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
