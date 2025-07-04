import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    name: 'intro',
    path: '/intro',
    component: () => import('@/views/IntroView.vue')
  },
  {
    name: 'schools-map',
    path: '/mapa-szkol/:schoolId(\\d+)?',
    props: (route) => ({
      schoolId: route.params.schoolId ? Number(route.params.schoolId) : undefined,
    }),
    component: () => import('@/views/SchoolsMapView.vue'),
  },
  {
    name: 'timetable',
    path: '/plan/:schoolId(\\d+)',
    component: () => import('@/layouts/TimetableLayout.vue'),
    props: (route) => ({
      schoolId: Number(route.params.schoolId),
    }),
  },
  {
    name: 'timetable:version',
    path: '/plan/:schoolId(\\d+)/:versionType(optivum|edupage)/:versionId(\\d+)',
    component: () => import('@/layouts/TimetableLayout.vue'),
    props: (route) => ({
      schoolId: Number(route.params.schoolId),
      versionId: `${route.params.versionType}/${route.params.versionId}`,
    }),
    children: [
      {
        name: 'timetable:unit',
        path: '/plan/:schoolId(\\d+)/:versionType(optivum|edupage)/:versionId(\\d+)/:unitTypeSlug(oddzial|nauczyciel|sala|uczen)/:unitId',
        component: () => import('@/views/UnitTimetableView.vue'),
        props: (route) => ({
          ...route.params,
          unitType: route.params.unitTypeSlug ? route.params.unitTypeSlug[0] : undefined,
        }),
      },
    ],
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

export default routes;
