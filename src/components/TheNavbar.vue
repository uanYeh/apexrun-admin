<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand fw-bold" to="/dashboard/products">APEXRUN Admin</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              active-class="active fw-bolder text-primary"
              to="/dashboard/products"
              >產品頁</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              active-class="active fw-bolder text-primary"
              to="/dashboard/categories"
              >分類頁</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              active-class="active fw-bolder text-primary"
              to="/dashboard/orders"
              >訂單頁</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              active-class="active fw-bolder text-primary"
              to="/dashboard/Coupons"
              >優惠頁</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              active-class="active fw-bolder text-primary"
              to="/dashboard/Article"
              >文章頁</RouterLink
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">登出</a>
          </li>
        </ul>
        <!-- <a class="navbar-text link-dark text-decoration-none me-3">
          <i class="bi bi-journal-text me-1"></i>操作手冊
        </a> -->
        <a
          href="https://uanyeh.github.io/Apexrun/"
          target="_blank"
          rel="noopener"
          class="navbar-text link-dark text-decoration-none"
        >
          前往前台 <i class="bi bi-box-arrow-up-right ms-1"></i>
        </a>
      </div>
    </div>
  </nav>

  <div class="alert alert-warning rounded-0 border-0 text-center small py-2 mb-0" role="alert">
    <i class="bi bi-info-circle me-1"></i>
    此後台僅供作品展示與測試使用，歡迎操作體驗，請勿刪除既有商品與訂單，感謝您！
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      const api = `${import.meta.env.VITE_APP_API}logout`;

      this.$http
        .post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            this.$router.push("/login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
