<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            type="email"
            id="inputEmail"
            class="form-control"
            placeholder="Email address"
            required
            autofocus
            v-model="user.username"
          />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            required
            v-model="user.password"
          />
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <!-- 測試帳號一鍵登入（給面試官用） -->
          <button
            v-if="hasDemo"
            class="btn btn-lg btn-outline-secondary"
            type="button"
            :disabled="isLoading"
            @click="demoSignIn"
          >
            訪客登入
          </button>
          <button class="btn btn-lg btn-primary btn-block" type="submit" :disabled="isLoading">
            登入
          </button>
        </div>
        <p v-if="errorMsg" class="text-danger text-end mt-2 mb-0">{{ errorMsg }}</p>
      </div>
    </form>
  </div>
</template>
<script>
const DEMO_USER = {
  username: import.meta.env.VITE_DEMO_EMAIL || "",
  password: import.meta.env.VITE_DEMO_PASSWORD || "",
};

export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      isLoading: false,
      errorMsg: "",
    };
  },
  computed: {
    hasDemo() {
      return Boolean(DEMO_USER.username && DEMO_USER.password);
    },
  },
  methods: {
    signIn() {
      const api = `${import.meta.env.VITE_APP_API}admin/signin`;
      this.isLoading = true;
      this.errorMsg = "";

      this.$http
        .post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data;
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
            this.$router.push("/dashboard/products");
          } else {
            this.errorMsg = "帳號或密碼錯誤";
          }
        })
        .catch(() => {
          this.errorMsg = "帳號或密碼錯誤";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    demoSignIn() {
      this.user = { ...DEMO_USER };
      this.signIn();
    },
  },
  mounted() {
    if (this.$route.query.demo === "1" && this.hasDemo) {
      this.demoSignIn();
    }
  },
};
</script>
