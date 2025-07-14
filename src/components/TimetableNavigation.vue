<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable.store';
import TimetableNavigationSection from './TimetableNavigationSection.vue';
import { LucideGraduationCap, LucideMapPin, LucideUsers } from 'lucide-vue-next';
import TimetableNavigationUnit from './TimetableNavigationUnit.vue';
import { useRoute } from 'vue-router';
import { notNullableComputed, getUnitTitle } from '@/utils';

const timetableStore = useTimetableStore();
const route = useRoute();

const common = notNullableComputed(() => timetableStore.preparedVersionData?.common);
</script>

<template>
  <ul>
    <TimetableNavigationSection
      :icon="LucideGraduationCap"
      show-unit-list-default
      name="Oddziały"
      v-if="common.classes.size"
    >
      <TimetableNavigationUnit
        v-for="unit in common.classes.values()"
        :key="unit.id"
        :name="getUnitTitle(unit)"
        :to="{
          name: 'timetable:unit',
          params: { ...route.params, unitId: unit.id, unitTypeSlug: 'oddzial' },
        }"
      />
    </TimetableNavigationSection>

    <TimetableNavigationSection :icon="LucideUsers" name="Nauczyciele" v-if="common.teachers.size">
      <TimetableNavigationUnit
        v-for="unit in common.teachers.values()"
        :key="unit.id"
        :name="getUnitTitle(unit)"
        :to="{
          name: 'timetable:unit',
          params: { ...route.params, unitId: unit.id, unitTypeSlug: 'nauczyciel' },
        }"
      />
    </TimetableNavigationSection>

    <TimetableNavigationSection :icon="LucideMapPin" name="Sale" v-if="common.rooms.size">
      <TimetableNavigationUnit
        v-for="unit in common.rooms.values()"
        :key="unit.id"
        :name="getUnitTitle(unit)"
        :to="{
          name: 'timetable:unit',
          params: { ...route.params, unitId: unit.id, unitTypeSlug: 'sala' },
        }"
      />
    </TimetableNavigationSection>

    <TimetableNavigationSection :icon="LucideMapPin" name="Uczniowie" v-if="common.students.size">
      <TimetableNavigationUnit
        v-for="unit in common.students.values()"
        :key="unit.id"
        :name="getUnitTitle(unit)"
        :to="{
          name: 'timetable:unit',
          params: { ...route.params, unitId: unit.id, unitTypeSlug: 'uczen' },
        }"
      />
    </TimetableNavigationSection>
  </ul>
</template>
