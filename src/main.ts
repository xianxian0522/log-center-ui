import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  Avatar,
  Button,
  ConfigProvider,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu, Modal,
  Select, Table
} from "ant-design-vue";
import HeaderComponent from 'menu-header-component/dist/menu-header-component.umd.js'
import 'menu-header-component/dist/menu-header-component.css'

const app = createApp(App)

app.use(router)

app.use(Button)
app.use(Menu)
app.use(Avatar)
app.use(Dropdown)
app.use(ConfigProvider)
app.use(Layout)
app.use(Form)
app.use(Input)
app.use(Select)
app.use(DatePicker)
app.use(Table)
app.use(Modal)

app.use(HeaderComponent)

app.mount("#app");
