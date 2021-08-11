<template>
  <a-layout class="log-layout">
    <HeaderComponent :logoTitle="'LOG-CENTER'" :menuSelect="'/log'" />
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          v-model:selectedKeys="selectedKeysMenu"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="9">option9</a-menu-item>
          <a-menu-item key="10">option10</a-menu-item>
          <a-menu-item key="11">option11</a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="log-layout-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { BarItem } from "@/utils/response";

export default defineComponent({
  name: "Layout",
  setup() {
    const selectedKeysMenu = ref(['9'])
    const bar = ref<BarItem[]>([
      {id: 1, icon: '', path: '', name: '日志查看', route: ''},
      {id: 2, icon: '', path: '', name: '', route: ''},
      {id: 2, icon: '', path: '', name: '', route: ''},
    ])

    return {
      selectedKeysMenu,
      bar,
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.log-layout {
  height: inherit;
}
.log-layout-content {
  background-color: #fff;
  border-left: 1px solid #DCDEE5;
  padding: 20px;
}
</style>
