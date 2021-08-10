import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Avatar, Button, ConfigProvider, Dropdown, Menu } from "ant-design-vue";
import HeaderComponent from 'menu-header-component/dist/menu-header-component.umd.js'
import 'menu-header-component/dist/menu-header-component.css'

const app = createApp(App)

app.use(router)

app.use(Button)
app.use(Menu)
app.use(Avatar)
app.use(Dropdown)
app.use(ConfigProvider)

app.use(HeaderComponent)

app.mount("#app");
