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
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
      children: [
        {
          path: "products",
          name: "dashboard-products",
          component: () => import("@/views/ProductView.vue"),
        },
        {
          path: "orders",
          name: "dashboard-orders",
          component: () => import("@/views/OrderView.vue"),
        },
        {
          path: "Coupons",
          name: "dashboard-Coupons",
          component: () => import("@/views/CouponsView.vue"),
        },
        {
          path: "Article",
          name: "dashboard-Article",
          component: () => import("@/views/ArticleView.vue"),
        },
      ],
    },
  ],
});

export default router;
