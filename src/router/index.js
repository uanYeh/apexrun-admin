import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
      children: [
        {
          path: "products",
          name: "dashboard-products",
          component: () => import("@/views/ProductView.vue"),
        },
      ],
    },
  ],
});

export default router;
