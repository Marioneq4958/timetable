<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { School, TimetableUnit, TimetableVersion } from "@/types";
import { getVersion, getSchoolById } from "@/api/client";
import { getCommon } from "@/utils";
import TimetableSidebar from "@/components/timetable-sidebar.vue";
import TimetableInfoBanner from "@/components/timetable-info-banner.vue";
import TimetableHeader from "@/components/timetable-header.vue";
import UnitTimetable from "@/components/unit-timetable.vue";
import { useRouter } from "vue-router";

type PropsUnit = {
  typeName: "oddzialy" | "nauczyciele" | "sale" | "uczniowie";
  id: string;
};
type PropsVersion = {
  id: string;
  type: "optivum";
};
const props = defineProps<{
  schoolId: number;
  version?: PropsVersion;
  unit?: PropsUnit;
}>();
const router = useRouter();
const school = ref<School | null>(null);
const version_ = ref<TimetableVersion | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const common = ref<ReturnType<typeof getCommon> | null>(null);

const currentUnit = ref<TimetableUnit | null>(null);

watch(
  () => props,
  async () => await loadData(),
  { deep: true }
);

onMounted(async () => await loadData());

async function loadData() {
  loading.value = true;
  error.value = null;
  if (props.schoolId !== school.value?.rspo_id) {
    school.value = await getSchoolById(props.schoolId);
    if (!school.value.optivum_versions.length) {
      error.value = "no-versions";
      loading.value = false;
      return;
    }
  }
  if (
    props.version?.type !== version_.value?.type ||
    props.version?.id !== version_.value?.id ||
    !props.version ||
    !version_.value
  ) {
    // TODO: Edupage
    const v =
      school.value.optivum_versions.find(
        (v) => `${v.generated_on}/${v.discriminant}` === props.version?.id
      ) ?? school.value.optivum_versions[0];
    const versionData = await getVersion(
      school.value.rspo_id,
      "optivum",
      `${v.generated_on}/${v.discriminant}`
    );
    version_.value = {
      generatedOn: v.generated_on,
      id: `${v.generated_on}/${v.discriminant}`,
      type: "optivum",
      data: versionData,
    };
  }
  common.value = getCommon(version_.value.data);
  if (
    props.unit &&
    (props.unit.id !== currentUnit.value?.data.id ||
      props.unit.typeName[0] !== currentUnit.value?.type)
  )
    currentUnit.value = (findUnit(
      common.value,
      props.unit.id,
      props.unit.typeName[0] as "o" | "n" | "s" | "u"
    ) ?? null) as TimetableUnit | null;
  if (!currentUnit.value)
    currentUnit.value = {
      type: "o",
      data: [...common.value.classes.values()][0],
    };
  router.replace(
    `/s/${school.value.rspo_id}/${version_.value.type}/${
      version_.value.id
    }/${getUnitPathName(currentUnit.value.type)}/${currentUnit.value.data.id}`
  );
  loading.value = false;
}

function findUnit(
  common: ReturnType<typeof getCommon>,
  unitId: string,
  unitType: "o" | "n" | "s" | "u"
) {
  let data;
  if (unitType === "o") {
    data = common.classes.get(unitId);
  } else if (unitType === "n") {
    data = common.teachers.get(unitId);
  } else if (unitType === "s") {
    data = common.rooms.get(unitId);
  } else if (unitType === "u") {
    data = common.students.get(unitId);
  }
  if (data) return { type: unitType, data };
}

function getUnitPathName(unitType: "o" | "n" | "s" | "u") {
  switch (unitType) {
    case "o":
      return "oddzialy";
    case "n":
      return "nauczyciele";
    case "s":
      return "sale";
    case "u":
      return "uczniowie";
  }
}
</script>

<template>
  <template v-if="!error && school && currentUnit && version_ && common">
    <timetable-sidebar :common="common" :version="version_" :school="school" />
    <div class="p-4 lg:p-7 w-full max-w-screen-2xl mx-auto">
      <timetable-header
        :unit="currentUnit"
        :version="version_"
        :school="school"
      />
      <unit-timetable
        :unit="currentUnit"
        :version="version_"
        :common="common"
      />
      <timetable-info-banner :version="version_" />
    </div>
  </template>
  <template v-else>
    <p v-if="error === 'no-versions'">
      Nie znaleziono żadnych planów tej szkoły
    </p>
  </template>
</template>
