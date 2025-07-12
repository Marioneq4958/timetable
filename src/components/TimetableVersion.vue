<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { LucideCheck, LucideChevronsUpDown } from 'lucide-vue-next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { notNullableComputed } from '@/utils';

const timetableStore = useTimetableStore();

const currentVersion = notNullableComputed(timetableStore.currentVersion);
const availableVersions = notNullableComputed(timetableStore.availableVersions);
</script>

<template>
  <div class="text-sm flex justify-between items-center gap-8 w-full">
    <span>
      Plan wygenerowano <strong> {{ currentVersion.generatedOn }} </strong>.
    </span>
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon">
                <LucideChevronsUpDown />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zmień wersję planu</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Zmień wersję planu </DialogTitle>
        </DialogHeader>
        <ul>
          <li v-for="version in availableVersions" :key="version.id">
            <RouterLink
              :to="`../../../${version.id}`"
              class="flex justify-between items-center px-3.5 py-2 rounded-md hover:bg-input/50 transition-all"
              :class="{ '!bg-primary text-primary-foreground': version.id === currentVersion.id }"
            >
              <div>
                <div class="font-medium">Wygenerowana {{ version.generatedOn }}</div>
                <div
                  class="text-sm text-muted-foreground"
                  :class="{ 'text-primary-foreground': version.id === currentVersion.id }"
                >
                  {{ version.data ? 'Pobrana' : 'Nie pobrana' }}
                </div>
              </div>
              <LucideCheck :size="20" v-if="version.id === currentVersion.id" />
            </RouterLink>
          </li>
        </ul>
        <DialogFooter>
          <DialogClose>
            <Button variant="ghost">Zamknij</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
