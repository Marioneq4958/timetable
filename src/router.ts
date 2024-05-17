import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/s/:schoolId(\\d+)",
      component: () => import("@/views/school-view.vue"),
      props: true,
    },
    {
      path: "/s/:schoolId(\\d+)/optivum/:generatedOn/:discriminant(\\d+)",
      component: () => import("@/views/school-view.vue"),
      props: true,
    },
  ],
});

export default router;
