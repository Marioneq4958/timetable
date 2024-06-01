<script setup lang="ts">
import { getCommon } from "@/utils";
import { ref } from "vue";

const props = defineProps<{ common: ReturnType<typeof getCommon> }>();

const activeSection = ref<string | null>(null);
function handleSectionClick(sectionName: "classes" | "teachers" | "rooms") {
  if (activeSection.value === sectionName) {
    activeSection.value = null;
  } else {
    activeSection.value = sectionName;
  }
}
</script>

<template>
  <div class="sidebar">
    <input type="text" placeholder="Szukaj" />
    <ul class="units-list">
      <li class="units-list__section">
        <button @click="handleSectionClick('classes')">Oddziały</button>
        <ul class="units-list__section-list" v-if="activeSection === 'classes'">
          <li
            v-for="(class_, index) in props.common.classes.values()"
            :key="index"
          >
            {{ class_.fullName }}
          </li>
        </ul>
      </li>
      <li class="units-list__section">
        <button @click="handleSectionClick('teachers')">Nauczyciele</button>
        <ul class="units-list__section-list" v-if="activeSection === 'teachers'">
          <li
            v-for="(teacher, index) in props.common.teachers.values()"
            :key="index"
          >
            {{ teacher.fullName }}
          </li>
        </ul>
      </li>
      <li class="units-list__section">
        <button @click="handleSectionClick('rooms')">Sale</button>
        <ul class="units-list__section-list" v-if="activeSection === 'rooms'">
          <li v-for="(room, index) in props.common.rooms.values()" :key="index">
            {{ room.fullName }}
          </li>
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
  background: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  input {
    width: 100%;
  }
  button {
    font-family: "Poppins", sans-serif;
  }
  .units-list {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 5px;
    .units-list__section {
      margin-top: 10px;
      button {
        width: 100%;
        text-align: left;
        font-family: "Poppins", sans-serif;
        overflow: scroll;
      }
      .units-list__section-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
