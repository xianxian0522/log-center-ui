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
          <a-menu-item v-for="item in bar" :key="item.path">
            <span>
              <icon-font :type="item.icon" style="margin-right: 10px" />
              <router-link :to="{name: item.route}">{{ item.name }}</router-link>
            </span>
          </a-menu-item>
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
import { createFromIconfontCN } from "@ant-design/icons-vue";
import { useRoute } from "vue-router";

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2739460_lsxhejxhdz.js'
})

export default defineComponent({
  name: "Layout",
  components: { IconFont },
  setup() {
    const route = useRoute()
    const url = route.path.split('/')

    const selectedKeysMenu = ref([url[2]])
    const bar = ref<BarItem[]>([
      {id: 1, icon: 'icon-log', path: 'list', name: '日志查看', route: 'log'},
      {id: 2, icon: 'icon-configure', path: 'configure', name: '设置', route: 'configure'},
      {id: 3, icon: 'icon-search', path: 'search', name: '高级搜索', route: 'search'},
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
