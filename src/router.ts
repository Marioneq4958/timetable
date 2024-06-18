import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/s/:schoolId(\\d+)/optivum/:generatedOn/:discriminant(\\d+)/:unitTypeName(oddzialy|nauczyciele|sale)/:unitId",
      component: () => import("@/views/timetable.vue"),
      props: true,
    },
  ],
});

export default router;
