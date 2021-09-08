import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  Avatar,
  Button,
  ConfigProvider,
  DatePicker, Descriptions,
  Dropdown, Empty,
  Form,
  Input,
  Layout,
  Menu, Modal,
  Select, Spin, Table, Tag, Tooltip
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
app.use(Spin)
app.use(Descriptions)
app.use(Tag)
app.use(Empty)
app.use(Tooltip)

app.use(HeaderComponent)

app.mount("#app");
