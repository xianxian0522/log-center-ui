import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: '/middle'
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: "/middle",
    name: "middle",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Middle.vue"),
  },
  {
    path: '/log',
    component: () => import('../components/Layout.vue'),
    children: [
      {
        path: '',
        name: 'log',
        component: () => import('../views/LogCenter.vue'),
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
