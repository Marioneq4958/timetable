<script setup lang="ts">
import UnitTimetableSidebarSection from "./unit-timetable-sidebar-section.vue";
import { getCommon } from "@/utils";
import { ref } from "vue";

const props = defineProps<{ common: ReturnType<typeof getCommon> }>();

const activeSection = ref<string | null>(null);
function handleSectionClick(sectionName: string) {
  if (activeSection.value === sectionName) {
    activeSection.value = null;
  } else {
    activeSection.value = sectionName;
  }
}
</script>

<template>
  <div
    class="h-screen bg-white w-80 flex flex-col border-r border-gray-200 overflow-y-auto sticky top-0 left-0"
  >
    <div class="px-5 pt-4 pb-2">
      <div class="relative">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center ml-3"
        >
          <span class="material-symbols-rounded text-lg text-gray-700"
            >search</span
          >
        </div>
        <input
          class="block w-full rounded-md py-2 pl-10 pr-2.5 bg-gray-200 text-gray-900 placeholder:text-gray-500 text-sm leading-6 outline-none"
          type="text"
          placeholder="Szukaj"
        />
      </div>
    </div>
    <ul class="list-none flex-1 px-5 overflow-y-scroll">
      <unit-timetable-sidebar-section
        name="Oddziały"
        section-id="classes"
        icon="school"
        :isActive="activeSection === 'classes'"
        :units="[...props.common.classes.values()].map(unit => ({ id: unit.id, name: unit.fullName! }))"
        @section-click="handleSectionClick('classes')"
      />
      <unit-timetable-sidebar-section
        name="Uczniowie"
        section-id="students"
        icon="groups"
        v-if="[...props.common.students.values()].length"
        :isActive="activeSection === 'students'"
        :units="[...props.common.students.values()].map(unit => ({ id: unit.id, name: (unit.name || unit.short)! }))"
        @section-click="handleSectionClick('students')"
      />
      <unit-timetable-sidebar-section
        name="Nauczyciele"
        section-id="teachers"
        icon="groups"
        :isActive="activeSection === 'teachers'"
        :units="[...props.common.teachers.values()].map(unit => ({ id: unit.id, name: unit.fullName! }))"
        @section-click="handleSectionClick('teachers')"
      />
      <unit-timetable-sidebar-section
        name="Sale"
        section-id="rooms"
        icon="meeting_room"
        :isActive="activeSection === 'rooms'"
        :units="[...props.common.rooms.values()].map(unit => ({ id: unit.id, name: unit.fullName! }))"
        @section-click="handleSectionClick('rooms')"
      />
    </ul>
    <div class="px-5 py-4">
      <button
        class="text-left flex items-center text-sm font-medium gap-4 text-gray-700 hover:text-gray-900 transition-all"
      >
        <span class="material-symbols-rounded text-xl">keyboard_backspace</span>
        Wyjdź
      </button>
    </div>
  </div>
</template>
