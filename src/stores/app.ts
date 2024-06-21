import { useDark, useToggle } from "@vueuse/core";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const isDark = useDark({
    selector: "#app",
    attribute: "class",
    valueDark: "dark",
  });
  const toggleDark = useToggle(isDark);
  return { toggleDark };
});
