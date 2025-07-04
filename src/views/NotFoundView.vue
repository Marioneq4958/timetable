<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { LucideArrowLeft } from 'lucide-vue-next';
</script>

<template>
  <div class="w-screen min-h-dvh flex flex-col items-center justify-center">
    <div class="font-mono text-8xl">404</div>
    <p class="my-4 text-lg">Nie odnaleziono strony.</p>
    <Button as-child variant="outline" size="lg">
      <RouterLink to="/"><LucideArrowLeft /> Wróć na stronę główną</RouterLink>
    </Button>
  </div>
</template>
