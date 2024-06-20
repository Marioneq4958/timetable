<script setup lang="ts">
import TimetableHeader from "./timetable-header.vue";
import TimetableInfoBanner from "./timetable-info-banner.vue";
import { computed } from "vue";
import type {
  TimetableClass,
  TimetableRoom,
  TimetableStudent,
  TimetableTeacher,
  TimetableVersion,
} from "@/types";

const props = defineProps<{
  unit: {
    type: "o" | "n" | "s" | "u";
    data: TimetableClass | TimetableTeacher | TimetableRoom | TimetableStudent;
  };
  school: any;
  version: TimetableVersion;
}>();
const headerTitle = computed(() => {
  switch (props.unit.type) {
    case "o":
      return `Plan oddziału ${props.unit.data.fullName!}`;
    case "n":
      return `Plan nauczyciela ${props.unit.data.fullName!}`;
    case "s":
      return `Plan sali ${props.unit.data.fullName!}`;
    case "u":
      return `Plan ucznia ${props.unit.data.short}`;
    default:
      return "";
  }
});
</script>

<template>
  <timetable-header :title="headerTitle" :school="school" />
  <timetable-info-banner :version="version" />
</template>
