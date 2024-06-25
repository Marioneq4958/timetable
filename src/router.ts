import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // TODO: Edupage
      path: "/s/:schoolId(\\d+)/:versionType(optivum)/:versionId(.*)/:unitTypeName(oddzialy|nauczyciele|sale)/:unitId",
      component: () => import("@/views/timetable-view.vue"),
      props: (route) => ({
        schoolId: Number(route.params.schoolId),
        version: {
          type: route.params.versionType,
          id: route.params.versionId,
        },
        unit: {
          typeName: route.params.unitTypeName,
          id: route.params.unitId,
        },
      }),
    },
    {
      // TODO: Edupage
      path: "/s/:schoolId(\\d+)/:versionType(optivum)/:versionId(.*)",
      component: () => import("@/views/timetable-view.vue"),
      props: (route) => ({
        schoolId: Number(route.params.schoolId),
        version: {
          type: route.params.versionType,
          id: route.params.versionId,
        },
      }),
    },
    {
      path: "/s/:schoolId(\\d+)",
      component: () => import("@/views/timetable-view.vue"),
      props: (route) => ({
        schoolId: Number(route.params.schoolId),
      }),
    },
  ],
});

export default router;
