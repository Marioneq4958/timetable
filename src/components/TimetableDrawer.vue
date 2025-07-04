<script setup lang="ts">
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import TimetableNavigation from '@/components/TimetableNavigation.vue';
import TimetableVersion from '@/components/TimetableVersion.vue';
import { useTimetableStore } from '@/stores/timetable.store';

const timetableStore = useTimetableStore();
</script>

<template>
  <!-- I know this component is buggy, but I don't have any good alternatives -->
  <Drawer v-model:open="timetableStore.showMenu">
    <DrawerContent>
      <div class="flex flex-col h-[710px]">
        <TimetableNavigation data-vaul-no-drag class="overflow-y-scroll px-5" />
        <div class="flex-1" />
        <TimetableVersion class="px-5 py-3" />
      </div>
    </DrawerContent>
  </Drawer>
</template>
