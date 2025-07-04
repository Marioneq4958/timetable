<script setup lang="ts">
import TimetableUnitHeader from '@/components/TimetableUnitHeader.vue';
import TimetableUnitTable from '@/components/TimetableUnitTable.vue';
import TimetableDrawerTrigger from '@/components/TimetableDrawerTrigger.vue';
import { useTimetableStore } from '@/stores/timetable.store';
import type { TimetableUnit, UnitType } from '@/timetable';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMediaQuery } from '@vueuse/core';
import { notNullableComputed } from '@/utils';

const props = defineProps<{
  unitType: UnitType;
  unitId: string;
}>();

const timetableStore = useTimetableStore();
const unit = ref<TimetableUnit | null>(null);
const router = useRouter();
const route = useRoute();

const preparedVersionData = notNullableComputed(timetableStore.preparedVersionData);

function getUnit(type: UnitType, id: string): TimetableUnit | undefined {
  let unitWithoutType: Omit<TimetableUnit, 'type'> | undefined = undefined;
  switch (type) {
    case 'o':
      unitWithoutType = preparedVersionData.value.common.classes.get(id);
      break;
    case 'n':
      unitWithoutType = preparedVersionData.value.common.teachers.get(id);
      break;
    case 's':
      unitWithoutType = preparedVersionData.value.common.rooms.get(id);
      break;
    case 'u':
      unitWithoutType = preparedVersionData.value.common.students.get(id);
      break;
  }
  return unitWithoutType ? ({ ...unitWithoutType, type } as TimetableUnit) : undefined;
}

watch(
  () => props,
  async () => {
    const foundUnit = getUnit(props.unitType, props.unitId);
    if (foundUnit) return (unit.value = foundUnit);
    const firstClass = [...preparedVersionData.value.common.classes.values()][0];
    const newUnit = {
      ...firstClass,
      type: 'o' as const,
    };
    await router.replace({
      name: 'timetable:unit',
      params: { ...route.params, unitTypeSlug: 'oddzial', unitId: newUnit.id },
    });
  },
  { immediate: true, deep: true },
);

const useDrawer = useMediaQuery('(width < 48rem)');
</script>

<template>
  <template v-if="unit">
    <TimetableDrawerTrigger
      v-if="useDrawer"
      :title="
        ('fullName' in unit ? unit.fullName : undefined) ?? unit.name ?? unit.short ?? 'Bez nazwy'
      "
      @click="timetableStore.toggleMenu(true)"
    />
    <TimetableUnitHeader :unit="unit" />
    <TimetableUnitTable :unit="unit" />
  </template>
</template>
