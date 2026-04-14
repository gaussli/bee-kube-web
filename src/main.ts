import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "@/router";
import Layout from "@/components/Layout/index.vue";
import App from "./App.vue";
import "@/styles/global.scss";

const app = createApp(App);
const pinia = createPinia();

// 使用插件
app.use(pinia);
app.use(router);
app.use(ElementPlus);

// 全局组件
app.component("Layout", Layout);

app.mount("#app");
