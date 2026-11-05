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
      meta: { title: "登入" },
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
          meta: { title: "商品管理" },
        },
        {
          path: "categories",
          name: "dashboard-categories",
          component: () => import("@/views/CategoryView.vue"),
          meta: { title: "分類管理" },
        },
        {
          path: "orders",
          name: "dashboard-orders",
          component: () => import("@/views/OrderView.vue"),
          meta: { title: "訂單管理" },
        },
        {
          path: "Coupons",
          name: "dashboard-Coupons",
          component: () => import("@/views/CouponsView.vue"),
          meta: { title: "優惠券" },
        },
        {
          path: "Article",
          name: "dashboard-Article",
          component: () => import("@/views/ArticleView.vue"),
          meta: { title: "文章管理" },
        },
      ],
    },
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Apexrun-admin` : "Apexrun-admin";
});

export default router;
