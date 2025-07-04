import { useDark, useToggle } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', () => {
  const dark = useDark();
  const toggleDark = useToggle(dark);

  return { dark, toggleDark };
});
