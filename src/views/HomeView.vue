<script setup lang="ts">
import HomeSchoolsList from '@/components/HomeSchoolsList.vue';
import SchoolRepository from '@/repositories/school.repository';
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import HomeFooter from '@/components/HomeFooter.vue';
import ThemeSwitchButton from '@/components/ThemeSwitchButton.vue';
import { useRouter } from "vue-router";
import { watchEffect } from "vue";

const recentSchools = useObservable(from(liveQuery(SchoolRepository.getRecentSchools)));
const router = useRouter();

watchEffect(() => {
  if (recentSchools.value?.length === 0) router.replace({ name: 'intro' });
})
</script>

<template>
  <div class="w-screen min-h-dvh flex flex-col items-center p-7">
    <div class="max-w-screen-xl w-full flex gap-3 justify-end">
      <ThemeSwitchButton />
    </div>
    <h1
      class="font-extrabold tracking-tight leading-[1.5] mt-7 text-5xl md:text-6xl text-foreground"
    >
      lekcje.one
    </h1>
    <p class="text-muted-foreground leading-normal text-sm md:text-base">
      Przeglądaj plany lekcji szkół w całej Polsce
    </p>
    <HomeSchoolsList :schools="recentSchools" v-if="recentSchools" />
    <HomeFooter class="mt-6" />
  </div>
</template>
