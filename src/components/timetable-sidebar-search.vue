<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { getCommon } from "@/utils";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps<{ common: ReturnType<typeof getCommon> }>();
const query = ref<string | null>(null);
const result = computed(() => ({
  classes: query.value
    ? [...props.common.classes.values()].filter((class_) =>
        (class_.fullName ?? class_.short)!
          .toLowerCase()
          .includes(query.value!.toLowerCase())
      )
    : [],
  teachers: query.value
    ? [...props.common.teachers.values()].filter((teacher) =>
        (teacher.fullName ?? teacher.short)!
          .toLowerCase()
          .includes(query.value!.toLowerCase())
      )
    : [],
  rooms: query.value
    ? [...props.common.rooms.values()].filter((room) =>
        (room.fullName ?? room.short)!
          .toLowerCase()
          .includes(query.value!.toLowerCase())
      )
    : [],
  students: query.value
    ? [...props.common.students.values()].filter((student) =>
        student.short.toLowerCase().includes(query.value!.toLowerCase())
      )
    : [],
}));
const isActive = ref(false);

function handleClickOutside() {
  isActive.value = false;
}
function handleInputFocus() {
  isActive.value = true;
}
</script>

<template>
  <div class="relative" v-on-click-outside="handleClickOutside">
    <div class="relative">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center ml-3"
      >
        <span
          class="material-symbols-rounded text-lg text-gray-700 dark:text-gray-300 select-none"
          >search</span
        >
      </div>
      <input
        class="block w-full rounded-md py-2 pl-10 pr-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-300 dark:text-gray-100 text-sm leading-6 outline-none"
        type="text"
        placeholder="Szukaj"
        v-model="query"
        @focus="handleInputFocus"
      />
    </div>
    <div
      class="absolute shadow-lg top-12 z-50 w-full max-h-96 p-1.5 bg-white border border-gray-200 rounded-md overflow-hidden overflow-y-auto dark:bg-gray-900 dark:border-gray-700"
      :class="{ hidden: !query || !isActive }"
    >
      <template v-if="result.classes.length">
        <div class="text-sm font-medium text-gray-500 mx-3 mt-2">Oddziały</div>
        <ul class="mt-2">
          <li v-for="(class_, index) in result.classes" :key="index">
            <router-link
              :to="`../oddzialy/${encodeURIComponent(class_.id)}`"
              class="block px-3 py-1.5 text-gray-700 hover:text-gray-900 rounded-md transition-all text-ellipsis whitespace-nowrap overflow-hidden text-[15px] dark:text-gray-300 dark:hover:text-gray-100"
              activeClass="bg-gray-100 dark:bg-gray-800"
              >{{ class_.fullName ?? class_.short }}
            </router-link>
          </li>
        </ul>
      </template>
      <template v-if="result.teachers.length">
        <div class="text-sm font-medium text-gray-500 mx-3 mt-2">
          Nauczyciele
        </div>
        <ul class="mt-2">
          <li v-for="(teacher, index) in result.teachers" :key="index">
            <router-link
              :to="`../nauczyciele/${encodeURIComponent(teacher.id)}`"
              class="block px-3 py-1.5 text-gray-700 hover:text-gray-900 rounded-md transition-all text-ellipsis whitespace-nowrap overflow-hidden text-[15px] dark:text-gray-300 dark:hover:text-gray-100"
              activeClass="bg-gray-100 dark:bg-gray-800"
              >{{ teacher.fullName ?? teacher.short }}
            </router-link>
          </li>
        </ul>
      </template>
      <template v-if="result.rooms.length">
        <div class="text-sm font-medium text-gray-500 mx-3 mt-2">Sale</div>
        <ul class="mt-2">
          <li v-for="(room, index) in result.rooms" :key="index">
            <router-link
              :to="`../sale/${encodeURIComponent(room.id)}`"
              class="block px-3 py-1.5 text-gray-700 hover:text-gray-900 rounded-md transition-all text-ellipsis whitespace-nowrap overflow-hidden text-[15px] dark:text-gray-300 dark:hover:text-gray-100"
              activeClass="bg-gray-100 dark:bg-gray-800"
              >{{ room.fullName ?? room.short }}
            </router-link>
          </li>
        </ul>
      </template>
      <template v-if="result.students.length">
        <div class="text-sm font-medium text-gray-500 mx-3 mt-2">Uczniowie</div>
        <ul class="mt-2">
          <li v-for="(student, index) in result.students" :key="index">
            <router-link
              :to="`../uczniowie/${encodeURIComponent(student.id)}`"
              class="block px-3 py-1.5 text-gray-700 hover:text-gray-900 rounded-md transition-all text-ellipsis whitespace-nowrap overflow-hidden text-[15px] dark:text-gray-300 dark:hover:text-gray-100"
              activeClass="bg-gray-100  dark:bg-gray-800"
              >{{ student.short }}
            </router-link>
          </li>
        </ul>
      </template>
      <div
        v-if="
          !result.classes.length &&
          !result.teachers.length &&
          !result.rooms.length &&
          !result.students.length
        "
        class="text-sm text-gray-700 text-center m-1 dark:text-gray-300"
      >
        Nie znaleziono
      </div>
    </div>
  </div>
</template>
