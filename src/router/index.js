import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/dashobard",
      name: "dashobard",
      component: () => import("@/views/DashboardView.vue"),
    },
  ],
});

export default router;
