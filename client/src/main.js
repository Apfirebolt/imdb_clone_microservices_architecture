import { createApp } from "vue";
import "./style.css";
import router from "./routes";
import vuetify from "./plugins/vuetify";
import { createPinia } from "pinia";
import App from "./App.vue";

createApp(App).use(router).use(createPinia()).use(vuetify).mount("#app");
