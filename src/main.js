import { createApp } from "vue";
import { createPinia } from "pinia";

import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router";

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

app.use(VueAxios, axios);
app.use(createPinia());
app.use(router);

app.mount("#app");
