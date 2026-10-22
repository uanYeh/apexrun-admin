<template>dashboard</template>
<script>
export default {
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(token);
    this.$http.defaults.headers.common.Authorization = token;

    const api = `${import.meta.env.VITE_APP_API}user/check`;

    this.$http
      .post(api, this.user)
      .then((res) => {
        console.log(res);
        if (!res.data.succes) {
          this.$router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
