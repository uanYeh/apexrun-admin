<template>
  <TheNavbar></TheNavbar>
  <div class="container-fluid mt-3 position-relative">
    <ToastMessages></ToastMessages>
    <RouterView />
  </div>
</template>
<script>
import emitter from "@/methods/emitter";
import ToastMessages from "@/components/ToastMessages.vue";
import TheNavbar from "@/components/TheNavbar.vue";

export default {
  components: {
    TheNavbar,
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    };
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log(token);
    this.$http.defaults.headers.common.Authorization = token;

    const api = `${import.meta.env.VITE_APP_API}api/user/check`;

    this.$http
      .post(api, this.user)
      .then((res) => {
        // console.log(res);
        if (!res.data.success) {
          this.$router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        this.$router.push("/login");
      });
  },
};
</script>
