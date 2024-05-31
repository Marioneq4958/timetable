<script setup lang="ts">
import { onMounted, ref } from "vue";
import type {
  School,
  TimetableBuilding,
  TimetableClass,
  TimetableCommonGroup,
  TimetableDay,
  TimetableInterclassGroup,
  TimetablePeriod,
  TimetableRoom,
  TimetableStudent,
  TimetableSubject,
  TimetableTeacher,
  TimetableTimeSlot,
  TimetableVersionData,
  TimetableWeek,
} from "@/api/types";
import { getOptivumVersion, getSchoolById } from "@/api/client";

const props = defineProps<{
  schoolId: number;
  generatedOn: string;
  discriminant: number;
  unitTypeName: "oddzialy" | "nauczyciele" | "sale" | "uczniowie";
  unitId: string;
}>();
const unitType = props.unitTypeName[0];
const school = ref<School | null>(null);
const version = ref<TimetableVersionData | null>(null);
const loading = ref<boolean>(true);
const unit = ref<TimetableClass | TimetableTeacher | TimetableRoom | null>(
  null
);

const common = ref<ReturnType<typeof getCommon> | null>(null);

function getCommon(version: TimetableVersionData) {
  const timeSlots = new Map<string, TimetableTimeSlot>();
  version.common.timeSlots.forEach((timeSlot) => {
    timeSlots.set(timeSlot.id, timeSlot);
  });
  const days = new Map<string, TimetableDay>();
  version.common.days.forEach((day) => {
    days.set(day.id, day);
  });
  const weeks = new Map<string, TimetableWeek>();
  version.common.weeks.forEach((week) => {
    weeks.set(week.id, week);
  });
  const periods = new Map<string, TimetablePeriod>();
  version.common.periods.forEach((period) => {
    periods.set(period.id, period);
  });
  const buildings = new Map<string, TimetableBuilding>();
  version.common.buildings.forEach((building) => {
    buildings.set(building.id, building);
  });
  const rooms = new Map<string, TimetableRoom>();
  version.common.rooms.forEach((room) => {
    rooms.set(room.id, room);
  });
  const classes = new Map<string, TimetableClass>();
  version.common.classes.forEach((class_) => {
    classes.set(class_.id, class_);
  });
  const subjects = new Map<string, TimetableSubject>();
  version.common.subjects.forEach((subject) => {
    subjects.set(subject.id, subject);
  });
  const teachers = new Map<string, TimetableTeacher>();
  version.common.teachers.forEach((teacher) => {
    teachers.set(teacher.id, teacher);
  });
  const commonGroups = new Map<string, TimetableCommonGroup>();
  version.common.commonGroups.forEach((commonGroup) => {
    commonGroups.set(commonGroup.id, commonGroup);
  });
  const interclassGroups = new Map<string, TimetableInterclassGroup>();
  version.common.interclassGroups.forEach((interclassGroup) => {
    interclassGroups.set(interclassGroup.id, interclassGroup);
  });
  const students = new Map<string, TimetableStudent>();
  version.common.students.forEach((student) => {
    students.set(student.id, student);
  });
  return {
    timeSlots,
    days,
    weeks,
    periods,
    buildings,
    rooms,
    classes,
    subjects,
    teachers,
    commonGroups,
    interclassGroups,
    students,
  };
}

function getUnit(common: ReturnType<typeof getCommon>) {
  if (unitType === 'o') return common.classes.get(props.unitId);
  if (unitType === 'n') return common.teachers.get(props.unitId);
  if (unitType === 's') return common.rooms.get(props.unitId);
  return common.students.get(props.unitId);
}

onMounted(async () => {
  //TODO: Obsługa błędów
  school.value = await getSchoolById(props.schoolId);
  if (school.value.optivum_versions.length) {
    version.value = await getOptivumVersion(
      props.schoolId,
      props.generatedOn,
      props.discriminant
    );
    common.value = getCommon(version.value);
    unit.value = getUnit(common.value);
    // TODO: Błędny id unit
  }
  loading.value = false;
});
</script>

<template>
  <div class="sidebar" v-if="common">
    <input type="text" placeholder="Szukaj"/>
    <ul>
      <li>
        <div>Oddziały</div>
        <ul>
          <li v-for="(class_, index) in common.classes.values()" :key="index">{{ class_.fullName }}</li>
        </ul>
      </li>
      <li>
        <div>Nauczyciele</div>
        <ul>
          <li v-for="(teacher, index) in common.teachers.values()" :key="index">{{ teacher.fullName }}</li>
        </ul>
      </li>
      <li>
        <div>Sale</div>
        <ul>
          <li v-for="(room, index) in common.rooms.values()" :key="index">{{ room.fullName }}</li>
        </ul>
      </li>
      <li>
        <div>Zestawienia</div>
        <ul>
          <li>Oddziały</li>
          <li>Nauczyciele</li>
          <li>Sale</li>
        </ul>
      </li>
    </ul>
    <button>Znajdź wolną salę</button>
  </div>
</template>

<style lang="scss">
.sidebar {
  width: 350px;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  border-right: 1px solid #dfdfdf;
  overflow: scroll;
}
</style>
