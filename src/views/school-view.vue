<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { School, TimetableVersionData } from "@/api/types";
import { getOptivumVersion, getSchoolById } from "@/api/client";
import { getFullAddress } from "@/utils";

const props = defineProps<{
  schoolId: number;
  generatedOn: string;
  discriminant: number;
}>();

const school = ref<School | null>(null);
const version = ref<TimetableVersionData | null>(null);
const loading = ref<boolean>(true);

onMounted(async () => {
  school.value = await getSchoolById(props.schoolId);
  if (school.value.optivum_versions.length) {
    version.value = await getOptivumVersion(
      props.schoolId,
      props.generatedOn ?? school.value.optivum_versions[0].generated_on,
      props.discriminant ?? school.value.optivum_versions[0].discriminant
    );
  }
  loading.value = false;
});
</script>

<template>
  <div class="header--skeleton" v-if="!school">
    <div class="header--skeleton__actions">
      <div class="header--skeleton__actions-btn" />
      <span style="flex: 1" />
      <div class="header--skeleton__actions-btn" />
      <div class="header--skeleton__actions-btn" />
    </div>
    <div class="header--skeleton__title" />
    <div class="header--skeleton__subtitle" />
  </div>
  <header class="header" v-else>
    <div class="header__actions">
      <button class="header__actions-btn">
        <span class="material-symbols-rounded"> keyboard_backspace </span>
      </button>
      <span style="flex: 1" />
      <button class="header__actions-btn">
        <span class="material-symbols-rounded"> print </span>
      </button>
      <button class="header__actions-btn">
        <span class="material-symbols-rounded"> contrast </span>
      </button>
    </div>
    <div class="header__title">{{ school.name }}</div>
    <div class="header__subtitle">
      {{ getFullAddress(school) }}
      <a
        :href="`https://rspo.gov.pl/institutions/${school.rspo_id}`"
        target="_blank"
        >[RSPO: {{ school.rspo_id }}]</a
      >
    </div>
  </header>
  <p v-if="loading || !version || !school">Ładowanie danych...</p>
  <div v-else>
    <table>
      <tbody>
        <tr>
          <td>Szkoła</td>
          <td>{{ school }}</td>
        </tr>
        <tr>
          <td>Klasy</td>
          <td>{{
        version.common.classes
          .map((unit) => unit.short ?? unit.name ?? unit.fullName)
          .join(", ")
      }}</td>
        </tr>
        <tr>
          <td>Nauczyciele</td>
          <td>{{
        version.common.teachers
          .map((unit) => unit.fullName ?? unit.name ?? unit.short)
          .join(", ")
      }}</td>
        </tr>
        <tr>
          <td>Sale</td>
          <td>{{
        version.common.rooms
          .map((unit) => unit.fullName ?? unit.name ?? unit.short)
          .join(", ")
      }}</td>
        </tr>
        <tr>
          <td>Wygenerowano</td>
          <td>{{ props.generatedOn ?? school.optivum_versions[0].generated_on }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
