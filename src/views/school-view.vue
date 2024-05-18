<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { School, TimetableVersionData } from "@/api/types";
import { getOptivumVersion, getSchoolById } from "@/api/client";
import { getFullAddress } from "@/utils";
import { RouterLink } from "vue-router";

const props = defineProps<{
  schoolId: number;
  generatedOn: string;
  discriminant: number;
}>();

const school = ref<School | null>(null);
const version = ref<TimetableVersionData | null>(null);
const loading = ref<boolean>(true);

onMounted(async () => {
  //TODO: Obsługa błędów
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
  <header class="header" v-if="school">
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
  <div class="header--skeleton" v-else-if="loading">
    <div class="header--skeleton__actions">
      <div class="header--skeleton__actions-btn" />
      <span style="flex: 1" />
      <div class="header--skeleton__actions-btn" />
      <div class="header--skeleton__actions-btn" />
    </div>
    <div class="header--skeleton__title" />
    <div class="header--skeleton__subtitle" />
  </div>
  <div class="center" v-if="loading">Ładowanie danych...</div>
  <div class="center" v-else-if="!school">Nie znaleziono szkoły</div>
  <!-- TODO: Redirect do /s/:schoolId gdy w urlu jest określona wersja która nie istnieje -->
  <div class="center" v-else-if="!version">
    {{
      props.generatedOn && props.discriminant
        ? "Nie znaleziono planu"
        : "Ta szkoła nie posiada żadnego planu"
    }}
  </div>
  <main class="main" v-else>
    <div class="flex-row">
      <div class="flex-col">
        <div class="section__title">Oddziały</div>
        <div class="section__content">
          <ul class="units-list">
            <li
              class="units-list__item"
              v-for="(unit, index) in version.common.classes"
              :key="index"
            >
              <router-link to="#">{{
                unit.short ?? unit.name ?? unit.fullName
              }}</router-link>
            </li>
          </ul>
          <router-link to="#">Zestawienie</router-link>
        </div>
      </div>
      <div class="flex-col">
        <div class="section__title">Nauczyciele</div>
        <div class="section__content">
          <div class="input">
            <label class="input__label" for="input-teacher-search">Szukaj</label>
            <input id="input-teacher-search" class="input__control" />
          </div>
          <ul class="units-list">
            <li
              class="units-list__item"
              v-for="(unit, index) in version.common.teachers"
              :key="index"
            >
              <router-link to="#">{{
                unit.fullName ?? unit.name ?? unit.short
              }}</router-link>
            </li>
          </ul>
          <router-link to="#">Zestawienie</router-link>
        </div>
      </div>
      <div class="flex-col">
        <div class="section__title">Sale</div>
        <div class="input">
          <label class="input__label" for="input-room-search">Szukaj</label>
          <input id="input-room-search" class="input__control" />
        </div>
        <div class="section__content">
          <ul class="units-list">
            <li
              class="units-list__item"
              v-for="(unit, index) in version.common.rooms"
              :key="index"
            >
              <router-link to="#">{{
                unit.fullName ?? unit.name ?? unit.short
              }}</router-link>
            </li>
          </ul>
          <button>Szukaj</button>
          <router-link to="#">Zestawienie</router-link>
        </div>
      </div>
    </div>
    <p>
      Wygenerowano
      {{ props.generatedOn ?? school.optivum_versions[0].generated_on }} z
      użyciem planu Optivum firmy VULCAN
    </p>
  </main>
</template>

<style lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}
main.main {
  margin-top: 20px;
  flex: 1;
}
.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.flex-row {
  display: flex;
  gap: 15px;
}
.flex-col {
  flex: 1;
}
.section__title {
  font-weight: 600;
}
ul.units-list {
  background: #fff;
  border-radius: 7px;
  list-style: none;
  margin: 10px 0 0 0;
  padding: 8px;
  border: 1px solid #efefef;
  li.units-list__item {
    a {
      width: 100%;
      display: block;
      padding: 8px 10px;
      border-radius: 5px;
      text-decoration: none;
      color: #030303;
      transition: all 0.25s ease-out;
      font-size: 15px;
      &:hover {
        background: #0000000b;
        color: #000;
      }
    }
  }
}
</style>
