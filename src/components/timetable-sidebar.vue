<script setup lang="ts">
import SidebarSection from "./timetable-sidebar-section.vue";
import SidebarSearch from "./timetable-sidebar-search.vue";
import { useAppStore } from "@/stores/app";
import { getCommon } from "@/utils";
import { computed, ref } from "vue";
import type { School, TimetableVersion } from "@/types";

const appStore = useAppStore();
const props = defineProps<{
  common: ReturnType<typeof getCommon>;
  school: School;
  version: TimetableVersion;
}>();
const activeSection = ref<string | null>(null);

function handleSectionClick(sectionName: string) {
  if (activeSection.value === sectionName) {
    activeSection.value = null;
  } else {
    activeSection.value = sectionName;
  }
}

const favourite = computed(() => [
  ...[...props.common.classes.values()]
    .filter((unit) =>
      appStore.favouriteUnits.includes(
        `${props.school.rspo_id}/${props.version.type}/${props.version.id}/o/${unit.id}`
      )
    )
    .map((unit) => ({
      id: unit.id,
      name: (unit.fullName ?? unit.short)!,
      typePath: "oddzialy",
    })),
  ...[...props.common.teachers.values()]
    .filter((unit) =>
      appStore.favouriteUnits.includes(
        `${props.school.rspo_id}/${props.version.type}/${props.version.id}/n/${unit.id}`
      )
    )
    .map((unit) => ({
      id: unit.id,
      name: (unit.fullName ?? unit.short)!,
      typePath: "nauczyciele",
    })),
  ...[...props.common.rooms.values()]
    .filter((unit) =>
      appStore.favouriteUnits.includes(
        `${props.school.rspo_id}/${props.version.type}/${props.version.id}/s/${unit.id}`
      )
    )
    .map((unit) => ({
      id: unit.id,
      name: (unit.fullName ?? unit.short)!,
      typePath: "sale",
    })),
  ...[...props.common.students.values()]
    .filter((unit) =>
      appStore.favouriteUnits.includes(
        `${props.school.rspo_id}/${props.version.type}/${props.version.id}/u/${unit.id}`
      )
    )
    .map((unit) => ({
      id: unit.id,
      name: (unit.name ?? unit.short)!,
      typePath: "uczniowie",
    })),
]);
</script>

<template>
  <div
    class="h-screen bg-white dark:bg-gray-900 w-80 flex flex-col border-r dark:border-gray-700 border-gray-200 overflow-y-auto sticky top-0 left-0"
  >
    <div class="px-5 pt-4 pb-2">
      <sidebar-search :common="common" />
    </div>
    <ul class="list-none flex-1 px-5 overflow-y-scroll">
      <sidebar-section
        name="Ulubione"
        section-id="favourite"
        icon="star"
        :isActive="activeSection === 'favourite'"
        :units="favourite"
        @section-click="handleSectionClick('favourite')"
        v-if="favourite.length"
      />
      <sidebar-section
        name="Oddziały"
        section-id="classes"
        icon="school"
        :isActive="activeSection === 'classes'"
        :units="[...props.common.classes.values()].map(unit => ({ id: unit.id, name: (unit.fullName ?? unit.short)!, typePath: 'oddzialy'}))"
        @section-click="handleSectionClick('classes')"
      />
      <sidebar-section
        name="Uczniowie"
        section-id="students"
        icon="groups"
        v-if="[...props.common.students.values()].length"
        :isActive="activeSection === 'students'"
        :units="[...props.common.students.values()].map(unit => ({ id: unit.id, name: (unit.name || unit.short)!, typePath: 'uczniowie' }))"
        @section-click="handleSectionClick('students')"
      />
      <sidebar-section
        name="Nauczyciele"
        section-id="teachers"
        icon="groups"
        :isActive="activeSection === 'teachers'"
        :units="[...props.common.teachers.values()].map(unit => ({ id: unit.id, name: (unit.fullName ?? unit.short)!, typePath: 'nauczyciele' }))"
        @section-click="handleSectionClick('teachers')"
      />
      <sidebar-section
        name="Sale"
        section-id="rooms"
        icon="meeting_room"
        :isActive="activeSection === 'rooms'"
        :units="[...props.common.rooms.values()].map(unit => ({ id: unit.id, name: (unit.fullName ?? unit.short)!, typePath: 'sale' }))"
        @section-click="handleSectionClick('rooms')"
      />
    </ul>
    <div class="px-5 py-4">
      <button
        class="text-left flex items-center text-sm font-medium gap-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
      >
        <span class="material-symbols-rounded text-xl">keyboard_backspace</span>
        Wyjdź
      </button>
    </div>
  </div>
</template>
