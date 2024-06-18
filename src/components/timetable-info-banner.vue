<template>
  <div
    class="mt-5 p-3 bg-white rounded-md border flex gap-3 items-center text-sm"
  >
    <!--  v-if="version.generatedOn || version.validateDate" -->
    <div
      class="p-2.5 rounded-md bg-gray-200 material-symbols-rounded text-xl leading-5"
    >
      info
    </div>
    <div class="flex-1">
      Plan wygenerowany <span class="font-medium">brakuje danych z api</span>,
      obowiązuje od <span class="font-medium">brakuje danych z api</span>
    </div>
    <button
      class="rounded-md bg-gray-200 font-medium px-3.5 py-2 text-gray-700 hover:text-gray-900 transition-all"
    >
      Więcej informacji
    </button>
  </div>
</template>
