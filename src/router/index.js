import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { path: "/login", query: { demo: "1" } },
    },
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
          path: "categories",
          name: "dashboard-categories",
          component: () => import("@/views/CategoryView.vue"),
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
