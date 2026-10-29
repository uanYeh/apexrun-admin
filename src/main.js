import { createApp } from "vue";
import { createPinia } from "pinia";

import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router";
import Loading from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
import { currency, date } from "@/methods/filters.js";
import $httppageMessageState from "@/methods/pageMessageState.js";

import "../stylesheets/all.scss";

import "bootstrap/js/dist/alert";
import "bootstrap/js/dist/button";
import "bootstrap/js/dist/carousel";
import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/offcanvas";
import "bootstrap/js/dist/popover";
import "bootstrap/js/dist/scrollspy";
import "bootstrap/js/dist/tab";
import "bootstrap/js/dist/toast";
import "bootstrap/js/dist/tooltip";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const app = createApp(App);
app.config.globalProperties.$filters = {
  currency,
  date,
};
app.config.globalProperties.$httppageMessageState = $httppageMessageState;
app.use(VueAxios, axios);
app.use(createPinia());
app.use(router);
app.component("Loading", Loading);
app.mount("#app");
