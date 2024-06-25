import { useDark, useStorage, useToggle } from "@vueuse/core";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const isDark = useDark({
    selector: "#app",
    attribute: "class",
    valueDark: "dark",
  });
  const toggleDark = useToggle(isDark);

  const favouriteUnits = useStorage<string[]>("favourite-units", []);
  function toggleFavouriteUnit(unit: string) {
    const index = favouriteUnits.value.indexOf(unit);
    if (index === -1) favouriteUnits.value.push(unit);
    else favouriteUnits.value.splice(index, 1);
  }

  return { toggleDark, favouriteUnits, toggleFavouriteUnit };
});
