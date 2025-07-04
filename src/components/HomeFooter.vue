<script setup lang="ts">
const getCurrentYear = () => new Date().getFullYear();
</script>

<template>
  <footer class="font-medium text-muted-foreground text-center text-xs">
    &copy; {{ getCurrentYear() }} <br />
    Stworzone przez
    <a href="https://github.com/dominik-korsa" target="_blank" class="hover:underline">
      Dominik Korsa
    </a>
    i
    <a href="https://github.com/Marioneq4958" target="_blank" class="hover:underline">
      Marioneq4958 </a
    >.
    <br />
    <a href="https://github.com/Marioneq4958/timetable2.0" target="_blank" class="underline">
      GitHub (MIT)
    </a>
  </footer>
</template>
